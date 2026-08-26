import { analayzeWithGemini } from "@/lib/gemeni";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // Check auth
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "You need to login" }, { status: 401 })
        }

        // get request data from the body
        const { documentId, organizationId, analysisType } = await request.json();
        if (!documentId || !organizationId) {
            return NextResponse.json({ error: "some fields are required" }, { status: 400 })
        }

        // find document
        const document = await prisma.document.findFirst({
            where: {
                id: documentId,
                organization: {
                    clerkOrgId: organizationId,
                    members: {
                        some: {
                            user: {
                                clerkUserId: userId
                            }
                        }
                    }
                }
            }
        })

        if (!document) {
            return NextResponse.json({ error: "No document found or Access denied" }, { status: 404 })
        }
        // get the document content
        const content = document.content || document.name;
        if (!content) {
            return NextResponse.json({ error: "document has no content to analysis" }, { status: 400 })
        }
        // analysis using gemeni
        const summary = await analayzeWithGemini(content, analysisType);

        // save/update result to db
        const updatedDocument = await prisma.document.update({
            where: {
                id: documentId,
            },
            data: {
                aiSummary: summary,
                aiKeywords: ["analyized"],
                sentiment: analysisType
            }
        })
        // return response
        return NextResponse.json({
            success: true,
            summary,
            document: {
                id: updatedDocument.id,
                name: updatedDocument.name,
                aiSummary: updatedDocument.aiSummary,
            }
        })

    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to analyze" }, { status: 500 })
    }
}