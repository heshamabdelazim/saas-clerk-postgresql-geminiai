export interface Document {
    id: string,
    name: string,
    content: string
    fileUrl: string,
    fileSize: number,
    fileType: String,
    aiSummary: String,
    aiKeywords: string[],
    sentiment: string,
    createdAt: number,
    user: {
        name: string,
        email: string
    }
}

/**
 *   id              String        
  name            String
  content         String?
  fileUrl         String?
  fileSize        Int?
  fileType        String?
  aiSummary       String?
  aiKeywords      String[]
  sentiment       String?
  organizationId  String
  userId          String 
 * 
 */