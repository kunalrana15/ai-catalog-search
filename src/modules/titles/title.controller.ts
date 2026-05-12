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

    async search(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            // fetch the query from the req body 
            const query = req.body.query as string;
            // pass the query to the service layer
            const results = await titleservice.search(query);

            return res.json({
                success: true,
                data: results
            })
        } catch (error) {
            next(error);
        }
    }

}