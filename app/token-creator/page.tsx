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

  // Reset form after successful payment
  const resetForm = () => {
    setName("");
    setSymbol("");
    setDecimals("");
    setSupply("");
    setDescription("");
    setOwnerWallet("");
    setWebsite("");
    setTwitter("");
    setTelegram("");
    setDiscord("");
    setImageFile(null);
    setImagePreviewUrl(null);
  };

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

  // PAYMENT function
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
        resetForm(); // ✅ reset only on success
      } else if (provider.signTransaction) {
        const signedTx = await provider.signTransaction(tx);
        const raw = signedTx.serialize();
        const txid = await connection.sendRawTransaction(raw);
        await connection.confirmTransaction(txid, "confirmed");
        alert("Payment successful! Tx: " + txid);
        setStatus("Payment confirmed: " + txid);
        resetForm(); // ✅ reset only on success
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
      {/* ... unchanged form content ... */}
      <section className="flex-grow px-[2em] lg:px-[4em] py-12">
        {/* your full form stays the same */}
      </section>
      <Footer />
    </motion.main>
  );
}
