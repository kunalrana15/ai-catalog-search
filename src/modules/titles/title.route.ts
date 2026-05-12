import { Router } from 'express';
import { TitleController } from './title.controller.js';

const router = Router();
const controller = new TitleController();

router.get('/',controller.getTitles);

export default router;