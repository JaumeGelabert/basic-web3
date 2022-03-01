import React, {useState} from 'react'

function Landing() {

    const [errorMEssage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [currentContractVal, setCurrentContractVal] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const connectWalletHandler = () => {
        // Miramos si tenemos Metamask instalado. 
        // En caso de que no esté instalado, mostramos un mensaje de error. 
        if (window.ethereum) {
            // Devuelve las accounts de Metamask y pide acceso a ellas
            window.ethereum.request({method: 'eth_requestAccounts'}).then(
                result => {
                    accountChangeHandler(result[0]);
                    setConnButtonText('Wallet Connected!')
                }
            )
        } else {
            setErrorMessage('Need to install Metamask!')
        }
    }

    const accountChangeHandler = (newAccount) => {
        setDefaultAccount(newAccount)
        updateEthers()
    }

    const updateEthers = () => {
        let tempProvider = new updateEthers.providers.Web3Provider (window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new updateEthers.Contract(contractAddress, Contract_abi, tempSigner);
        setConnButtonText(tempContract)
    }

    return(
        <div className='App'>
            <h1>
                Interacción con smart contract
            </h1>
            <button onClick={connectWalletHandler}>
                {connButtonText}
            </button>
            <h4>Address: {defaultAccount}</h4>

            {errorMEssage}
        </div>
    );
};

export default Landing;