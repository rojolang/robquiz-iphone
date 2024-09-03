import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { eventType, clickId, price } = req.body;
        const apiKey = process.env.KOWBOYKIT_API_KEY;
        const programId = process.env.KOWBOYKIT_PROGRAM_ID;

        try {
            const response = await axios.get(`https://api.public.kowboykit.com/events/${eventType}/`, {
                params: {
                    programid: programId,
                    apikey: apiKey,
                    clickid: clickId,
                    nofire: 1,
                    price: price,
                },
            });

            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Error communicating with KowboyKit API' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
