console.log("Ethers.js availability:", typeof ethers);

const CONTRACT_ADDRESS = "0x834b798ae5Fe39205D675912D7f9016eE112b961";
const CONTRACT_ABI = [ /* Votre ABI ici */ ];

let provider;
let signer;
let contract;

// Fonction pour connecter le wallet
async function connectWallet() {
    console.log("Attempting to connect wallet...");

    if (typeof ethers === "undefined") {
        console.error("Ethers.js is not loaded.");
        document.getElementById("response-message").innerText =
            "Ethers.js is not available. Please check your setup.";
        return;
    }

    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("MetaMask connection request sent.");

            // Initialisation d'Ethers.js
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();

            const walletAddress = await signer.getAddress();
            console.log("Connected wallet address:", walletAddress);

            // Initialisation du contrat
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            console.log("Contract initialized successfully.");

            document.getElementById("wallet-address").value = walletAddress;
            document.getElementById("response-message").innerText =
                "Wallet connected successfully!";
        } catch (error) {
            console.error("Error connecting wallet:", error);
            document.getElementById("response-message").innerText =
                "Failed to connect wallet. Please try again.";
        }
    } else {
        console.error("MetaMask not detected.");
        alert("MetaMask is not installed. Please install it from https://metamask.io/");
    }
}

// Gestionnaire d'événement pour le bouton
document.getElementById("connect-wallet").addEventListener("click", () => {
    connectWallet();
});
