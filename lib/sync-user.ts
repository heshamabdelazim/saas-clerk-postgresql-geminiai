// For Clerk "Sign-up" & "Sign-in"

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function syncUserToDatabase() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return null;
        }
        const email = clerkUser.emailAddresses[0]?.emailAddress || "";
        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

        // Check if user exists in db
        let dbUser = await prisma.user.findUnique({ where: { clerkUserId: clerkUser.id } })
        if (dbUser) {
            // updating existing user
            dbUser = await prisma.user.update({ where: { id: dbUser.id }, data: { email, name: name || dbUser.name } })
        } else {
            // creating new user
            dbUser = await prisma.user.create({ data: { clerkUserId: clerkUser.id, email, name: name || "user" } })
            console.log("New user created");
        }
        return dbUser;
    } catch (error) {
        console.error("Failed to sync user to database", error);
        return error;
    }
}