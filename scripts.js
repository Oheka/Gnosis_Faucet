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

// Function to connect the wallet
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            // Initialize Web3
            web3 = new Web3(window.ethereum);

            // Request wallet connection
            await window.ethereum.request({ method: "eth_requestAccounts" });

            // Get connected wallet address
            const accounts = await web3.eth.getAccounts();
            const walletAddress = accounts[0];

            // Display wallet address in the input field
            document.getElementById("wallet-address").value = walletAddress;

            // Initialize the contract
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

            // Display success message
            document.getElementById("response-message").innerText =
                "Wallet connected successfully!";
        } catch (error) {
            console.error("Error connecting wallet:", error);
            document.getElementById("response-message").innerText =
                "Failed to connect wallet. Please try again.";
        }
    } else {
        alert("MetaMask is required. Please install it from https://metamask.io/");
    }
}

// Function to claim xDAI
async function claimTokens() {
    if (!contract) {
        document.getElementById("response-message").innerText =
            "Please connect your wallet first.";
        return;
    }

    try {
        // Get connected wallet address
        const accounts = await web3.eth.getAccounts();

        // Call the claim function on the smart contract
        await contract.methods.claim().send({ from: accounts[0] });

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
document.getElementById("connect-wallet").addEventListener("click", connectWallet);
document.getElementById("claim-button").addEventListener("click", claimTokens);
