const CONTRACT_ADDRESS = "0x834b798ae5Fe39205D675912D7f9016eE112b961";
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "CLAIM_AMOUNT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CLAIM_INTERVAL",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];

let web3;
let contract;

async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask or Brave Wallet not found. Please install MetaMask.");
        return;
    }
    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];
        document.getElementById("wallet-address").value = walletAddress;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        document.getElementById("response-message").innerText = "Wallet connected successfully!";
    } catch (error) {
        document.getElementById("response-message").innerText = "Failed to connect wallet.";
    }
}

async function claimTokens() {
    if (!contract) {
        document.getElementById("response-message").innerText = "Please connect your wallet first.";
        return;
    }
    try {
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];
        await contract.methods.claim().send({ from: walletAddress });
        document.getElementById("response-message").innerText = "Successfully claimed xDAI!";
    } catch (error) {
        document.getElementById("response-message").innerText = `Error: ${error.message}`;
    }
}

document.getElementById("connect-wallet").addEventListener("click", connectWallet);
document.getElementById("claim-button").addEventListener("click", claimTokens);

