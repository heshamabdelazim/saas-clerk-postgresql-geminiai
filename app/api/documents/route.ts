import { uploadToBlob } from "@/lib/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "unautherized" }, { status: 401 })
        }

        // receiving FORM
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const content = formData.get("content") as string;
        const clerkOrgId = formData.get("organizationId") as string;
        const file = formData.get("file") as File;

        if (!name || !clerkOrgId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // We want to create a document. Document for what org? check if the org alreayd exists
        /*
        If you tried to create a Document with an organizationId that doesn't exist in your database, 
        PostgreSQL would crash with a Foreign Key Constraint Error. Line 28 prevents this.
        */
        const organization = await prisma.organization.findUnique({
            where: { clerkOrgId: clerkOrgId as string }
        })
        if (!organization) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        }

        //getting user
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: {
                memberships: {
                    where: { organizationId: organization.id },
                    include: {
                        organization: true,
                    }
                }
            }
        })

        if (!user || user?.memberships.length === 0) {
            return NextResponse.json({ error: "You are not autherized to access this document" }, { status: 403 });
        }


        let fileUrl = null;
        let fileSize = null;
        let fileType = null;
        let extractedContent = content;

        // Upload the file to Vercel Blob
        if (file && file.size > 0) {
            const blob = await uploadToBlob(file, clerkOrgId, userId);
            fileUrl = blob.url;
            fileSize = file.size;
            fileType = file.type;
            if (!extractedContent && file.type.includes("text")) {
                extractedContent = await file.text();
            }
        }

        // creating a new document
        const document = await prisma.document.create({
            data: {
                name,
                content: extractedContent || null,
                fileType: fileType || "unknown",
                fileSize: fileSize || 0,
                fileUrl,
                organizationId: organization.id,
                userId: user.id,
                aiKeywords: [],
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                organization: {
                    select: {
                        name: true,
                        clerkOrgId: true,
                    }
                },
            }
        })

        return NextResponse.json({
            success: true,
            message: "Document uploaded Successfully",
            document: {
                id: document.id,
                name: document.name,
                fileUrl: document.fileUrl,
                organization: document.organization.name,
                uploadedBy: document.user.name

            }
        })
    } catch (err: any) {
        // return error response
        console.error("Document upload error: ", err)
        return NextResponse.json({ error: err.message || "Failed to upload document" }, { status: 500 })
    }
}

//retriving the created document again

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "unautherized" }, { status: 401 })
        }

        // api👉 /api/documents?organizationId=xxxxxxxx
        const { searchParams } = new URL(request.url); // dataStructure => URLSearchParams {size: 1}
        const clerkOrgId = searchParams.get("organizationId")
        if (!clerkOrgId) {
            return NextResponse.json({ error: "Organization is required" }, { status: 404 })
        }

        // getting org
        const organization = await prisma.organization.findUnique({
            where: { clerkOrgId }
        });
        if (!organization) {
            return NextResponse.json({ error: "Organization not found" }, { status: 404 });
        }

        // getting user
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: {
                memberships: {
                    where: {
                        organizationId: organization.id
                    },
                    include: {
                        organization: true,
                    }
                }
            }
        })

        // get documents for orgnization
        const documents = await prisma.document.findMany({
            where: { organizationId: organization.id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                organization: {
                    select: {
                        name: true,
                        clerkOrgId: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json({
            documents,
            metadata: {
                organization: organization.name,
                clerkOrgId: organization.clerkOrgId,
                documentCount: documents.length
            }
        })
    } catch (err: any) {
        console.log("Failed to fetch documents", err)
        return NextResponse.json({ error: err.message || "failed to fetch documents" }, { status: 500 })
    }
}