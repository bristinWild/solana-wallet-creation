import { Keypair, Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const keypair = Keypair.generate();

console.log(`Public Key:, ${keypair.publicKey}`);

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const signature = await connection.requestAirdrop(keypair.publicKey, LAMPORTS_PER_SOL);

await connection.confirmTransaction(signature);

const accountInfo = await connection.getAccountInfo(keypair.publicKey);
console.log(`Wallet Info: ${JSON.stringify(accountInfo, null, 2)}`);


const tokenAddress = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
const tokenProgramInfo = await connection.getAccountInfo(tokenAddress);
console.log(`Token Program Info: ${JSON.stringify(tokenProgramInfo, null, 2)}`)

