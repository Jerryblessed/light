export default async function handler(req, res) {
    const { method, query } = req;
    const { 'x-tva-sa-id': saId, 'x-tva-sa-secret': saSecret } = req.headers;

    if (method === 'GET') {
        const response = await fetch(
            `https://api.thetavideoapi.com/stream/${query.id}`,
            {
                method: 'GET',
                headers: {
                    'x-tva-sa-id': saId,
                    'x-tva-sa-secret': saSecret,
                },
            }
        );
        const data = await response.json();
        res.status(response.status).json(data);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
}
