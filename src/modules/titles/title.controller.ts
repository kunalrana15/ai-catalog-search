import { Request,Response,NextFunction } from 'express';
import { TitleService } from './title.service.js';

const titleservice = new TitleService();

export class TitleController {

    async getTitles(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const titles = await titleservice.getTitles();

            return res.json({
                success: true,
                data: titles
            })
        } catch (error) {
            next(error);
        }
    }

}