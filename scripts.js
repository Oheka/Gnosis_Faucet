const CONTRACT_ADDRESS = "0x4B1C320ac3cD4C70d0c308880FA10551931739Cc";
const CONTRACT_ABI = [
    // ABI du contrat
];

let web3;
let contract;

async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask or Brave Wallet not found. Please install MetaMask.");
        return;
    }
    try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];
        document.getElementById("wallet-address").value = walletAddress;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        document.getElementById("response-message").innerText = "Wallet connected successfully!";
        document.getElementById("response-message").classList.add("success");
        document.getElementById("claim-button").disabled = false;
    } catch (error) {
        document.getElementById("response-message").innerText = "Failed to connect wallet.";
        document.getElementById("response-message").classList.add("error");
    }
}

async function claimTokens() {
    if (!contract) {
        document.getElementById("response-message").innerText = "Please connect your wallet first.";
        document.getElementById("response-message").classList.add("error");
        return;
    }
    const spinner = document.getElementById("loading-spinner");
    spinner.classList.remove("hidden");

    try {
        const accounts = await web3.eth.getAccounts();
        const walletAddress = accounts[0];
        await contract.methods.claim().send({ from: walletAddress });
        document.getElementById("response-message").innerText = "Successfully claimed xDAI!";
        document.getElementById("response-message").classList.add("success");
    } catch (error) {
        document.getElementById("response-message").innerText = `Error: ${error.message}`;
        document.getElementById("response-message").classList.add("error");
    } finally {
        spinner.classList.add("hidden");
    }
}

document.getElementById("connect-wallet").addEventListener("click", connectWallet);
document.getElementById("claim-button").addEventListener("click", claimTokens);

