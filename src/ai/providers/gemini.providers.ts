import geminiModel from "../../config/gemini.js";
import { QUERY_PROMPT } from "../prompts/query.prompt.js";
import { TOOL_DEFINITIONS } from "../tools/toolDefinitions.js";


export async function generateQuery (userQuery: string) {
    try {
        
        const response = await geminiModel.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: userQuery,
            config: {
                tools: [{ functionDeclarations: TOOL_DEFINITIONS }],
                systemInstruction: `You are a query parser for a movie and series database. 
                When the user asks about movies or series, always call the appropriate function.
                Never respond with text. Always use a function call.`
            }
        });

        // Extract the function call from the response
        const candidate = response.candidates?.[0];
        const part = candidate?.content?.parts?.[0];

        if(!part?.functionCall) {
            throw new Error('No function call returned by Gemini');
        }

        console.log("GEMINI FUNCTION CALL:",JSON.stringify(part.functionCall,null,2));
        return part.functionCall;

    } catch (error) {
        throw new Error(`Gemini Provider Error:${error}`);
    }
}

