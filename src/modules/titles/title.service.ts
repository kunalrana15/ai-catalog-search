import { TitleRepository } from "./title.repository.js";

export class TitleService {

    private titleRepository = new TitleRepository();

    async getTitles() {
        return await this.titleRepository.findAll();
    }

    async createTitle(data: any) {
        return this.titleRepository.create(data);
    }

}