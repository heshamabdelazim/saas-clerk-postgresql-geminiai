import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncUserToDatabase } from "@/lib/sync-user";

export default async function DashBoardLayout({ children }: { children: React.ReactNode }) {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in")
    }
    await syncUserToDatabase();
    return (
        <div className="m-h-screen bg-gray-50 ">
            <main className="py-8">
                <div className="container max-auto px-4">{children}</div>
            </main>
        </div>
    )
}
