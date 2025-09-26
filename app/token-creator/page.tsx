"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

export default function TokenCreatorPage() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState<number | string>("");
  const [supply, setSupply] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [ownerWallet, setOwnerWallet] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [discord, setDiscord] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [receiverWallet, setReceiverWallet] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Idle");
  const [network, setNetwork] = useState<"devnet" | "mainnet-beta">("devnet");
  const [loading, setLoading] = useState(false);

  // Fetch receiver wallet from backend
  useEffect(() => {
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d.wallet) setReceiverWallet(d.wallet);
        else setStatus("Receiver wallet not configured on server.");
      })
      .catch(() => setStatus("Failed to fetch receiver wallet."));
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

  // PAYMENT function (unchanged)
  const handleCreateTokenPayment = async () => {
    try {
      if (!receiverWallet) {
        alert("Receiver wallet not configured on server.");
        return;
      }
      if (typeof window === "undefined" || !(window as any).solana) {
        alert("No injected wallet found. Install Phantom or open in Phantom browser.");
        return;
      }
      const provider = (window as any).solana;
      await provider.connect();
      const fromPubkey = provider.publicKey;
      if (!fromPubkey) {
        alert("Please connect/unlock your wallet in the popup.");
        return;
      }

      const priceSOL = prompt("Enter amount of SOL to pay for token creation (e.g. 0.5)", "0.5");
      if (!priceSOL) return;
      const amount = parseFloat(priceSOL);
      if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount.");
        return;
      }

      setLoading(true);
      setStatus("Preparing transaction...");
      const solanaWeb3 = await import("@solana/web3.js");

      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl(network),
        "confirmed"
      );
      const lamports = Math.round(amount * solanaWeb3.LAMPORTS_PER_SOL);
      const toPubkey = new solanaWeb3.PublicKey(receiverWallet);

      const tx = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        })
      );
      const latest = await connection.getLatestBlockhash("finalized");
      tx.recentBlockhash = latest.blockhash;
      tx.feePayer = fromPubkey;

      if (provider.signAndSendTransaction) {
        const signed = await provider.signAndSendTransaction(tx);
        await connection.confirmTransaction(signed.signature, "confirmed");
        alert("Payment successful! Tx: " + signed.signature);
        setStatus("Payment confirmed: " + signed.signature);
      } else if (provider.signTransaction) {
        const signedTx = await provider.signTransaction(tx);
        const raw = signedTx.serialize();
        const txid = await connection.sendRawTransaction(raw);
        await connection.confirmTransaction(txid, "confirmed");
        alert("Payment successful! Tx: " + txid);
        setStatus("Payment confirmed: " + txid);
      }
    } catch (err: any) {
      console.error(err);
      alert("Payment failed: " + (err?.message || err));
      setStatus("Payment failed: " + (err?.message || err));
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
                onChange={(e) => setName(e.target.value)}
                placeholder="Put the name of your token"
                label="Name"
              />

              {/* SYMBOL */}
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Put the symbol of your token"
                label="Symbol"
              />

              {/* DECIMALS */}
              <Input
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
                placeholder="Put the decimals of your token"
                label="Decimals"
                type="number"
              />

              {/* UPLOAD IMAGE */}
              <div
                className="relative col-span-2 border-2 border-dashed border-teal-400/50 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/30 transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreviewUrl(URL.createObjectURL(file));
                  }
                }}
                onClick={() =>
                  document.getElementById("token-image-input")?.click()
                }
              >
                <input
                  id="token-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-teal-400 mb-2" />
                    <p className="text-sm text-slate-300">
                      Click or drag & drop to upload image
                    </p>
                  </>
                )}

                {imageFile && (
                  <p className="mt-2 text-sm text-slate-300 text-center">
                    {imageFile.name} uploaded ✅
                  </p>
                )}
              </div>

              {/* SUPPLY */}
              <Input
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                placeholder="Put the supply of your token"
                label="Supply"
                type="number"
              />

              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Epic Description here"
                className="col-span-2"
              />

              {/* SOCIALS */}
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                label="Website"
              />
              <Input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/"
                label="Twitter"
              />
              <Input
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="https://t.me/"
                label="Telegram"
              />
              <Input
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="https://discord.gg/"
                label="Discord"
              />

              {/* OPTIONS */}
              <div className="col-span-2">
                <h3 className="mb-4 text-lg font-semibold text-teal-400">
                  Token Options:
                </h3>
                <div className="flex flex-wrap justify-between gap-4">
                  {["Immutable", "Revoke Freeze", "Revoke Mint"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Switch id={option} />
                      <label htmlFor={option} className="text-white">
                        {option}
                      </label>
                      <span className="text-sm text-gray-400">(+0.1 SOL)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* OWNER WALLET */}
              <Input
                value={ownerWallet}
                onChange={(e) => setOwnerWallet(e.target.value)}
                placeholder="OWNER WALLET ADDRESS"
                className="col-span-2"
              />

              {/* NETWORK + BUTTON */}
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
                    <p className="text-sm text-slate-300">
                      Receiver: {receiverWallet ? "configured" : "not configured"}
                    </p>
                  </div>
                </div>

                <Button
                  className="px-4 py-2 font-bold text-white bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-500 hover:to-teal-300"
                  onClick={handleCreateTokenPayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Create Token"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- The rest (Liquidity Pool + How to use) remains same as your version --- */}
      </section>
      <Footer />
    </motion.main>
  );
}
