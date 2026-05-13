import { Title } from "../../modules/titles/title.model.js";

export async function searchTitles (filters: any, context: { requestId?: string; userId?: string; } | undefined) {
    return await Title.find(filters);
}