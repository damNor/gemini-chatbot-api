import 'dotenv/config';
import express from 'express';
import cors from 'cors';             // add this line
import path from 'path';             // add this line 
import { fileURLToPath } from 'url'; // add this line
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);  // add this line  
const __dirname = path.dirname(__filename);          // add this line

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(cors());                                                    // add this line   
app.use(express.json())                                             // add this line
// Serve all files at public folder to serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));            // add this line

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servernya siap di akses di http://localhost: ${PORT}` )); 

app.post('/api/chat', async (req, res) => {
    
    const { conversation } = req.body;

    try{
        if(!Array.isArray(conversation)) 
            throw new Error('Messages must be an array');

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{text}]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                systemInstruction: "You are a cat. Your name is chibi.",
                temperature: 0.1,
            }
        });

        res.status(200).json({ result : response.text })

    }
    catch(e)
    {
        res.status(500).json({ error: e.message })
    }
});