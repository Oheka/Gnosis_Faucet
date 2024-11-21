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
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "lastClaimTime",
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
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
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

let provider;
let signer;
let contract;

async function connectWallet() {
    if (!window.ethereum) {
        alert("MetaMask is required. Please install it from https://metamask.io.");
        return;
    }

    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        const walletAddress = await signer.getAddress();

        document.getElementById("wallet-address").value = walletAddress;

        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        document.getElementById("response-message").innerText = "Wallet connected successfully!";
        console.log("Wallet connected:", walletAddress);
    } catch (error) {
        console.error("Error connecting wallet:", error);
        document.getElementById("response-message").innerText = "Failed to connect wallet.";
    }
}

async function claimTokens() {
    if (!contract) {
        document.getElementById("response-message").innerText = "Please connect your wallet first.";
        return;
    }

    try {
        const tx = await contract.claim();
        document.getElementById("response-message").innerText = "Transaction sent. Waiting for confirmation...";
        await tx.wait();
        document.getElementById("response-message").innerText = "Successfully claimed xDAI!";
    } catch (error) {
        console.error("Error claiming tokens:", error);
        document.getElementById("response-message").innerText = `Error: ${error.message}`;
    }
}

document.getElementById("connect-wallet").addEventListener("click", connectWallet);
document.getElementById("claim-button").addEventListener("click", claimTokens);
