import { useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import styles from './video.module.css';
import React, { DragEvent, useRef, ChangeEvent } from 'react';
import cx from 'classnames';
import axios from 'axios';
import { isAddress } from '@ethersproject/address'; // Correct import for isAddress

export default function Video() {
    const resolutions = [2160, 1080, 720, 360];
    const workers = ['External Elite Edge Node']; // ['External Elite Edge Node', 'Internal Worker']; -> Internal worker not usable
    const networks = [
        { name: 'Theta Mainnet', value: 361 },
        { name: 'Theta Testnet', value: 365 },
        { name: 'Ethereum Mainnet', value: 1 },
        { name: 'ETH Goerli Testnet', value: 5 },
    ];

    const [videoURL, setVideoURL] = React.useState('');
    const [videoName, setVideoName] = React.useState('');
    const [videoDescription, setVideoDescription] = React.useState('');
    const [selectedResolutions, setSelectedResolutions] = React.useState<number[]>([]);
    const [selectedWorker, setSelectedWorker] = React.useState<string>('External Elite Edge Node');
    const [collections, setCollections] = useState([{ address: '', network: 'Theta Mainnet' }]);
    const [apiKeys, setApiKeys] = React.useState({ key: '', secret: '' });
    const [errorMessage, setErrorMessage] = React.useState('');
    const [videoFile, setVideoFile] = React.useState<File | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [transcodingId, setTranscodingId] = React.useState('');

    const fileInputRef = useRef<HTMLInputElement>(null); // for the Drag and drop element

    React.useEffect(() => {
        setSelectedResolutions(resolutions);
    }, []);

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files[0].type.slice(0, 5) === 'video') {
            setVideoFile(files[0]);
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0].type.slice(0, 5) === 'video') {
            console.log(files[0]);
            setVideoFile(files[0]);
        }
    };

    const toggleResolution = (resolution: number) => {
        if (selectedResolutions.includes(resolution)) {
            setSelectedResolutions(prev => prev.filter(res => res !== resolution));
        } else {
            setSelectedResolutions(prev => [...prev, resolution]);
        }
    };

    const removeResolution = (resolution: number) => {
        setSelectedResolutions(prev => prev.filter(res => res !== resolution));
    };

    // Set DRM handlers
    const handleAddCollection = () => {
        setCollections(prev => [...prev, { address: '', network: 'Theta Mainnet' }]);
    };

    const handleRemoveCollection = (index: number) => {
        setCollections(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddressChange = (index: number, address: string) => {
        const newCollections = [...collections];
        newCollections[index].address = address;
        setCollections(newCollections);
    };

    const handleNetworkChange = (index: number, network: string) => {
        const newCollections = [...collections];
        newCollections[index].network = network;
        setCollections(newCollections);
    };

    // Save function checks if upload or video url is provided and then proceeds with all the necessary api calls
    const handleSaveVideo = () => {
        setErrorMessage('');
        // check if necessary info is set
        if (selectedResolutions.length === 0) {
            setErrorMessage('Select Resolution for video Transcoding');
            return;
        }
        if (videoURL === '') {
            if (videoFile != null) {
                uploadVideo();
            } else {
                setErrorMessage('No video URL or video upload provided!');
            }
        } else {
            transcodeVideo(null).catch((e) => {
                setErrorMessage('Invalid video URL. Please fix and then try again.');
            });
        }
    };

    const getSignedURL = async () => {
        try {
            const response = await axios.post('https://api.thetavideoapi.com/upload', {}, {
                headers: {
                    'x-tva-sa-id': apiKeys.key,
                    'x-tva-sa-secret': apiKeys.secret
                }
            });
            return response.data.body.uploads[0];
        } catch (error) {
            console.error('Error fetching signed URL:', error);
        }
    };

    const uploadVideo = async () => {
        if (videoFile) {
            try {
                setIsUploading(true);
                const uploads = await getSignedURL();
                const signedURL = uploads.presigned_url;

                if (!signedURL) {
                    console.error('Failed to get signed URL.');
                    setErrorMessage('Failed to get signed URL.');
                    return;
                }

                await axios.put(signedURL, videoFile, {
                    headers: {
                        'Content-Type': 'application/octet-stream',
                    }
                });
                transcodeVideo(uploads.id);
            } catch (error) {
                setIsUploading(false);
                console.error('Error uploading the file:', error);
            }
        }
    };

    const createTranscodeData = (id: string | null): any => {
        const baseData = {
            playback_policy: "public",
            resolutions: selectedResolutions
        };

        if (id) {
            console.log("Transcode via upload id");
            return { ...baseData, source_upload_id: id };
        } else {
            console.log("Transcode via external URL");
            return { ...baseData, source_uri: videoURL };
        }
    };

    const getDrmRules = (): any[] => {
        return collections.reduce((rules: any[], collection) => {
            if (isAddress(collection.address) && collection.network) {
                const network = networks.find(net => net.name === collection.network);
                const chainId = network?.value;

                if (!rules.some(rule => rule.chain_id === chainId && rule.nft_collection === collection.address)) {
                    rules.push({
                        chain_id: chainId,
                        nft_collection: collection.address
                    });
                }
            }
            return rules;
        }, []);
    };

    const getMetadata = () => {
        const metadata: any = {};

        if (videoName) metadata.name = videoName;
        if (videoDescription) metadata.description = videoDescription;

        return Object.keys(metadata).length ? metadata : null;
    };

    const transcodeVideo = async (id: string | null) => {
        let data = createTranscodeData(id);

        const drmRules = getDrmRules();
        data.use_drm = drmRules.length > 0;
        if (data.use_drm) data.drm_rules = drmRules;

        const metadata = getMetadata();
        if (metadata) data.metadata = metadata;

        console.log(data);

        try {
            const response = await axios.post('https://api.thetavideoapi.com/video', JSON.stringify(data), {
                headers: {
                    'x-tva-sa-id': apiKeys.key,
                    'x-tva-sa-secret': apiKeys.secret,
                    'Content-Type': 'application/json'
                }
            });

            console.log(response.data.body);
            setTranscodingId(response.data.body.videos[0].id);
            setIsUploading(false);
        } catch (error) {
            setTranscodingId('');
            const errorMessage = videoURL ? 'Invalid video URL. Please fix and then try again.' : 'Error starting Video transcoding';
            setErrorMessage(errorMessage);
            console.error('Error fetching transcoding Video:', error);
        }
    };

    // Called after uploading and transcoding, if the user wants to upload new video -> resets the main page
    const handleBackToNewVideo = (newValue: string) => {
        setTranscodingId(newValue);
        setVideoFile(null);
        setVideoURL('');
        setVideoDescription('');
        setVideoName('');
        setCollections([{ address: '', network: 'Theta Mainnet' }]);
        setSelectedResolutions(resolutions);
        setSelectedWorker('External Elite Edge Node');
    };

    if (apiKeys.secret === 'srvacc_5qsp988etr3giht8h9kuew9ju' || apiKeys.key === 'kuwsyq0cx2gipaggec1ba2pumzat80qj') {
        return <ApiKeys setApiKeys={setApiKeys}></ApiKeys>;
    }

    if (transcodingId !== '') {
        return <Transcoding apiKey={apiKeys.key} apiSecret={apiKeys.secret} id={transcodingId} name={videoName} handleBackToNewVideo={handleBackToNewVideo}></Transcoding>;
    }

    return (
        <div className={styles.alignment}>
            <h1 style={{ textDecoration: 'underline', fontSize: '30px' }}>New Upload 📹</h1>


            <div
                id="dragDropBox"
                className={styles.dragDropBox}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => window.open('https://www.thetaedgecloud.com/ai-showcase', '_blank')}
            >
                <p>Generate videos here...</p>
            </div>
            <p>OR</p>
            <div
                id="dragDropBox"
                className={styles.dragDropBox}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => window.open('https://www.thetaedgecloud.com/ai-showcase', '_blank')}
            >
                <p>Create images...</p>
            </div>

            <p>OR</p>

            <div
                id="dragDropBox"
                className={styles.dragDropBox}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => window.open('https://www.thetaedgecloud.com/ai-showcase', '_blank')}
            >
                <p>Create 3D contents...</p>
            </div>


            <p>OR</p>
            <input className={styles.videoURL} type="url" placeholder="Enter video url" value={videoURL} onChange={(e) => { setVideoURL(e.target.value) }} />
            <p>OR</p>
            {/*Drag and Drop or click and select input for video file*/}
            <>



                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="video/*"
                    onChange={handleFileChange}
                />
                <div
                    id="dragDropBox"
                    className={styles.dragDropBox}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <p>Drag your video here...</p>
                </div>
                <p>{videoFile ? videoFile?.name : null}</p>
            </>
            {/*Select Resolutions and Worker*/}
            <div className={styles.selectContainer}>
                <div className={styles.selectWrapper}>
                    <label className={styles.selectLabel}>Select Resolutions:</label>
                    <Listbox>
                        {({ open }) => (
                            <>
                                <div className={styles.multiSelectDisplay}>
                                    <Listbox.Button className={styles.listBox}>
                                        {selectedResolutions.length > 0 ? selectedResolutions.map(resolution => (
                                            <span key={resolution} className={styles.selectedItem}>
                                                <div className={styles.resolutionText}>{resolution}P</div>
                                                <button className={styles.buttonX} onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeResolution(resolution)
                                                }
                                                }>&times;</button>
                                            </span>
                                        )) : 'Select resolutions'}
                                    </Listbox.Button>
                                </div>
                                <Transition show={open}>
                                    <Listbox.Options className={styles.optionsBox}> {/* <-- Adjust the class here */}
                                        {resolutions.filter(res => !selectedResolutions.includes(res)).map((resolution) => (
                                            <Listbox.Option className={styles.options} key={resolution} value={resolution}>
                                                {() => (
                                                    <div className={styles.option} onClick={() => toggleResolution(resolution)}>
                                                        <span>{resolution}P</span>
                                                    </div>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </>
                        )}
                    </Listbox>
                </div>

                <div className={styles.selectWrapper}>
                    <label className={styles.selectLabel}>Select a worker:</label>
                    <Listbox as="div" value={selectedWorker} onChange={setSelectedWorker}>
                        {({ open }) => (
                            <>
                                <Listbox.Button className={styles.listBoxWorker}>{selectedWorker}</Listbox.Button>
                                <Transition show={open}>
                                    <Listbox.Options className={styles.optionsBox}>
                                        {workers.map((worker) => (
                                            <Listbox.Option className={styles.options} key={worker} value={worker}>
                                                {({ selected }) => (
                                                    <div className={cx(styles.option, selected ? styles.selectedOption : null)}>
                                                        <span>{worker}</span>
                                                    </div>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </>
                        )}
                    </Listbox>
                </div>
            </div>
            {/*Input Video name stored in the metadata*/}
            <h4>Stored in metadata</h4>
            <input className={styles.videoURL} type="text" placeholder="Enter video name (optional)" value={videoName} onChange={(e) => { setVideoName(e.target.value) }} />
            <input className={styles.videoURL} type="text" placeholder="Enter video description (optional)" value={videoDescription} onChange={(e) => { setVideoDescription(e.target.value) }} />
            {/*Enable DRM via NFTs*/}
            <h4>Enable NFT based DRM with NFT collection address (optional)</h4>
            {collections.map((collection, index) => (
                <div key={index} className={styles.collectionRow}>
                    <div className={styles.collectionInputs}>
                        <div className={styles.inputGroup}>
                            <label>Enter Collection#{index + 1} Address:</label>
                            <input
                                className={styles.collectionAddress}
                                type="text"
                                placeholder={'Collection Address'}
                                value={collection.address}
                                onChange={(e) => handleAddressChange(index, e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Select Collection#{index + 1} Network:</label>
                            <Listbox as="div" value={collection.network} onChange={(network) => handleNetworkChange(index, network)}>
                                {({ open }) => (
                                    <>
                                        <Listbox.Button className={styles.listBoxNetwork}>{collection.network}</Listbox.Button>
                                        <Transition show={open}>
                                            <Listbox.Options className={styles.optionsBoxNetwork}>
                                                {networks.map((network) => (
                                                    <Listbox.Option className={styles.options} key={network.value} value={network.name}>
                                                        {({ selected }) => (
                                                            <div className={cx(styles.option, selected ? styles.selectedOption : null)}>
                                                                <span>{network.name}</span>
                                                            </div>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </>
                                )}
                            </Listbox>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
                        <button className={styles.buttonRemove} onClick={() => handleRemoveCollection(index)}>Remove</button>
                    </div>
                </div>
            ))}
            <button className={styles.basicButton} onClick={handleAddCollection}>Add another NFT collection</button>
            <p style={{ width: '600px', color: 'var(--primary-color)', textAlign: 'center' }}>If a collection address is added, users MUST have at least one NFT from the specified collection in order to view the video.</p>
            {/*Save button, loading animation and Error messages*/}
            {
                isUploading ? (
                    <>
                        <div className={styles.spinner}></div>
                        <p style={{ color: "var(--secondary-color-green)" }}>Video uploading, do not close this browser tab!</p>
                    </>
                ) : (
                    <button className={styles.basicButton} onClick={handleSaveVideo}>
                        Save
                    </button>
                )
            }
            <p style={{ color: "red" }}>{errorMessage}</p>
        </div>
    );
}

function ApiKeys({ setApiKeys }: { setApiKeys: React.Dispatch<React.SetStateAction<{ key: string; secret: string; }>> }) {
    const [key, setKey] = useState('');
    const [secret, setSecret] = useState('');

    const handleSaveKeys = () => {
        setApiKeys({ key, secret });
    };

    return (
        <div>
            <h2>Enter API Keys</h2>
            <input
                type="text"
                placeholder="API Key"
                value={key}
                onChange={e => setKey(e.target.value)}
            />
            <input
                type="text"
                placeholder="API Secret"
                value={secret}
                onChange={e => setSecret(e.target.value)}
            />
            <button onClick={handleSaveKeys}>Save API Keys</button>
        </div>
    );
}

function Transcoding({ apiKey, apiSecret, id, name, handleBackToNewVideo }: { apiKey: string, apiSecret: string, id: string, name: string, handleBackToNewVideo: (newValue: string) => void }) {
    return (
        <div>
            <h2>Transcoding {name}</h2>
            <p>ID: {id}</p>
            <button onClick={() => handleBackToNewVideo('')}>Back to New Video</button>
        </div>
    );
}
