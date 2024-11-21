// Contract address and ABI
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

// Function to connect the wallet
async function connectWallet() {
    console.log("Attempting to connect wallet...");

    if (typeof window.ethereum !== "undefined") {
        console.log("MetaMask detected.");
        try {
            // Request access to MetaMask
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("MetaMask connection request sent.");

            // Initialize Ethers.js provider and signer
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            console.log("Ethers.js provider and signer initialized.");

            // Get the connected wallet address
            const walletAddress = await signer.getAddress();
            console.log("Connected wallet address:", walletAddress);

            // Display the wallet address in the input field
            document.getElementById("wallet-address").value = walletAddress;

            // Initialize the contract
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            console.log("Contract initialized successfully.");

            // Display success message
            document.getElementById("response-message").innerText =
                "Wallet connected successfully!";
        } catch (error) {
            console.error("Error connecting wallet:", error);
            document.getElementById("response-message").innerText =
                "Failed to connect wallet. Please try again.";
        }
    } else {
        console.log("MetaMask not detected.");
        alert("MetaMask is not installed. Please install it from https://metamask.io/");
    }
}

// Function to claim xDAI
async function claimTokens() {
    console.log("Attempting to claim tokens...");
    if (!contract) {
        console.log("Contract not initialized.");
        document.getElementById("response-message").innerText =
            "Please connect your wallet first.";
        return;
    }

    try {
        // Call the claim function on the smart contract
        const transaction = await contract.claim();
        console.log("Claim transaction sent. Waiting for confirmation...");

        // Wait for the transaction to be mined
        const receipt = await transaction.wait();
        console.log("Transaction confirmed:", receipt);

        // Display success message
        document.getElementById("response-message").innerText =
            "Successfully claimed 0.001 xDAI!";
    } catch (error) {
        console.error("Error claiming tokens:", error);
        document.getElementById("response-message").innerText =
            `Error: ${error.message}`;
    }
}

// Attach event listeners to buttons
document.getElementById("connect-wallet").addEventListener("click", () => {
    console.log("Connect Wallet button clicked.");
    connectWallet();
});

document.getElementById("claim-button").addEventListener("click", () => {
    console.log("Claim xDAI button clicked.");
    claimTokens();
});
