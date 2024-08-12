export default async function handler(req, res) {
    const { method } = req;
    const { 'x-tva-sa-id': saId, 'x-tva-sa-secret': saSecret } = req.headers;

    if (method === 'PUT') {
        const response = await fetch(
            'https://api.thetavideoapi.com/edge-node/ingestor/unselect',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tva-sa-id': saId,
                    'x-tva-sa-secret': saSecret,
                },
                body: JSON.stringify(req.body),
            }
        );
        const data = await response.json();
        res.status(response.status).json(data);
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
