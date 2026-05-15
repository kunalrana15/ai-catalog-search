import { generateQuery } from "../providers/gemini.providers.js";
import { TOOL_REGISTRY, ToolName } from "../tools/toolRegistry.js";
import { AppError } from "../../middlewares/errorHandler.js";

export async function runAIQuery(
    userQuery: string,
    context?: { requestId?: string; userId?: string }
) {
    const startTime = Date.now();

    // 1. Get function call from Gemini — guaranteed structured, no parsing needed
    const functionCall = await generateQuery(userQuery);

    // 2. Validate tool exists in registry
    const toolName = functionCall.name as ToolName;
    const toolEntry = TOOL_REGISTRY[toolName];

    if (!toolEntry) {
        throw new AppError(`Unknown tool: ${toolName}`, 400, 'UNKNOWN_TOOL');
    }

    // 3. Execute tool with timeout
    const toolPromise = toolEntry.handler(functionCall.args as any, context);
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tool execution timeout")), 10_000)
    );

    try {
        const result = await Promise.race([toolPromise, timeoutPromise]);

        console.log({
            requestId: context?.requestId,
            tool: toolName,
            args: functionCall.args,
            duration: Date.now() - startTime,
        });

        return result;
    } catch (err) {
        throw new AppError(
            `Execution failed for tool: ${toolName}`,
            500,
            'TOOL_EXECUTION_FAILED'
        );
    }
}