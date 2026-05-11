import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

if(!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI API KEY is missing');
}

const geminiModel = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

export default geminiModel;