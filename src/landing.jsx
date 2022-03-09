import React, {useState} from 'react'
import {ethers} from 'ethers'
import SimpleStorage_abi from './contracts/SimpleStorage_abi.json'
import Step from './step'

const SimpleStorage = () => {

	// deploy simple storage contract and paste deployed contract address here.
	let contractAddress = '0xAA4c8A5512c152ba5835d7f15eDD8cfE242c9068';

	// Mediante estos UseState podemos modificar el contenido de algunos elementos
	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const connectWalletHandler = () => {
		// Si se detecta que existe la extensión de Metamask en el navegador...
		if (window.ethereum && window.ethereum.isMetaMask) {

			// Accedemos a listado de cuentas conectadas
			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				// y elegimos la de índice 0
				accountChangedHandler(result[0]);
				// Cambiamos el UseState del boton para que muestre 'Wallet Connected'
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		// Si no hay Metamask instalado, mostramos un error en el frontend y en la consola del navegador
		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		// Mostramos solo los primeros 5 y últimos 4 digitos de la dirección
		// Para acceder a la dirección entera, podemos utilizar 'newAccount'
		setDefaultAccount(newAccount.slice(0,5)+'...'+newAccount.slice(-5,-1));
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

	// En el siguiente bloque, actualizamos el valor del Smart Contract
	const setHandler = (event) => {
		event.preventDefault();
		// Mostramos en la consola del navegador el valor que enviamos al contrato
		console.log('sending ' + event.target.setText.value + ' to the contract');
		// Mediante la función set() del contrato, definimos 'value' como nuevo valor del contrato
		contract.set(event.target.setText.value);
	}

	const getCurrentVal = async () => {
		// Mediante la función get(), obtenemos el valor definido previamente por set()
		let val = await contract.get();
		setCurrentContractVal(val);
	}

	// Lógica para mostar el dot en color rojo (no conectado) o en verde (conectado)
	if (defaultAccount != null) {
		document.getElementById('big-dot').className = "color-dot-big-green";
		document.getElementById('small-dot').className = "color-dot-small-green";
	}
	
	// Lo que se renderiza en el navegador
	return (
		<div className='container-hero container'>
			<div className='container-link'>
				<a href="https://github.com/JaumeGelabert/basic-web3" target="_blank" className='github-link'>
					<i class="bi bi-github "></i>
				</a>
			</div>
			<h1 className='hero-text'>Interact with a Smart Contract</h1>
			<h2 className='subhero-text'>Follow the next steps:</h2>
			<Step 
				tittle="1. Connect your wallet"
				firstLine={"You will need to use a Metamask wallet in order to interact with the Smart Contract."}
				secondLine="Press the next button. Select a test wallet in the Metamask's dialog."
			/>
			<div className='container-action-step'>
				<div className='container-dot'>
					<div className='color-dot-big' id='big-dot'>
						<div className='color-dot-small' id='small-dot'></div>
					</div>
				</div>
				<button onClick={connectWalletHandler}>{connButtonText}</button>
				<p className='connected-account'>{defaultAccount}</p>
			</div>

			<Step 
				tittle="2. Set a new value for the Contract"
				firstLine="Write a new value for the Smart Contract. Take into account that you will need to pay gas"
				secondLine="in order to push the changes to the blockchain. Please, make sure you are using a testnet."
				classThirdLine="third-line"
				thirdLine="After hitting the ‘Submit’ button, you will need to confirm the transaction in your Metamask."
			/>
			<div className='container-action-step'>
				<form onSubmit={setHandler}>
					<div class="input-group-form">
						<input id="setText" type="text" placeholder="New value" aria-describedby="button-addon2" />
						<button class="form" type={"submit"} id="button-addon2">Submit</button>
					</div>
				</form>

			</div>

			<Step 
				tittle="3. Check the value"
				firstLine="Click the next button to check the value. It may take a few seconds to update."
			/>
			<div className='container-action-step'>
				<button onClick={getCurrentVal}> Get Current Contract Value </button>
				<p className='connected-account'>{currentContractVal}</p>
			</div>
			{errorMessage}
		</div>
	);
}

export default SimpleStorage;