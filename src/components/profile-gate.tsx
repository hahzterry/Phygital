"use client";

/**
 * ============================================================
 * ProfileGate — Full-screen modal requiring profile completion
 * ============================================================
 *
 * Shown when a user's 7-day trial has expired and they haven't
 * completed their profile (name + email). This modal is
 * non-dismissable — the user MUST complete their profile to
 * continue using the app.
 */

import { useState } from "react";

interface Props {
  address: string;
  onComplete: () => void;
  getHeaders: () => Promise<Record<string, string>>;
}

export function ProfileGate({ address, onComplete, getHeaders }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      setError("Both name and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const headers = await getHeaders();
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ address, name, email }),
      });
      const data = await res.json();
      if (data.success || data.profile) {
        onComplete();
      } else {
        setError("Failed to save profile. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    // Full-screen backdrop — non-dismissable
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "#fff", borderRadius: "20px", padding: "36px",
        maxWidth: "440px", width: "100%",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
      }}>
        {/* Logo mark */}
        <div style={{ marginBottom: "24px" }}>
          <svg width="40" height="40" viewBox="0 0 80 80" fill="none">
            <g transform="translate(40,40) rotate(-6) translate(-40,-40)">
              <rect x="16" y="16" width="60" height="60" rx="10" fill="#c8442a"/>
            </g>
            <g transform="translate(40,40) rotate(-6) translate(-40,-40)">
              <rect x="10" y="10" width="60" height="60" rx="10" fill="#1a1624"/>
            </g>
            <g transform="translate(40,40) rotate(4) translate(-40,-40)">
              <rect x="22" y="22" width="36" height="36" rx="5" fill="none"
                stroke="#f7f4ef" strokeWidth="3"/>
            </g>
            <circle cx="40" cy="40" r="4" fill="#f7f4ef"/>
          </svg>
        </div>

        <h2 style={{
          fontSize: "22px", fontWeight: 800, color: "#1a1624",
          letterSpacing: "-0.03em", marginBottom: "8px",
        }}>
          Complete your profile to continue
        </h2>
        <p style={{
          fontSize: "14px", color: "#6b6560",
          lineHeight: 1.6, marginBottom: "28px",
        }}>
          Your free trial has ended. Add your name and email
          to keep using Stamp — it takes 10 seconds.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{
              fontSize: "12px", fontWeight: 500, color: "#1a1624",
              display: "block", marginBottom: "6px",
            }}>
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Tanish K."
              style={{
                width: "100%", padding: "10px 14px",
                border: "1.5px solid #e8e3db", borderRadius: "10px",
                fontSize: "14px", outline: "none", color: "#1a1624",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div>
            <label style={{
              fontSize: "12px", fontWeight: 500, color: "#1a1624",
              display: "block", marginBottom: "6px",
            }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%", padding: "10px 14px",
                border: "1.5px solid #e8e3db", borderRadius: "10px",
                fontSize: "14px", outline: "none", color: "#1a1624",
                fontFamily: "inherit",
              }}
            />
          </div>

          {error && (
            <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: loading ? "#999" : "#1a1624",
              color: "#fff", border: "none",
              borderRadius: "10px", padding: "12px",
              fontSize: "14px", fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "4px", fontFamily: "inherit",
            }}
          >
            {loading ? "Saving..." : "Complete profile →"}
          </button>
        </div>

        <p style={{
          fontSize: "11px", color: "#8a7f72",
          marginTop: "16px", textAlign: "center",
        }}>
          Your email is only used for claim notifications.
          We never share it.
        </p>
      </div>
    </div>
  );
}
