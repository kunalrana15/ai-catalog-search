import geminiModel from "../../config/gemini.js";
import { QUERY_PROMPT } from "../prompts/query.prompt.js";


export async function generateQuery (userQuery: string) {
    try {
        
        const finalPrompt = `
         ${QUERY_PROMPT}

         User Query:
         ${userQuery}
        `;

        const response = await geminiModel.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: finalPrompt
        });

        console.log("GEMINI RESPONSE IS:",response.text)

        return response.text?.trim();
    } catch (error) {
        throw new Error('Gemini Provider Error')
    }
}
