import { Title } from "../../modules/titles/title.model.js";

export async function searchTitles (filters: any) {
    return await Title.find(filters);
}