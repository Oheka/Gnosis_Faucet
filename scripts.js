const CONTRACT_ADDRESS = "0x834b798ae5Fe39205D675912D7f9016eE112b961";
const CONTRACT_ABI = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "inputs": [], "name": "CLAIM_AMOUNT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "CLAIM_INTERVAL", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "stateMutability": "payable", "type": "receive" }
];

let web3;
let contract;

document.addEventListener("DOMContentLoaded", () => {
    const connectWalletButton = document.getElementById("connect-wallet");
    const claimButton = document.getElementById("claim-button");

    connectWalletButton.addEventListener("click", connectWallet);
    claimButton.addEventListener("click", claimTokens);
});

async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask not found. Please install MetaMask.");
        return;
    }
    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];
        document.getElementById("wallet-address").value = walletAddress;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        displayMessage("Wallet connected successfully!", "success");
        document.getElementById("claim-button").disabled = false;
    } catch (error) {
        displayMessage("Failed to connect wallet.", "error");
    }
}

async function claimTokens() {
    if (!contract) {
        displayMessage("Please connect your wallet first.", "error");
        return;
    }
    try {
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];
        const tx = await contract.methods.claim().send({ from: walletAddress });
        if (tx.status) {
            displayMessage("Successfully claimed xDAI!", "success");
        }
    } catch (error) {
        const errorMsg = error.message.includes("already claimed")
            ? "You have already claimed tokens. Please wait for the next interval."
            : error.message.includes("empty")
            ? "Faucet is currently empty. Please try again later."
            : "An error occurred while claiming tokens.";
        displayMessage(errorMsg, "error");
    }
}

function displayMessage(message, type) {
    const responseMessage = document.getElementById("response-message");
    responseMessage.textContent = message;
    responseMessage.className = type === "success" ? "success" : "error";
}
    
