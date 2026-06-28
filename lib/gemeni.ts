import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("Missing Google GenAI API key");
}

const genAI = new GoogleGenerativeAI(apiKey); // client helper for interacting with Gemini AI

export async function analayzeWithGemini(
    text: string,
    analysisType: "summary" | "qa" | "sentiment" | "entities" | "extract"
) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const prompts = {
            summary: "Make a summary for this text: " + text,
            qa: "Make a question about this text and the answers: " + text,
            sentiment: "Make a sentiment analysis for this text: " + text,
            entities: "Make an entities extraction for this text: " + text,
            extract: "Make an extract from this text: " + text,
        }
        const result = await model.generateContent(prompts[analysisType])
        return result.response.text();

    } catch (err) {
        console.log(err)
        return `couldn't analyize for ${analysisType}`;
    }
}