import { del, put } from '@vercel/blob';

export async function uploadToBlob(
    file: File,
    organizationId: string,
    userId: string
): Promise<{ url: string, pathName: string }> {
    try {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const pathName = `org-${organizationId}/users-${userId}/${fileName}`; //org-123/users-123/1759352281180-name.pdf
        const blob = await put(pathName, file, { access: "public", token: process.env.BLOB_READ_WRITE_TOKEN });
        return { url: blob.url, pathName: blob.pathname };
    } catch (err) {
        console.error("Error uploading to blob:", err);
        throw new Error("failed to uplaoded the file");
    }
}

export async function deleteFromBlob(
    url: string
): Promise<void> {
    try {
        await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN })
    } catch (err) {
        console.error("Error deleting from blob:", err);
        throw new Error("failed to delete the file");
    }
}