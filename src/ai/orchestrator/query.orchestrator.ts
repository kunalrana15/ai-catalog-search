import { generateQuery } from "../providers/gemini.providers.js";
import { TOOL_REGISTRY, ToolName } from "../tools/toolRegistry.js";
import { SearchTitleSchema } from "../types/query.schema.js";

type AIQueryResponse = {
    tool: ToolName;
    filters: any;
};

function safeJsonParse(raw: string): unknown {
    try {
        return JSON.parse(raw);
    } catch {
        throw new Error("AI returned invalid JSON");
    }
}

export async function runAIQuery(
    userQuery: string,
    context?: { requestId?: string; userId?: string }
) {
    const startTime = Date.now();

    // 1. Get AI response
    const rawResponse = await generateQuery(userQuery);

    if (!rawResponse) {
        throw new Error("Empty AI response");
    }

    // 2. Parse JSON safely
    const parsedJSON = safeJsonParse(rawResponse);

    // 3. Validate top-level structure (IMPORTANT)
    const parsedResponse = parsedJSON as AIQueryResponse;

    if (!parsedResponse.tool || !parsedResponse.filters) {
        throw new Error("Invalid AI response structure");
    }

    // 4. Validate tool exists (SECURITY SAFE)
    const toolEntry = TOOL_REGISTRY[parsedResponse.tool];

    if (!toolEntry) {
        throw new Error(`Tool not found: ${parsedResponse.tool}`);
    }

    // 5. Validate input using tool schema (CRITICAL)
    let validatedInput;

    try {
        validatedInput = toolEntry.schema.parse(parsedResponse.filters);
    } catch (err) {
        throw new Error(`Tool validation failed for ${parsedResponse.tool}`);
    }

    // 6. Execute tool with timeout safety
    const toolPromise = toolEntry.handler(validatedInput, context);

    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tool execution timeout")), 10_000)
    );

    try {
        const result = await Promise.race([toolPromise, timeoutPromise]);

        // 7. Logging (VERY IMPORTANT for production)
        console.log({
            requestId: context?.requestId,
            tool: parsedResponse.tool,
            duration: Date.now() - startTime,
        });

        return result;
    } catch (err) {
        console.error("Tool execution failed:", {
            tool: parsedResponse.tool,
            error: err,
        });

        throw new Error(`Execution failed for tool: ${parsedResponse.tool}`);
    }
}