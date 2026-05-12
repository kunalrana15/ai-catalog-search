import { TitleRepository } from "./title.repository.js";
import { runAIQuery } from "../../ai/orchestrator/query.orchestrator.js";

export class TitleService {

    private titleRepository = new TitleRepository();

    async getTitles() {
        return await this.titleRepository.findAll();
    }

    async createTitle(data: any) {
        return this.titleRepository.create(data);
    }

    async search(query: string) {
        return await runAIQuery(query);
    }

}