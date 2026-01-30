"use client";

import { useState } from "react";
import { mintNFT } from "@/lib/contracts";

export function MintNFTForm() {
  const [mintUri, setMintUri] = useState("");

  const handleMint = async () => {
    if (!mintUri) return alert("Please enter IPFS URI");
    await mintNFT(mintUri);
    setMintUri("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Mint NFT</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">IPFS URI</label>
          <input
            type="text"
            value={mintUri}
            onChange={(e) => setMintUri(e.target.value)}
            placeholder="ipfs://Qm..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleMint}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Mint NFT
        </button>
      </div>
    </div>
  );
}
