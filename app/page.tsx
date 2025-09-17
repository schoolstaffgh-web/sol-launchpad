"use client";

import { useEffect, useState } from "react";

export default function TokenCreatorPage() {
  const [connected, setConnected] = useState(false);
  const [pubkey, setPubkey] = useState<string | null>(null);
  const [amount, setAmount] = useState("0.01"); // default 0.01 SOL
  const [status, setStatus] = useState<string>("");
  const [receiver, setReceiver] = useState<string | null>(null);
  const [cluster, setCluster] = useState<"devnet" | "mainnet-beta">("devnet");

  // load receiver wallet from backend
  useEffect(() => {
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d.wallet) setReceiver(d.wallet);
        else setStatus("Receiver wallet not configured on server.");
      })
      .catch((e) => setStatus("Failed to fetch receiver wallet."));
  }, []);

  // helper to check Phantom
  function isPhantomAvailable() {
    return typeof window !== "undefined" && (window as any).solana && (window as any).solana.isPhantom;
  }

  // connect to Phantom
  async function connect() {
    if (!isPhantomAvailable()) {
      alert("Phantom not found. Install Phantom extension or open site inside Phantom mobile app.");
      return;
    }
    try {
      const resp = await (window as any).solana.connect();
      setConnected(true);
      setPubkey(resp.publicKey.toString());
      setStatus("Connected: " + resp.publicKey.toString());
    } catch (err) {
      console.error(err);
      setStatus("Connection failed or denied.");
    }
  }

  // send SOL payment from user's wallet to receiver
  async function pay() {
    if (!isPhantomAvailable()) {
      alert("Phantom not found.");
      return;
    }
    if (!receiver) {
      alert("Receiver wallet not configured on server.");
      return;
    }

    // validate amount
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Enter a valid amount of SOL.");
      return;
    }

    try {
      setStatus("Preparing transaction...");

      // dynamic import so it only runs client-side
      const solanaWeb3 = await import("@solana/web3.js");

      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl(cluster),
        "confirmed"
      );

      // ensure Phantom connection (will request if not connected)
      await (window as any).solana.connect();

      const fromPubkey = (window as any).solana.publicKey;
      if (!fromPubkey) {
        setStatus("Please unlock/connect Phantom wallet.");
        return;
      }

      // build transaction to transfer lamports
      const lamports = Math.round(amt * solanaWeb3.LAMPORTS_PER_SOL);
      const toPubkey = new solanaWeb3.PublicKey(receiver);

      const tx = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: fromPubkey,
          toPubkey: toPubkey,
          lamports,
        })
      );

      setStatus("Requesting signature in Phantom...");
      // sign and send via Phantom (modern API uses signAndSendTransaction)
      if ((window as any).solana.signAndSendTransaction) {
        const signed = await (window as any).solana.signAndSendTransaction(tx);
        setStatus("Transaction sent. Waiting confirmation...");
        await connection.confirmTransaction(signed.signature, "confirmed");
        setStatus("Payment confirmed: " + signed.signature);
        alert("Payment successful! Signature: " + signed.signature);
      } else {
        // fallback if signAndSendTransaction not available
        const signedTx = await (window as any).solana.signTransaction(tx);
        const txid = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(txid, "confirmed");
        setStatus("Payment confirmed: " + txid);
        alert("Payment successful! Signature: " + txid);
      }
    } catch (err: any) {
      console.error(err);
      setStatus("Payment failed: " + (err?.message || err));
      alert("Payment failed: " + (err?.message || err));
    }
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Token / Pay</h1>

      <div className="mb-4">
        <label className="block mb-1">Network</label>
        <select value={cluster} onChange={(e) => setCluster(e.target.value as any)} className="p-2 border rounded">
          <option value="devnet">Devnet (test)</option>
          <option value="mainnet-beta">Mainnet (real)</option>
        </select>
        <p className="text-sm text-gray-400 mt-1">Use Devnet to test before using Mainnet.</p>
      </div>

      <div className="mb-4">
        <button onClick={connect} className="px-4 py-2 bg-indigo-600 text-white rounded">
          {connected ? "Connected" : "Connect Phantom"}
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Amount (SOL)</label>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.0001" className="p-2 border rounded w-full" />
      </div>

      <div className="mb-4">
        <button onClick={pay} className="px-4 py-2 bg-teal-500 text-white rounded">
          Pay & Create Token (send SOL)
        </button>
      </div>

      <div className="mt-6 p-3 bg-gray-100 rounded">
        <div><strong>Status:</strong> {status}</div>
        <div><strong>Your pubkey:</strong> {pubkey || "not connected"}</div>
        <div><strong>Receiver (hidden on frontend):</strong> {receiver ? "configured" : "not configured"}</div>
      </div>
    </main>
  );
}
