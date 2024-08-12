import { useState, CSSProperties } from 'react';

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: '#FFFFFF',
        fontFamily: 'Arial, Helvetica, sans-serif',
        padding: '20px',
    },
    header: {
        marginBottom: '20px',
        color: '#FF6347',
    },
    input: {
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #FF6347',
        fontSize: '16px',
        width: '300px',
    },
    button: {
        backgroundColor: '#FF6347',
        color: 'white',
        border: 'none',
        padding: '15px 20px',
        margin: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#FF4500',
    },
    responseContainer: {
        backgroundColor: '#282c34',
        padding: '20px',
        borderRadius: '5px',
        marginTop: '20px',
        width: '80%',
        maxWidth: '800px',
        overflowX: 'auto',
    },
    responseText: {
        color: '#FFFFFF',
    },
};

export default function Home() {
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [streamId, setStreamId] = useState('');
    const [serviceAccountId, setServiceAccountId] = useState('');
    const [serviceAccountSecret, setServiceAccountSecret] = useState('');
    const [hover, setHover] = useState<{ [key: string]: boolean }>({});

    const callApi = async (endpoint: string, method: string = 'POST', body: any = null): Promise<any> => {
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-tva-sa-id': serviceAccountId,
                'x-tva-sa-secret': serviceAccountSecret,
            },
            body: body ? JSON.stringify(body) : null,
        });
        const data = await response.json();
        setApiResponse(data);
        return data;
    };

    const createLivestream = async () => {
        const data = await callApi('/api/createLivestream');
        if (data.status === 'success') {
            setStreamId(data.body.id);
        }
    };

    const retrieveLivestream = async () => {
        if (streamId) {
            await callApi(`/api/retrieveLivestream?id=${streamId}`, 'GET');
        } else {
            alert('Create a livestream first!');
        }
    };

    const selectEdgeIngestor = async () => {
        if (streamId) {
            await callApi('/api/selectEdgeIngestor', 'PUT', {
                streamId,
                ingestorId: '0x093D7e6936fbd2e86f72DB6A5060CbC1535A232A'
            });
        } else {
            alert('Create a livestream first!');
        }
    };

    const unselectEdgeIngestor = async () => {
        if (streamId) {
            await callApi('/api/unselectEdgeIngestor', 'PUT', {
                ingestorId: '0x093D7e6936fbd2e86f72DB6A5060CbC1535A232A'
            });
        } else {
            alert('Create a livestream first!');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Theta Livestream service</h1>
            <a href='https://docs.thetatoken.org/docs/theta-video-api-livestream'>Read more</a>
            <input
                style={styles.input}
                type="text"
                placeholder="Enter Service Account ID"
                value={serviceAccountId}
                onChange={(e) => setServiceAccountId(e.target.value)}
            />
            <input
                style={styles.input}
                type="text"
                placeholder="Enter Service Account Secret"
                value={serviceAccountSecret}
                onChange={(e) => setServiceAccountSecret(e.target.value)}
            />
            <button
                style={{ ...styles.button, ...(hover.create ? styles.buttonHover : {}) }}
                onClick={createLivestream}
                onMouseEnter={() => setHover({ ...hover, create: true })}
                onMouseLeave={() => setHover({ ...hover, create: false })}
            >
                Create Livestream
            </button>
            <button
                style={{ ...styles.button, ...(hover.retrieve ? styles.buttonHover : {}) }}
                onClick={retrieveLivestream}
                onMouseEnter={() => setHover({ ...hover, retrieve: true })}
                onMouseLeave={() => setHover({ ...hover, retrieve: false })}
            >
                Retrieve Livestream
            </button>
            <button
                style={{ ...styles.button, ...(hover.listLivestreams ? styles.buttonHover : {}) }}
                onClick={() => callApi('/api/listLivestreams', 'GET')}
                onMouseEnter={() => setHover({ ...hover, listLivestreams: true })}
                onMouseLeave={() => setHover({ ...hover, listLivestreams: false })}
            >
                List Livestreams
            </button>
            <button
                style={{ ...styles.button, ...(hover.listEdgeIngestors ? styles.buttonHover : {}) }}
                onClick={() => callApi('/api/listEdgeIngestors', 'GET')}
                onMouseEnter={() => setHover({ ...hover, listEdgeIngestors: true })}
                onMouseLeave={() => setHover({ ...hover, listEdgeIngestors: false })}
            >
                List Edge Ingestors
            </button>
            <button
                style={{ ...styles.button, ...(hover.selectEdgeIngestor ? styles.buttonHover : {}) }}
                onClick={selectEdgeIngestor}
                onMouseEnter={() => setHover({ ...hover, selectEdgeIngestor: true })}
                onMouseLeave={() => setHover({ ...hover, selectEdgeIngestor: false })}
            >
                Select Edge Ingestor
            </button>
            <button
                style={{ ...styles.button, ...(hover.unselectEdgeIngestor ? styles.buttonHover : {}) }}
                onClick={unselectEdgeIngestor}
                onMouseEnter={() => setHover({ ...hover, unselectEdgeIngestor: true })}
                onMouseLeave={() => setHover({ ...hover, unselectEdgeIngestor: false })}
            >
                Unselect Edge Ingestor
            </button>
            {apiResponse && (
                <div style={styles.responseContainer}>
                    <p style={styles.responseText}>Status: {apiResponse.status}</p>
                    {apiResponse.body && (
                        <div style={styles.responseText}>
                            <p>ID: {apiResponse.body.id}</p>
                            <p>Name: {apiResponse.body.name}</p>
                            <p>Status: {apiResponse.body.status}</p>
                            {apiResponse.body.update_time && (
                                <p>Update Time: {new Date(apiResponse.body.update_time).toLocaleString()}</p>
                            )}
                            {apiResponse.body.playback_uri && <p>Playback URI: {apiResponse.body.playback_uri}</p>}
                            {apiResponse.body.player_uri && <p>Player URI: {apiResponse.body.player_uri}</p>}
                            {apiResponse.body.stream_server && (
                                <p>Stream Server: {apiResponse.body.stream_server}</p>
                            )}
                            {apiResponse.body.stream_key && (
                                <p>Stream Key: {apiResponse.body.stream_key}</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
