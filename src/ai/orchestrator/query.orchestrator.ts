import { generateQuery } from "../providers/gemini.providers.js";
import { TOOL_REGISTRY, ToolName } from "../tools/toolRegistry.js";
import { SearchTitleSchema } from "../types/query.schema.js";

const MAX_RETRIES = 2;

type AIQueryResponse = {
    tool: ToolName;
    filters: any;
};

function safeJsonParse(raw: string): unknown {
    // strip markdown code fences if AI wraps in ```json ... ```
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    try {
        return JSON.parse(cleaned);
    } catch {
        throw new Error("AI returned invalid JSON");
    }
}

async function getValidatedAIResponse(
    userQuery: string,
    attempt: number = 1,
    previousError?: string
): Promise<AIQueryResponse> {

    // On retry, tell the AI exactly what went wrong
    const retryContext = previousError
        ? `\n\nYour previous response failed with this error: "${previousError}". Fix it and try again.`
        : "";

    const rawResponse = await generateQuery(userQuery + retryContext);

    if (!rawResponse) {
        throw new Error("Empty AI response");
    }

    // Parse JSON
    let parsedJSON: unknown;
    try {
        parsedJSON = safeJsonParse(rawResponse);
    } catch (err) {
        if (attempt < MAX_RETRIES) {
            console.warn(`[Retry ${attempt}] JSON parse failed. Retrying...`);
            return getValidatedAIResponse(userQuery, attempt + 1, "Response was not valid JSON");
        }
        throw new Error("AI returned invalid JSON after retries");
    }

    // Validate structure
    const parsed = parsedJSON as AIQueryResponse;
    if (!parsed.tool || parsed.filters === undefined) {
        if (attempt < MAX_RETRIES) {
            console.warn(`[Retry ${attempt}] Missing tool/filters. Retrying...`);
            return getValidatedAIResponse(
                userQuery,
                attempt + 1,
                'Response must have "tool" and "filters" fields'
            );
        }
        throw new Error("Invalid AI response structure after retries");
    }

    // Validate tool exists
    const toolEntry = TOOL_REGISTRY[parsed.tool];
    if (!toolEntry) {
        if (attempt < MAX_RETRIES) {
            console.warn(`[Retry ${attempt}] Unknown tool "${parsed.tool}". Retrying...`);
            return getValidatedAIResponse(
                userQuery,
                attempt + 1,
                `"${parsed.tool}" is not a valid tool. Valid tools are: searchTitles`
            );
        }
        throw new Error(`Unknown tool: ${parsed.tool}`);
    }

    // Validate against Zod schema
    const zodResult = toolEntry.schema.safeParse(parsedJSON);
    if (!zodResult.success) {
        const zodError = zodResult.error.issues
            .map((i: any) => `${i.path.join(".")}: ${i.message}`)
            .join(", ");

        if (attempt < MAX_RETRIES) {
            console.warn(`[Retry ${attempt}] Zod validation failed: ${zodError}. Retrying...`);
            return getValidatedAIResponse(
                userQuery,
                attempt + 1,
                `Schema validation failed: ${zodError}`
            );
        }
        throw new Error(`Validation failed after retries: ${zodError}`);
    }

    return zodResult.data as AIQueryResponse;
}

export async function runAIQuery(
    userQuery: string,
    context?: { requestId?: string; userId?: string }
) {
    const startTime = Date.now();

    const validatedResponse = await getValidatedAIResponse(userQuery);

    const toolEntry = TOOL_REGISTRY[validatedResponse.tool];

    // Execute with timeout
    const toolPromise = toolEntry.handler(validatedResponse.filters, context);
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tool execution timeout")), 10_000)
    );

    try {
        const result = await Promise.race([toolPromise, timeoutPromise]);

        console.log({
            requestId: context?.requestId,
            tool: validatedResponse.tool,
            filters: validatedResponse.filters,
            duration: Date.now() - startTime,
        });

        return result;
    } catch (err) {
        console.error("Tool execution failed:", {
            tool: validatedResponse.tool,
            error: err,
        });
        throw new Error(`Execution failed for tool: ${validatedResponse.tool}`);
    }
}