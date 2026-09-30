import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashBoardLayout({ children }: { children: React.ReactNode }) {
    const user = await auth();
    if (!user) {
        redirect("/sign-in")
    }
    return (
        <div className="m-h-screen bg-gray-50 ">
            <main className="py-8">
                <div className="container max-auto px-4">{children}</div>
            </main>
        </div>
    )
}