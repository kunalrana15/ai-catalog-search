import express from 'express';
import titleRoutes from '../modules/titles/title.route.js'

const router = express.Router();

router.get('/test',(req,res) => {
    return res.status(200).json({
        success: true,
        message: "Server is working fine"
    })
});

router.use('/titles',titleRoutes);


export default router;