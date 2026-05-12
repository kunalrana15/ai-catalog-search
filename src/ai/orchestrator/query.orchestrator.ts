
import { searchTitles } from "../tools/searchTitles.tool.js";
import { generateQuery } from "../providers/gemini.providers.js";
import { AIQueryResponse } from "../types/ai.type.js";

export async function runAIQuery(userQuery: string) {
    // call the gemini for response
    const rawResponse = await generateQuery(userQuery);

    if(!rawResponse) {
        throw new Error('Empty AI Response')
    }

    // Convert string to json
    const parsedResponse: AIQueryResponse = JSON.parse(rawResponse);

    // execute the tool 
    switch (parsedResponse.tool) {

        case 'searchTitles':
            return await searchTitles(parsedResponse.filters);
        
        default:
            throw new Error('Invalid tool');
    
    }
}