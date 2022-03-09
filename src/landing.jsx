import React, {useState} from 'react'
import {ethers} from 'ethers'
import SimpleStorage_abi from './contracts/SimpleStorage_abi.json'
import Step from './step'

const SimpleStorage = () => {

	// deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0x7bfc913ca13b1564C25008C0a51c2eDd1798c4bD';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, SimpleStorage_abi, tempSigner);
		setContract(tempContract);	
	}

	const setHandler = (event) => {
		event.preventDefault();
		console.log('sending ' + event.target.setText.value + ' to the contract');
		contract.set(event.target.setText.value);
	}

	const getCurrentVal = async () => {
		let val = await contract.get();
		setCurrentContractVal(val);
	}
	
	return (
		<div className='container-hero'>
			<h1 className='hero-text'>Interact with a Smart Contract</h1>
			<h2 className='subhero-text'>Follow the next steps:</h2>
			<Step 
				tittle="1. Connect your wallet"
				firstLine="You will need to use a Metamask wallet in order to interact with the Smart Contract."
				secondLine="Press the next button. Select a test wallet in the Metamask's dialog."
			/>
			<div className='container-wallet-inter'>
				<div className='color-dot-big'>
					<div className='color-dot-small'></div>
				</div>
				<button onClick={connectWalletHandler}>{connButtonText}</button>
				<h3>{defaultAccount}</h3>
			</div>

			<Step 
				tittle="2. Set a new value for the Contract"
				firstLine="Write a new value for the Smart Contract. Take into account that you will need to pay gas"
				secondLine="in order to push the changes to the blockchain. Please, make sure you are using a testnet."
				classThirdLine="third-line"
				thirdLine="After hitting the ‘Submit’ button, you will need to confirm the transaction in your Metamask."
			/>


			<div>
				
			</div>
			<form onSubmit={setHandler}>
				<input id="setText" type="text"/>
				<button type={"submit"}> Update Contract </button>
			</form>
			<div>
			<button onClick={getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button>
			</div>
			{currentContractVal}
			{errorMessage}
		</div>
	);
}

export default SimpleStorage;