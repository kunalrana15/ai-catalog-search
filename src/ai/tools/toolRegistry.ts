import { searchTitles } from "./searchTitles.tool.js";
import { SearchTitleSchema } from "../types/query.schema.js";

export type ToolContext = {
    requestId?: string;
    userId?: string;
};

export type ToolHandler<T = any, R = any> = (
    input: T,
    context?: ToolContext
) => Promise<R>;

export type ToolDefinition<T = any, R = any> = {
    name: string;
    description: string;
    schema: any; // zod schema
    handler: ToolHandler<T, R>;
};

export const TOOL_REGISTRY = {
    searchTitles: {
        name: "searchTitles",
        description: "Search movie and series titles using filters",
        schema: SearchTitleSchema,
        handler: searchTitles,
    },
} as const;

export type ToolName = keyof typeof TOOL_REGISTRY;