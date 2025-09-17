// /api/wallet.js
export default function handler(req, res) {
  // Only GET is needed for the frontend to fetch the destination wallet
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const wallet = process.env.RECEIVER_WALLET || "";
  if (!wallet) {
    return res.status(500).json({ ok: false, error: "Receiver wallet not configured" });
  }

  res.status(200).json({ ok: true, wallet });
}
