import { Keypair, Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

const keypair = Keypair.generate();

console.log(`Public Key:, ${keypair.publicKey}`);

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const signature = await connection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);

await connection.confirmTransaction(signature);

const accountInfo = await connection.getAccountInfo(keypair.publicKey);
console.log(`Wallet Info: ${JSON.stringify(accountInfo, null, 2)}`);


const tokenAddress = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
const tokenProgramInfo = await connection.getAccountInfo(tokenAddress);
console.log(`Token Program Info: ${JSON.stringify(tokenProgramInfo, (key, value) => {
    if (key === "data" && value && value.length > 1) {
        return [
            value[0],
            "...truncated, total bytes: " + value.length + "...",
            value[value.length - 1]
        ];
    }
    return value;
}, 2)}`)

const usdcTokenAddress = new PublicKey('EmXq3Ni9gfudTiyNKzzYvpnQqnJEMRw2ttnVXoJXjLo1')
const usdcTokenInfo = await connection.getAccountInfo(usdcTokenAddress);
console.log(`USDC Token Info: ${JSON.stringify(usdcTokenInfo, (key, value) => {
    if (key === "data" && value && value.length > 1) {
        return [
            value[0],
            "...truncated, total bytes: " + value.length + "...",
            value[value.length - 1]
        ];
    }
    return value;
}, 2)}`)


const mintData = await getMint(connection, usdcTokenAddress, 'confirmed');
console.log(`USDC Mint Info: ${JSON.stringify(mintData, (key, value) => {
    if (typeof value === "bigint") {
        return value.toString();
    }
    if (Buffer.isBuffer(value)) {
        return `<Buffer ${value.toString("hex")}>`;
    }
    return value;
}, 2)}`);