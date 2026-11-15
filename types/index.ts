export interface Document {
    id: string,
    name: string,
    content: string
    fileUrl: string,
    fileSize: number,
    fileType: string,
    aiSummary: string,
    aiKeywords: string[],
    sentiment: string,
    createdAt: number,
    user: {
        name: string,
        email: string
    }
}

// export interface AnalysisType {
//     type: "summary" | "qa" | "sentiment" | "entities" | "extract"
// }

export type AnalysisType =
  | "summary"
  | "qa"
  | "sentiment"
  | "entities"
  | "extract"
  | null