"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";
import Image from "next/image";

export default function TokenCreatorPage() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState<number | string>(9);
  const [supply, setSupply] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [ownerWallet, setOwnerWallet] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [receiverWallet, setReceiverWallet] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Idle");
  const [network, setNetwork] = useState<"devnet" | "mainnet-beta">("devnet");
  const [loading, setLoading] = useState(false);

  // Fetch receiver wallet from backend (so the frontend never contains your wallet hard-coded)
  useEffect(() => {
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d.wallet) setReceiverWallet(d.wallet);
        else setStatus("Receiver wallet not configured on server.");
      })
      .catch((e) => setStatus("Failed to fetch receiver wallet."));
  }, []);

  // file input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
  };

  // PAYMENT: send SOL from user's wallet to your receiver wallet
  // This function uses the browser's injected wallet (Phantom) directly.
  // It dynamically imports @solana/web3.js to avoid SSR issues.
  const handleCreateTokenPayment = async () => {
    try {
      if (!receiverWallet) {
        alert("Receiver wallet not configured on server.");
        return;
      }

      // Check Phantom availability
      if (typeof window === "undefined" || !(window as any).solana) {
        alert("No injected wallet found. Install Phantom or open in Phantom browser.");
        return;
      }

      const provider = (window as any).solana;
      if (!provider.isPhantom) {
        // may still work with other wallets but this code expects Phantom-like API
        const ok = confirm("Wallet found is not Phantom. Continue if compatible?");
        if (!ok) return;
      }

      // connect (will prompt user if not connected)
      setStatus("Connecting to wallet...");
      await provider.connect();
      const fromPubkey = provider.publicKey;
      if (!fromPubkey) {
        alert("Please connect/unlock your wallet in the popup.");
        return;
      }

      // Ask the user how much SOL to pay for token creation
      const priceSOL = prompt("Enter amount of SOL to pay for token creation (e.g. 0.5)", "0.5");
      if (!priceSOL) return;
      const amount = parseFloat(priceSOL);
      if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount.");
        return;
      }

      setLoading(true);
      setStatus("Preparing transaction...");

      // load web3 on client only
      const solanaWeb3 = await import("@solana/web3.js");

      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl(network),
        "confirmed"
      );

      // build transfer instruction
      const lamports = Math.round(amount * solanaWeb3.LAMPORTS_PER_SOL);
      const toPubkey = new solanaWeb3.PublicKey(receiverWallet);

      const tx = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: fromPubkey,
          toPubkey,
          lamports,
        })
      );

      // IMPORTANT: set recentBlockhash & feePayer before sending
      const latest = await connection.getLatestBlockhash("finalized");
      tx.recentBlockhash = latest.blockhash;
      tx.feePayer = fromPubkey;

      setStatus("Requesting approval in wallet...");
      // Try modern signAndSendTransaction (Phantom supports this). If not available, fallback to signTransaction + sendRawTransaction.
      if (provider.signAndSendTransaction) {
        const signed = await provider.signAndSendTransaction(tx);
        setStatus("Transaction sent, waiting confirmation...");
        await connection.confirmTransaction(signed.signature, "confirmed");
        setStatus("Payment confirmed: " + signed.signature);
        alert("Payment successful! Tx: " + signed.signature);
      } else if (provider.signTransaction) {
        const signedTx = await provider.signTransaction(tx);
        const raw = signedTx.serialize();
        const txid = await connection.sendRawTransaction(raw);
        await connection.confirmTransaction(txid, "confirmed");
        setStatus("Payment confirmed: " + txid);
        alert("Payment successful! Tx: " + txid);
      } else {
        throw new Error("Wallet does not support required signing API.");
      }
    } catch (err: any) {
      console.error(err);
      setStatus("Payment failed: " + (err?.message || err));
      alert("Payment failed: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-gradient-to-b from-background to-slate-900"
    >
      <section className="flex-grow px-[2em] lg:px-[4em] py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="mb-8 text-3xl font-bold text-center text-teal-400">
            Token Creator
          </h1>
          <p className="mb-8 text-sm text-center text-white">
            Create your own Solana token with ease. Customize your token's
            properties and launch it on the Solana blockchain.
          </p>

          <div className="p-6 bg-opacity-50 border rounded-lg bg-slate-800 backdrop-blur-sm border-teal-400/20">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* NAME */}
              <Input
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                placeholder="Put the name of your token"
                label="Name"
              />

              {/* SYMBOL */}
              <Input
                value={symbol}
                onChange={(e: any) => setSymbol(e.target.value)}
                placeholder="Put the symbol of your token"
                label="Symbol"
              />

              {/* DECIMALS */}
              <Input
                value={decimals}
                onChange={(e: any) => setDecimals(e.target.value)}
                placeholder="Put the decimals of your token"
                label="Decimals"
                type="number"
              />

              {/* UPLOAD IMAGE */}
              <div className="relative">
                {/* hidden real file input */}
                <input
                  id="token-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="token-image-input" className="absolute top-0 bottom-0 right-0">
                  <Button className="text-white bg-teal-400 hover:bg-teal-500 border-teal-400/50">
                    <Upload className="w-4 h-4 mr-2" /> Upload Image
                  </Button>
                </label>
                {imageFile && (
                  <div className="mt-2 col-span-2">
                    <p className="text-sm text-slate-300">{imageFile.name} uploaded ✅</p>
                    {imagePreviewUrl && (
                      // next/image works if it's local blob; use simple img fallback to avoid domain config
                      // we show a small preview using a normal img tag
                      <img src={imagePreviewUrl} alt="preview" className="mt-2 w-32 h-32 object-cover rounded" />
                    )}
                  </div>
                )}
              </div>

              {/* SUPPLY */}
              <Input
                value={supply as any}
                onChange={(e: any) => setSupply(e.target.value)}
                placeholder="Put the supply of your token"
                label="Supply"
                type="number"
              />

              <Textarea
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                placeholder="Enter Epic Description here"
                className="col-span-2"
              />

              <Input
                value={""}
                onChange={() => {}}
                placeholder="https://"
                label="Website"
              />
              <Input
                value={""}
                onChange={() => {}}
                placeholder="https://twitter.com/"
                label="Twitter"
              />
              <Input
                value={""}
                onChange={() => {}}
                placeholder="https://t.me/"
                label="Telegram"
              />
              <Input
                value={""}
                onChange={() => {}}
                placeholder="https://discord.gg/"
                label="Discord"
              />

              <div className="col-span-2">
                <h3 className="mb-4 text-lg font-semibold text-teal-400">
                  Token Options:
                </h3>
                <div className="flex flex-wrap justify-between gap-4">
                  {["Immutable", "Revoke Freeze", "Revoke Mint"].map(
                    (option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Switch id={option} />
                        <label htmlFor={option} className="text-white">
                          {option}
                        </label>
                        <span className="text-sm text-gray-400">
                          (+0.1 SOL)
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <Input
                value={ownerWallet}
                onChange={(e: any) => setOwnerWallet(e.target.value)}
                placeholder="OWNER WALLET ADDRESS"
                className="col-span-2"
              />

              <div className="col-span-2 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label className="text-sm text-slate-300 mr-2">Network: </label>
                    <select
                      value={network}
                      onChange={(e) =>
                        setNetwork(e.target.value as "devnet" | "mainnet-beta")
                      }
                      className="p-2 rounded bg-slate-700 text-white"
                    >
                      <option value="devnet">Devnet (test)</option>
                      <option value="mainnet-beta">Mainnet (real)</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-sm text-slate-300">Receiver: {receiverWallet ? "configured" : "not configured"}</p>
                  </div>
                </div>

                <Button
                  className="px-4 py-2 font-bold text-white bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-500 hover:to-teal-300"
                  onClick={handleCreateTokenPayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Create Token (Pay)"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Liquidity Pool Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h2 className="mb-6 text-2xl font-bold text-center text-teal-400">
            Create a Liquidity Pool
          </h2>
          <p className="mb-8 text-sm text-center text-white">
            If you want to create a liquidity pool, you will need to Revoke
            Freeze Authority of the Token. You can also Revoke the Mint
            Authority to get the people reliability. You can do both here, each
            one costs 0.1 SOL.
          </p>
          <div className="p-6 bg-opacity-50 border rounded-lg bg-slate-800 backdrop-blur-sm border-teal-400/20">
            <Input placeholder="Put your token address" className="mb-4" />
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                className="text-white bg-teal-400 hover:bg-teal-500 border-teal-400/50"
              >
                Revoke Freeze Authority
              </Button>
              <Button
                variant="outline"
                className="text-white bg-teal-400 hover:bg-teal-500 border-teal-400/50"
              >
                Revoke Mint Authority
              </Button>
            </div>
          </div>
        </motion.div>

        {/* How to use Solana Token Creator Section (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <h2 className="mb-6 text-2xl font-bold text-center text-teal-400">
            How to use Solana Token Creator
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="p-6 space-y-4 bg-opacity-50 border rounded-lg bg-slate-800 backdrop-blur-sm border-teal-400/20">
              <ol className="space-y-2 text-white list-decimal list-inside">
                <li>Connect your Solana wallet</li>
                <li>Write the name you want for your Token</li>
                <li>Indicate the symbol (max 8 characters)</li>
                <li>
                  Select the decimals quantity (0 for Whitelist Token, 6 for
                  utility token)
                </li>
                <li>Write the description you want for your SPL Token</li>
                <li>Upload the image for your token (PNG)</li>
                <li>Put the Supply of your Token</li>
                <li>
                  Click on create, accept the transaction and wait until your
                  token is ready
                </li>
              </ol>
              <p className="mt-4 text-sm text-slate-300">
                The cost of creating the Token is 0.5 SOL, it includes all fees
                needed for the SPL Token Creation. The creation process will
                start and will take some seconds. After that you will receive
                the total supply of the token in the wallet you chose. Check
                here a whole blog post about how to create a Solana Token.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src={HeroImg}
                alt="hero-image"
                className="h-auto max-w-full border rounded-lg shadow-lg border-teal-400/20"
              />
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </motion.main>
  );
}
