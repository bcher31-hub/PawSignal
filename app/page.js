"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Map from "@/components/Map";
import PetFeed from "@/components/PetFeed";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  // =========================
  // 🔥 SERVICE WORKER
  // =========================
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // =========================
  // 🔐 NOTIFICATIONS
  // =========================
  useEffect(() => {
    if (!("Notification" in window)) return;

    Notification.requestPermission();
  }, []);

  // =========================
  // 🧠 DATA ENGINE (SOURCE OF TRUTH)
  // =========================
  useEffect(() => {
    const loadPets = async () => {
      const { data } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

      setPets(data || []);
    };

    loadPets();

    const channel = supabase
      .channel("lost_pets_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lost_pets" },
        (payload) => {
          setPets((prev) => {
            const exists = prev.some((p) => p.id === payload.new.id);
            if (exists) return prev;
            return [payload.new, ...prev];
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // =========================
  // 🧠 UI MODE (EMOTIONAL STATE)
  // =========================
  const nearbyCount = pets.length;

  const uiMode =
    nearbyCount === 0 ? "calm" :
    nearbyCount < 3 ? "watch" :
    "alert";

  // =========================
  // 🎨 STYLES
  // =========================
  const glassHeader = {
    margin: 10,
    padding: 12,
    borderRadius: 14,
    textAlign: "center",
    fontWeight: "bold",
    backdropFilter: "blur(10px)",
    background: "rgba(255,255,255,0.7)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
  };

  const fabMain = {
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg,#ff6b6b,#ff3b3b)",
    color: "white",
    fontSize: 24,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    cursor: "pointer",
  };

  const fabAction = {
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    fontSize: 14,
    cursor: "pointer"
  };

  // =========================
  // 🚀 UI
  // =========================
  return (
    <div style={{ fontFamily: "Arial", paddingBottom: 80 }}>

      {/* 🍎 GLASS HEADER */}
      <div style={glassHeader}>
        🐾 PawSignal
      </div>

      {/* 🧠 STATUS BAR */}
      <div style={{
        margin: 10,
        padding: 12,
        borderRadius: 12,
        textAlign: "center",
        fontWeight: 600,
        background:
          uiMode === "calm" ? "#e8f5e9" :
          uiMode === "watch" ? "#fff8e1" :
          "#ffebee",
      }}>
        {uiMode === "calm" && "😌 All clear in your area"}
        {uiMode === "watch" && "👀 Stay alert — pets nearby"}
        {uiMode === "alert" && "🚨 High activity zone detected"}
      </div>

      {/* 🗺️ MAP */}
      <div style={{
        filter:
          uiMode === "calm" ? "brightness(1)" :
          uiMode === "watch" ? "brightness(0.95)" :
          "brightness(0.9) saturate(1.2)",
        transition: "0.3s ease"
      }}>
        <Map pets={pets} />
      </div>

      {/* 📡 FEED */}
      <PetFeed pets={pets} />

      {/* 🚀 FLOATING ACTION SYSTEM */}
      <div style={{ position: "fixed", bottom: 25, right: 20, zIndex: 9999 }}>

        {fabOpen && (
          <div style={{
            marginBottom: 10,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "flex-end"
          }}>
            <button style={fabAction}>
              📍 Center Map
            </button>

            <button
              style={fabAction}
              onClick={() => {
                setSheetOpen(true);
                setFabOpen(false);
              }}
            >
              🐾 Report Pet
            </button>

            <button style={fabAction}>
              🔔 Alerts
            </button>
          </div>
        )}

        <button
          onClick={() => setFabOpen(!fabOpen)}
          style={fabMain}
        >
          {fabOpen ? "✕" : "+"}
        </button>
      </div>

      {/* 📱 BOTTOM SHEET */}
      {sheetOpen && (
        <div
          onClick={() => setSheetOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(4px)",
            zIndex: 10000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(18px)",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              padding: 16,
              boxShadow: "0 -10px 30px rgba(0,0,0,0.2)",
              animation: "slideUp 0.25s ease",
            }}
          >
            <div style={{
              width: 40,
              height: 5,
              background: "#ddd",
              borderRadius: 10,
              margin: "0 auto 10px auto",
            }} />

            <h3 style={{ marginBottom: 10 }}>
              🐾 Report Lost Pet
            </h3>

            <UploadForm />

            <button
              onClick={() => setSheetOpen(false)}
              style={{
                marginTop: 10,
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "none",
                background: "#eee",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
