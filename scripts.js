// Contract address and ABI
const CONTRACT_ADDRESS = "0x834b798ae5Fe39205D675912D7f9016eE112b961";
const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "CLAIM_AMOUNT",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CLAIM_INTERVAL",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
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
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "lastClaimTime",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
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

// Function to connect the wallet
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask detected.");
        try {
            // Initialize Web3 instance
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const accounts = await web3.eth.getAccounts();
            const walletAddress = accounts[0];
            console.log("Connected wallet address:", walletAddress);

            // Display wallet address
            document.getElementById("wallet-address").value = walletAddress;

            // Initialize the contract
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            console.log("Contract initialized successfully.");

            document.getElementById("response-message").innerText = "Wallet connected successfully!";
        } catch (error) {
            console.error("Error connecting wallet:", error);
            document.getElementById("response-message").innerText = "Failed to connect wallet.";
        }
    } else {
        alert("MetaMask is not installed. Please install it from https://metamask.io/");
    }
}

// Function to claim tokens
async function claimTokens() {
    if (!contract) {
        document.getElementById("response-message").innerText = "Please connect your wallet first.";
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const transaction = await contract.methods.claim().send({ from: accounts[0] });

        console.log("Claim transaction successful:", transaction);
        document.getElementById("response-message").innerText = "Successfully claimed xDAI!";
    } catch (error) {
        console.error("Error claiming tokens:", error);
        document.getElementById("response-message").innerText = `Error: ${error.message}`;
    }
}

// Attach event listeners to buttons
document.getElementById("connect-wallet").addEventListener("click", connectWallet);
document.getElementById("claim-button").addEventListener("click", claimTokens);
