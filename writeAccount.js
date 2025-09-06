import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    SystemProgram,
    sendAndConfirmTransaction,
    Transaction,
} from "@solana/web3.js";

import {
    MINT_SIZE,
    TOKEN_2022_PROGRAM_ID,
    createInitializeMint2Instruction,
    getMinimumBalanceForRentExemptMint,
    getMint,
} from "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const sender = Keypair.generate();
const wallet = Keypair.generate();
const mintAccount = Keypair.generate();

console.log("Sender:", sender.publicKey.toBase58());
console.log("Wallet (Mint Authority):", wallet.publicKey.toBase58());
console.log("Mint Account:", mintAccount.publicKey.toBase58());

console.log("Airdropping 2 SOL to sender...");
const sig = await connection.requestAirdrop(sender.publicKey, 2 * LAMPORTS_PER_SOL);
await connection.confirmTransaction(sig, "confirmed");

const fundTx = new Transaction().add(
    SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: wallet.publicKey,
        lamports: 1 * LAMPORTS_PER_SOL,
    })
);

const fundSig = await sendAndConfirmTransaction(connection, fundTx, [sender]);
console.log("Wallet funded:", fundSig);

const rentExemptionLamports = await getMinimumBalanceForRentExemptMint(connection);

const createMintTx = new Transaction().add(
    SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintAccount.publicKey,
        space: MINT_SIZE,
        lamports: rentExemptionLamports,
        programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMint2Instruction(
        mintAccount.publicKey,
        2,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_2022_PROGRAM_ID
    )
);

const mintSig = await connection.sendTransaction(createMintTx, [wallet, mintAccount]);
await connection.confirmTransaction(mintSig, "confirmed");
console.log("Mint created:", mintSig);

const mintData = await getMint(
    connection,
    mintAccount.publicKey,
    "confirmed",
    TOKEN_2022_PROGRAM_ID
);

const senderBalance = await connection.getBalance(sender.publicKey);
const walletBalance = await connection.getBalance(wallet.publicKey);

console.log("Sender Balance:", senderBalance / LAMPORTS_PER_SOL, "SOL");
console.log("Wallet Balance:", walletBalance / LAMPORTS_PER_SOL, "SOL");
console.log(
    "Mint Account:",
    JSON.stringify(
        mintData,
        (key, value) => {
            if (typeof value === "bigint") return value.toString();
            if (Buffer.isBuffer(value)) return `<Buffer ${value.toString("hex")}>`;
            return value;
        },
        2
    )
);


