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

document.addEventListener("DOMContentLoaded", () => {
    const connectWalletButton = document.getElementById("connect-wallet");
    const claimButton = document.getElementById("claim-button");
    const responseMessage = document.getElementById("response-message");

    if (!connectWalletButton) {
        console.error("Connect Wallet button not found in the DOM.");
        return;
    }

    if (!claimButton) {
        console.error("Claim button not found in the DOM.");
        return;
    }

    connectWalletButton.addEventListener("click", async () => {
        try {
            console.log("Connecting wallet...");
            await connectWallet();
        } catch (error) {
            console.error("Error during wallet connection:", error);
        }
    });

    claimButton.addEventListener("click", async () => {
        try {
            console.log("Attempting to claim tokens...");
            await claimTokens();
        } catch (error) {
            console.error("Error during token claim:", error);
        }
    });
});

async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask or Brave Wallet not found. Please install MetaMask.");
        return;
    }

    try {
        console.log("Requesting wallet connection...");
        await window.ethereum.request({ method: "eth_requestAccounts" });

        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];

        document.getElementById("wallet-address").value = walletAddress;

        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

        const responseMessage = document.getElementById("response-message");
        if (responseMessage) {
            responseMessage.innerText = "Wallet connected successfully!";
        }

        console.log("Wallet connected:", walletAddress);
    } catch (error) {
        console.error("Error connecting wallet:", error);

        const responseMessage = document.getElementById("response-message");
        if (responseMessage) {
            responseMessage.innerText = "Failed to connect wallet.";
        }
    }
}

async function claimTokens() {
    const responseMessage = document.getElementById("response-message");
    if (!contract) {
        console.error("Contract not initialized.");
        if (responseMessage) {
            responseMessage.innerText = "Please connect your wallet first.";
        }
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];

        console.log("Sending transaction from:", walletAddress);
        await contract.methods.claim().send({ from: walletAddress });

        if (responseMessage) {
            responseMessage.innerText = "Successfully claimed xDAI!";
        }
        console.log("Tokens claimed successfully.");
    } catch (error) {
        console.error("Error claiming tokens:", error);
        if (responseMessage) {
            responseMessage.innerText = `Error: ${error.message}`;
        }
    }
}


