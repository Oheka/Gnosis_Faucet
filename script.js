const CONTRACT_ADDRESS = "0x834b798ae5Fe39205D675912D7f9016eE112b961";
const CONTRACT_ABI = [ /* Replace with your actual ABI */ ];

let web3;
let contract;

// Function to connect the wallet
async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            // Request wallet connection
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const accounts = await web3.eth.getAccounts();
            const walletAddress = accounts[0];

            // Display the connected wallet address
            document.getElementById("wallet-address").value = walletAddress;

            // Initialize the contract
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

            document.getElementById("response-message").innerText =
                "Wallet connected successfully: " + walletAddress;
        } catch (error) {
            console.error("Error connecting wallet:", error);
            document.getElementById("response-message").innerText =
                "Failed to connect wallet. Please try again.";
        }
    } else {
        alert("MetaMask is required. Please install it and reload the page.");
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
