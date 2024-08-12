import React from 'react';
import Image from 'next/image';
import styles from '../app/page.module.css';
import Video from "../app/video";

const ThetaPass = require('@thetalabs/theta-pass');
const thetajs = require('@thetalabs/theta-js');

interface AppProps {}
interface AppState {
    walletAddress: string | null;
    isOwner: boolean;
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            walletAddress: null,
            isOwner: false
        };
    }

    componentDidMount() {
        const savedWalletAddress = localStorage.getItem('walletAddress');
        if (savedWalletAddress) {
            this.setState({ walletAddress: savedWalletAddress }, this.refreshOwnershipChecks);
        }
        this.finishViaRedirect();
    }

    isOwnerOfNFT = async (nftContractAddress: string, walletAddress: string | null) => {
        try {
            if (!walletAddress) {
                console.error('walletAddress is undefined or null');
                return false;
            }
            const nftABI = ThetaPass.THETA_DROP_NFT_ABI;
            const provider = new thetajs.providers.HttpProvider();
            const contract = new thetajs.Contract(nftContractAddress, nftABI, provider);
            const balance = await contract.balanceOf(walletAddress);
            return (balance.toNumber() > 0);
        } catch (error) {
            console.error('Error checking NFT ownership:', error);
            return false;
        }
    };

    refreshOwnershipChecks = async () => {
        const { walletAddress } = this.state;
        if (!walletAddress) {
            console.error('No wallet address found in state');
            return;
        }
        const isOwner = await this.isOwnerOfNFT(process.env.NEXT_PUBLIC_THETA_ZILLA_CONTRACT_ADDRESS!, walletAddress);
        this.setState({ isOwner });
    };

    handleThetaPassResponse = (response: any) => {
        try {
            if (response) {
                const { result } = response;
                const walletAddress = result[0];
                console.log('Received wallet address:', walletAddress);
                this.setState({ walletAddress }, () => {
                    localStorage.setItem('walletAddress', walletAddress);
                    this.refreshOwnershipChecks();
                });
            } else {
                console.error('Response is undefined or null');
            }
        } catch (e) {
            console.error('Error handling ThetaPass response:', e);
        }
    };

    finishViaRedirect = async () => {
        try {
            const response = await ThetaPass.getResponse();
            this.handleThetaPassResponse(response);
        } catch (e) {
            console.error('Error finishing via redirect:', e);
        }
    };

    requestAccountsViaPopup = async () => {
        try {
            const response = await ThetaPass.requestAccounts(process.env.NEXT_PUBLIC_REDIRECT_URL, null, true);
            this.handleThetaPassResponse(response);
        } catch (e) {
            console.error('Error requesting accounts via popup:', e);
        }
    };

    requestAccountsViaRedirect = async () => {
        try {
            await ThetaPass.requestAccounts(process.env.NEXT_PUBLIC_REDIRECT_URL, null, false);
        } catch (e) {
            console.error('Error requesting accounts via redirect:', e);
        }
    };

    render() {
        const { walletAddress, isOwner } = this.state;

        const handleLogout = () => {
            localStorage.removeItem('walletAddress');
            this.setState({ walletAddress: null, isOwner: false });
        };

        return (
            <div className="App">
                <header className="App-header">
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <h2>Welcome</h2>
                    </div>

                    {walletAddress ? (
                        <div>
                            <div style={{ marginBottom: 12 }}>Connected as:</div>
                            <div style={{ fontSize: 12 }}>{walletAddress}</div>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <h3>Welcome! To upload a video, please login.</h3>
                            <br />
                            <button onClick={this.requestAccountsViaPopup} style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Use Theta Pass
                            </button>
                        </div>
                    )}

                    {isOwner && (
                        <div>
                            <h3>Owners Only Area</h3>
                            <button onClick={() => { alert('Hello Owner :)') }}>Owners Only Lounge</button>
                        </div>
                    )}
                </header>

                <div style={{ borderTop: '1px solid var(--primary-color)', width: '100%' }}></div>

                {walletAddress && (
                    <Video></Video>
                )}
            </div>
        );
    }
}

export default App;
