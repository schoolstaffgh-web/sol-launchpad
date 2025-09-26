"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TokenCreatorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(9);
  const [supply, setSupply] = useState("");

  const handleCreateTokenPayment = async () => {
    try {
      setLoading(true);

      // Example: simulate payment
      const success = Math.random() > 0.5; // replace with real payment logic

      if (success) {
        alert("✅ Payment successful! Token created.");
        router.push("/success"); // redirect to success page
      } else {
        alert("❌ Payment failed. Please try again.");
        // stay on page, user can retry
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-b from-background to-slate-900">
      <div className="w-full max-w-lg p-8 rounded-2xl border border-teal-500 shadow-xl bg-black/20 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Create Your Token
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-200 mb-1">Token Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none"
              placeholder="MyToken"
            />
          </div>

          <div>
            <label className="block text-slate-200 mb-1">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none"
              placeholder="MTK"
            />
          </div>

          <div>
            <label className="block text-slate-200 mb-1">Decimals</label>
            <input
              type="number"
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none"
              placeholder="9"
            />
          </div>

          <div>
            <label className="block text-slate-200 mb-1">Total Supply</label>
            <input
              type="number"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none"
              placeholder="1000000"
            />
          </div>
        </div>

        <Button
          onClick={handleCreateTokenPayment}
          disabled={loading}
          className="w-full mt-6"
        >
          {loading ? "Processing..." : "Create Token"}
        </Button>
      </div>
    </div>
  );
}
