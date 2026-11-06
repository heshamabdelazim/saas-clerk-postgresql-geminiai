import { Brain, Shield, Upload, Users } from "lucide-react";

export const features = [
    {
        icon: Brain,
        title: "AI powered analysis",
        description: "Get instant summaries and insights with Google gemenai AI",
    },
    {
        icon: Users,
        title: "Multi Tenant",
        description: "Separate organizations with isolated document storage",
    },
    {
        icon: Upload,
        title: "Easy upload",
        description: "drag and drop or select files in multiple formaats",
    },
    {
        icon: Shield,
        title: "Secure",
        description: "Your documents are encrypted and stored securely",
    }

]
export const steps = [
    "Sign up for free account",
    "Create an organization",
    "Upload documents",
    "Get AI analysis instantly"
];

export const allAlloweedTypes: readonly string[] = [
    "text/plain",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/markdown",
    "text/x-markdown",
];

export const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A"

    // Scalable O(1) =>just push to the array "BB" 
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;

    /*
     Just Readable O(1)
     if(bytes<1024) return `${bytes} bytes`
     if(bytes<1024^2) return `${bytes/1024} KB`
     if(bytes<1024^3) return `${bytes/1024/1024} MB`
     if(bytes<1024^4) return `${bytes/1024/1024/1024} GB`
     if(bytes<1024^5) return `${bytes/1024/1024/1024/1024} TB`
     */
}