import { FunctionDeclaration, Type } from "@google/genai";

export const TOOL_DEFINITIONS: FunctionDeclaration[] = [
    {
        name: "searchTitles",
        description: "Search movies and series using filters like genre, language, type, release year or live status",
        parameters: {
            type: Type.OBJECT,
            properties: {
                type: {
                    type: Type.STRING,
                    enum: ["movie", "series"],
                    description: "Whether to search movies or series"
                },
                language: {
                    type: Type.STRING,
                    description: "Language of the title e.g. Hindi, English, Tamil"
                },
                genres: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "List of genres in lowercase e.g. action, sci-fi, comedy"
                },
                isLive: {
                    type: Type.BOOLEAN,
                    description: "Whether the title is currently live or streaming"
                },
                releaseYear: {
                    type: Type.OBJECT,
                    description: "Filter by release year range",
                    properties: {
                        $gt: { type: Type.NUMBER, description: "Released after this year" },
                        $lt: { type: Type.NUMBER, description: "Released before this year" }
                    }
                }
            }
        }
    },
    {
        name: "getRecommendations",
        description: "Get recommendations similar to a title the user mentions e.g. something like Inception, movies similar to Interstellar",
        parameters: {
            type: Type.OBJECT,
            properties: {
                titleName: {
                    type: Type.STRING,
                    description: "The name of the title the user mentioned"
                },
                limit: {
                    type: Type.NUMBER,
                    description: "How many recommendations to return, default 10"
                }
            },
            required: ["titleName"]
        }
    }
];