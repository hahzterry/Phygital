"use client";

import { useRef } from "react";
import * as htmlToImage from "html-to-image";
import { Download, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface ClaimCertificateProps {
  nftName: string;
  nftDescription: string;
  nftImage: string;
  walletAddress: string;
  txHash: string;
  dropId: string;
  claimedAt: string;
}

export function ClaimCertificate({
  nftName,
  nftDescription,
  nftImage,
  walletAddress,
  txHash,
  dropId,
  claimedAt,
}: ClaimCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!certRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(certRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `phygital-certificate-${nftName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Certificate generation failed:", err);
    }
  };

  const imageSrc = nftImage?.startsWith("ipfs://")
    ? nftImage.replace("ipfs://", "https://ipfs.io/ipfs/")
    : nftImage;

  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`
    : "";
  const shortTx = txHash
    ? `${txHash.slice(0, 12)}...${txHash.slice(-10)}`
    : "";

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Hidden certificate — rendered off-screen  */}
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          pointerEvents: "none",
        }}
      >
        <div
          ref={certRef}
          style={{
            width: "600px",
            background: "#ffffff",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          }}
        >
          {/* Gradient header */}
          <div
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)",
              padding: "36px 40px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px" }}>
                🏁 CLAIM
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
              Certificate of Ownership
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: "40px" }}>
            {/* NFT Image + Name */}
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={nftName}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "16px",
                  objectFit: "cover",
                  border: "3px solid #e0e7ff",
                  flexShrink: 0,
                }}
                crossOrigin="anonymous"
              />
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#818cf8" }}>
                  3 Word Pin Drop
                </p>
                <h2 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 800, color: "#1f2937", letterSpacing: "-0.3px" }}>
                  {nftName}
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#6b7280", lineHeight: 1.5 }}>
                  {nftDescription?.length > 100
                    ? nftDescription.slice(0, 100) + "…"
                    : nftDescription}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "linear-gradient(to right, #e0e7ff, #f3f4f6)", marginBottom: "28px" }} />

            {/* Details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#9ca3af" }}>Claimed By</p>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "'Courier New', monospace" }}>{shortWallet}</p>
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#9ca3af" }}>Date Claimed</p>
                <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                  {new Date(claimedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <p style={{ margin: "0 0 4px", fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#9ca3af" }}>Transaction Hash</p>
                <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: "#4f46e5", fontFamily: "'Courier New', monospace" }}>{shortTx}</p>
              </div>
            </div>

            {/* Verified badge */}
            <div
              style={{
                background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
                border: "1px solid #e0e7ff",
                borderRadius: "16px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#ffffff", fontSize: "18px" }}>✓</span>
              </div>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 700, color: "#3730a3" }}>Verified On-Chain · Base Sepolia</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#6366f1" }}>ERC-1155 · This certificate is cryptographically verifiable</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ background: "#f9fafb", borderTop: "1px solid #f0f0f0", padding: "16px 40px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>claim.3wordpin.com · Powered by 3 Word Pin</p>
          </div>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 py-4 text-sm rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
      >
        <Download className="h-4 w-4" />
        Download Certificate
      </button>
    </div>
  );
}
