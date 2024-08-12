import React from 'react';
import Image from 'next/image'
import styles from '../app/page.module.css'
import Video from "../app/video";

const ThetaPass = require('@thetalabs/theta-pass');
const thetajs = require('@thetalabs/theta-js');

const redirectURLForPopup = 'http://localhost:3000/theta-pass-auth-finished.html';
const ThetaZillaMarketplaceUrl = 'https://thetazilla.thetadrop.com/content/type_2s2kcznsu3e06en43r3kg50b90c';
const ThetaZillaContractAddress = '0x6e7e0c8a1109fdc68e5bca42d54740f333b3545d';

class App extends React.Component {
  constructor(props) {
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

  isOwnerOfNFT = async (nftContractAddress, walletAddress) => {
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
    const isOwner = await this.isOwnerOfNFT(ThetaZillaContractAddress, walletAddress);
    this.setState({ isOwner });
  };

  handleThetaPassResponse = (response) => {
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
      const response = await ThetaPass.requestAccounts(redirectURLForPopup, null, true);
      this.handleThetaPassResponse(response);
    } catch (e) {
      console.error('Error requesting accounts via popup:', e);
    }
  };

  requestAccountsViaRedirect = async () => {
    try {
      const redirectUrl = 'http://localhost:3000';
      await ThetaPass.requestAccounts(redirectUrl, null, false);
    } catch (e) {
      console.error('Error requesting accounts via redirect:', e);
    }
  };

  render() {
    const { walletAddress, isOwner } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h2>ThetaPass Playground</h2>

          {walletAddress ? (
            <div>
              <div style={{ marginBottom: 12 }}>Connected as ✅:</div>
              <div style={{ fontSize: 12 }}>{walletAddress}</div>
            </div>
          ) : (
            <div>
              <h3>Connect to ThetaDrop</h3>
              <p>Prove NFT ownership to unlock special features!</p>
              <button onClick={this.requestAccountsViaPopup}>Request ThetaDrop User Address via Popup</button>
              <button onClick={this.requestAccountsViaRedirect}>Request ThetaDrop User Address via Redirect</button>
            </div>
          )}

          {walletAddress !== undefined && !isOwner && (
            <div>
              <h3>Sorry...Owners Only Area</h3>
              <a href={ThetaZillaMarketplaceUrl} target={'_blank'} rel="noopener noreferrer">Buy a ThetaZilla</a>
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
        <Video></Video>

      </div>
    );
  }
}

export default App;


// import React from 'react';


// const ThetaPass = require('@thetalabs/theta-pass');
// const thetajs = require('@thetalabs/theta-js');

// const redirectURLForPopup = 'http://localhost:3000/theta-pass-auth-finished.html';

// const ThetaZillaMarketplaceUrl = 'https://thetazilla.thetadrop.com/content/type_2s2kcznsu3e06en43r3kg50b90c';

// // https://www.thetadrop.com/content/type_2s2kcznsu3e06en43r3kg50b90c
// const ThetaZillaContractAddress = '0x6e7e0c8a1109fdc68e5bca42d54740f333b3545d';

// class App extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       userAddress: null,
//       isOwner: false
//     }
//   }

//   componentDidMount() {
//     // Optional: Use only if using the redirect option
//     this.finishViaRedirect();
//   }

//   isOwnerOfNFT = async (nftContractAddress, walletAddress) => {
//     const nftABI = ThetaPass.THETA_DROP_NFT_ABI;
//     const provider = new thetajs.providers.HttpProvider();
//     const contract = new thetajs.Contract(nftContractAddress, nftABI, provider);
//     const balance = await contract.balanceOf(walletAddress);

//     return (balance.toNumber() > 0);
//   }

//   refreshOwnershipChecks = async () => {
//     const {walletAddress} = this.state;
//     const isOwner = await this.isOwnerOfNFT(ThetaZillaContractAddress, walletAddress);

//     this.setState({
//       isOwner: isOwner
//     });
//   }

//   handleThetaPassResponse = (response) => {
//     try {
//       if(response){
//         const {result} = response;
//         const walletAddress = result[0];

//         this.setState({
//           walletAddress: walletAddress
//         });

//         this.refreshOwnershipChecks();
//       }
//     }
//     catch (e){

//     }
//   }

//   finishViaRedirect = async () => {
//     try {
//       const response =  await ThetaPass.getResponse();
//       this.handleThetaPassResponse(response);
//     }
//     catch (e){

//     }
//   }

//   requestAccountsViaPopup = async () => {
//     const response = await ThetaPass.requestAccounts(redirectURLForPopup, null, true);
//     this.handleThetaPassResponse(response);
//   };

//   requestAccountsViaRedirect = async () => {
//     const redirectUrl = 'http://localhost:3000';
//     await ThetaPass.requestAccounts(redirectUrl, null, false);
//   };

//   render(){
//     const {walletAddress, isOwner} = this.state;

//     return (
//         <div className="App">
//           <header className="App-header">
//             <h2>
//               ThetaPass Playground
//             </h2>

//             {
//                 walletAddress &&
//               <div>
//                 <div style={{marginBottom: 12}}>Connected as:</div>
//                 <div style={{fontSize: 12}}>{walletAddress}</div>
//               </div>
//             }

//             {
//                 walletAddress === undefined &&
//               <div>
//                 <h3>Connect to ThetaDrop</h3>
//                 <p>Prove NFT ownership to unlock special features!</p>
//                 <button onClick={this.requestAccountsViaPopup}>Request ThetaDrop User Address via Popup</button>
//                 <button onClick={this.requestAccountsViaRedirect}>Request ThetaDrop User Address via Redirect</button>
//               </div>
//             }

//             {
//                 walletAddress !== undefined && !isOwner &&
//               <div>
//                 <h3>Sorry...Owners Only Area</h3>
//                 <a href={ThetaZillaMarketplaceUrl} target={'_blank'}>Buy a ThetaZilla</a>
//               </div>
//             }

//             {
//               isOwner &&
//               <div>
//                 <h3>Owners Only Area</h3>
//                 <button onClick={() => {
//                   alert('Hello Owner :)')
//                 }}>Owners Only Lounge</button>
//               </div>
//             }

//           </header>
//         </div>
//     );
//   }
// }

// export default App;
