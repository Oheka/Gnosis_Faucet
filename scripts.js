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

let web3;
let contract;

// Function to connect wallet
async function connectWallet() {
    console.log("Attempting to connect wallet...");

    if (typeof window.ethereum !== "undefined") {
        try {
            // Request wallet connection
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Wallet connection request sent.");

            // Initialize Web3 instance
            web3 = new Web3(window.ethereum);
            console.log("Web3 initialized.");

            // Get wallet address
            const accounts = await web3.eth.getAccounts();
            const walletAddress = accounts[0];
            console.log("Connected wallet address:", walletAddress);

            // Display wallet address in input field
            document.getElementById("wallet-address").value = walletAddress;

            // Initialize contract
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            console.log("Contract initialized:", contract);

            document.getElementById("response-message").innerText =
                "Wallet connected successfully!";
        } catch (error) {
            console.error("Error connecting wallet:", error);
            document.getElementById("response-message").innerText =
                "Failed to connect wallet. Please try again.";
        }
    } else {
        alert("MetaMask is required. Please install it from https://metamask.io/");
        console.log("MetaMask not detected.");
    }
}

// Function to claim xDAI
async function claimTokens() {
    console.log("Attempting to claim tokens...");

    if (!contract) {
        console.log("Contract is not initialized.");
        document.getElementById("response-message").innerText =
            "Please connect your wallet first.";
        return;
    }

    try {
        // Get wallet address
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];
        console.log("Using wallet address:", walletAddress);

        // Call the claim function
        await contract.methods.claim().send({ from: walletAddress });
        console.log("Claim transaction sent successfully.");

        document.getElementById("response-message").innerText =
            "Successfully claimed 0.001 xDAI!";
    } catch (error) {
        console.error("Error claiming tokens:", error);
        document.getElementById("response-message").innerText =
            `Error: ${error.message}`;
    }
}

// Attach event listeners
document.getElementById("connect-wallet").addEventListener("click", connectWallet);
document.getElementById("claim-button").addEventListener("click", claimTokens);
