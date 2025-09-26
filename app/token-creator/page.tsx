"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ import router
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

export default function TokenCreatorPage() {
  const router = useRouter(); // ✅ router instance
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

  // File input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
  };

  // ✅ PAYMENT + Redirect handling
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

      let txid: string;
      if (provider.signAndSendTransaction) {
        const signed = await provider.signAndSendTransaction(tx);
        await connection.confirmTransaction(signed.signature, "confirmed");
        txid = signed.signature;
      } else if (provider.signTransaction) {
        const signedTx = await provider.signTransaction(tx);
        const raw = signedTx.serialize();
        txid = await connection.sendRawTransaction(raw);
        await connection.confirmTransaction(txid, "confirmed");
      } else {
        throw new Error("Wallet does not support sending transactions.");
      }

      setStatus("Payment confirmed: " + txid);
      // ✅ Redirect on success
      router.push("/success");
    } catch (err: any) {
      console.error(err);
      setStatus("Payment failed: " + (err?.message || err));
      alert("Payment failed: " + (err?.message || err));
      // ❌ Stay on page, user can retry
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... your same JSX from before, with the Create Token button calling handleCreateTokenPayment
  );
}
