const CONTRACT_ADDRESS = "0x834b798ae5Fe39205D675912D7f9016eE112b961";
const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "claim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let web3;
let contract;

document.addEventListener("DOMContentLoaded", () => {
    const connectWalletButton = document.getElementById("connect-wallet");
    const claimButton = document.getElementById("claim-button");
    const responseMessage = document.getElementById("response-message");
    const walletAddressInput = document.getElementById("wallet-address");

    connectWalletButton.addEventListener("click", async () => {
        await connectWallet();
    });

    claimButton.addEventListener("click", async () => {
        await claimTokens();
    });

    async function connectWallet() {
        if (!window.ethereum) {
            alert("MetaMask is required to use this faucet.");
            return;
        }

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            const walletAddress = accounts[0];

            walletAddressInput.value = walletAddress;
            responseMessage.textContent = "Wallet connected!";
            responseMessage.className = "response-message success";

            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            claimButton.disabled = false;
        } catch (error) {
            responseMessage.textContent = "Failed to connect wallet.";
            responseMessage.className = "response-message error";
        }
    }

    async function claimTokens() {
        if (!contract) {
            responseMessage.textContent = "Connect your wallet first.";
            responseMessage.className = "response-message error";
            return;
        }

        try {
            const accounts = await web3.eth.getAccounts();
            const walletAddress = accounts[0];

            responseMessage.textContent = "Processing transaction...";
            responseMessage.className = "response-message";

            await contract.methods.claim().send({ from: walletAddress });

            responseMessage.textContent = "Successfully claimed xDAI!";
            responseMessage.className = "response-message success";
        } catch (error) {
            responseMessage.textContent = `Error: ${error.message}`;
            responseMessage.className = "response-message error";
        }
    }
});
