export default async function handler(req, res) {
    const { method } = req;
    const { 'x-tva-sa-id': saId, 'x-tva-sa-secret': saSecret } = req.headers;

    if (method === 'POST') {
        const response = await fetch('https://api.thetavideoapi.com/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-tva-sa-id': saId,
                'x-tva-sa-secret': saSecret,
            },
            body: JSON.stringify({ name: 'demo' }),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
