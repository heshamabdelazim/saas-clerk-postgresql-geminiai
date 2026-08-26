import { deleteFromBlob } from "@/lib/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface routeParams {
    params: Promise<{ documentId: string }> //this promise will resolve {documentId:string}
}

export async function DELETE(request: Request, { params }: routeParams) {
    try {
        const { documentId } = await params;
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "unauthenized" }, { status: 401 })
        }


        // getting the document
        const document = await prisma.document.findFirst({
            where: { id: documentId },
            include: {
                organization: {
                    include: {
                        members: {
                            where: {
                                user: { clerkUserId: userId }
                            }
                        }
                    }
                }
            }
        });
        if (!document) {
            return NextResponse.json({ error: "doc not found or no access" }, { status: 404 });
        }
        // check autherization
        if (document.organization.members.length === 0) {
            return NextResponse.json({ error: "You are not autherized to delete this document" }, { status: 403 });
        }

        //delete file from vercel blob if exists
        if (document.fileURL) {
            try {
                await deleteFromBlob(document.fileURL);
            } catch (err) {
                console.log("Failed to delete from blob", err)
            }
        }

        // delete document from db
        await prisma.document.delete({
            where: { id: documentId }
        })

        return NextResponse.json({ message: "Document deleted successfully" })
    } catch (err: any) {
        console.log("Failed to delete document", err)
        return NextResponse.json({ error: err.message || "Failed to delete document" }, { status: 500 })
    }
}