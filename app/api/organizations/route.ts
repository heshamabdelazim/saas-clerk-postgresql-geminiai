import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // getting the user who made the req
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unautherized" }, { status: 401 })
        }
        // getting the POST request body
        const body = await request.json();
        const { name, clerkOrgId, slug } = body;
        if (!name || !clerkOrgId) {
            return NextResponse.json({ error: "missing required fields" }, { status: 400 })
        }

        // check if the organization exists (by looking at prisma)
        const existingOrgInDb = await prisma.organization.findUnique({
            where: { clerkOrgId },
        });
        if (existingOrgInDb) {
            return NextResponse.json({ success: true, organiaztion: existingOrgInDb, beso: "mdo7s", message: "organization already exists" })
        }
        // create or find user
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId }
        })
        if (!user) {
            return NextResponse.json({ error: "user is not logged in" }, { status: 401 })
        }

        // create organization in db
        const organization = await prisma.organization.create({
            data: {
                clerkOrgId,
                name,
                slug: slug || name.toLowerCase(/\s+/g, "-")
            }
        })
        await prisma.organizationMember.create({
            data: {
                userId: user.id,
                organizationId: organization.id,
                role: "owner"
            }
        })

        return NextResponse.json({ success: true, organization, message: "Organization created successfully" }, { status: 200, });

    } catch (err: any) {
        // return error response
        console.error("Post organization", err)
        return NextResponse.json({ error: err.message || "server side catched error" }, { status: 500 })
    }

}