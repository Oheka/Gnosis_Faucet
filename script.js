// Address of the deployed smart contract
const CONTRACT_ADDRESS = "0x834b798ae5Fe39205D675912D7f9016eE112b961";

// Smart contract ABI (replace this placeholder with your actual ABI from Remix)
const CONTRACT_ABI = [
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
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "lastClaimTime",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
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
    if (window.ethereum) {
        try {
            // Request wallet connection
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const accounts = await web3.eth.getAccounts();
            const walletAddressInput = document.getElementById("wallet-address");
            walletAddressInput.value = accounts[0];

            // Initialize the contract instance
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

            document.getElementById("response-message").innerText =
                "Wallet connected successfully.";
        } catch (error) {
            console.error("Error connecting wallet:", error);
            document.getElementById("response-message").innerText =
                "Failed to connect wallet.";
        }
    } else {
        alert("MetaMask or a compatible wallet is required to use this faucet.");
    }
}

async function claimTokens() {
    if (!contract) {
        document.getElementById("response-message").innerText =
            "Please connect your wallet first.";
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.claim().send({ from: accounts[0] });

        document.getElementById("response-message").innerText =
            "Successfully claimed 0.001 xDAI!";
    } catch (error) {
        console.error("Error claiming tokens:", error);
        document.getElementById("response-message").innerText =
            `Error: ${error.message}`;
    }
}

// Attach event listeners to buttons
document.getElementById("connect-wallet").addEventListener("click", connectWallet);
document.getElementById("claim-button").addEventListener("click", claimTokens);
