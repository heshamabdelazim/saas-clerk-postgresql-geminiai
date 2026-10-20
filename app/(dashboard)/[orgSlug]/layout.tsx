import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";

interface OrgLayoutProps {
    children: React.ReactNode
    params: Promise<{ orgSlug: string }>
}
export default async function OrgLayout({ children, params }: OrgLayoutProps) {
    const { userId } = await auth();
    const { orgSlug } = await params;

    if (!userId) {
        redirect("/sign-in")
    }

    const organization = await prisma.organization.findUnique({
        where: {
            slug: orgSlug
        }
    })

    if (!organization) {
        redirect("/select-org")
    }

    const membership = await prisma.organizationMember.findFirst({
        where: {
            organizationId: organization.id,
            user: { clerkUserId: userId }
        }
    })

    if (!membership) {
        redirect("/select-org")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Organization Banner             */}
            <Card className="w-full shadow-sm border">
                <CardContent>
                    <div className="w-full shadow-sm border">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight">{organization.name}</h1>
                            <p className="text-sm text-muted-foreground">Organization workspace</p>
                        </div>
                        <Badge className="px-4 py-1.5 font-medium">{membership.role}</Badge>
                    </div>
                </CardContent>
            </Card>
            {/* Main Content */}
            <main className="py-8">
                <div className="container mx-auto px-4">
                    {children}
                </div>
            </main>
        </div>
    )
}