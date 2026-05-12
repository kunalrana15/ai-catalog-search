import { Title } from "./title.model.js";

export class TitleRepository {
    
    async findAll() {
        return await Title.find().limit(10);
    }

    async create(data: any) {
        return await Title.create(data);
    }

    async search(filters: any) {
        return await Title.find(filters);
    }

}