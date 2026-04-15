"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Map from "@/components/Map";
import PetFeed from "@/components/PetFeed";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
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
  // 🔥 SUPABASE REALTIME
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
      .channel("lost_pets")
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
  // 🧠 LISTEN FOR MAP EVENTS
  // =========================
  useEffect(() => {
    const handler = (e) => setSelectedPet(e.detail);
    window.addEventListener("open-pet", handler);
    return () => window.removeEventListener("open-pet", handler);
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: 10 }}>

      {/* HEADER */}
      <div style={{
        padding: 12,
        borderRadius: 14,
        textAlign: "center",
        fontWeight: "bold",
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.7)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)"
      }}>
        🐾 PawSignal
      </div>

      {/* MAP */}
      <Map pets={pets} />

      {/* FLOATING ACTION BUTTON */}
      <div style={{ position: "fixed", bottom: 25, right: 20, zIndex: 9999 }}>
        {fabOpen && (
          <div style={{
            marginBottom: 10,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "flex-end"
          }}>
            <button style={fabAction}>📍 Center</button>
            <button style={fabAction} onClick={() => setSheetOpen(true)}>🐾 Report</button>
            <button style={fabAction}>🔔 Alerts</button>
          </div>
        )}

        <button onClick={() => setFabOpen(!fabOpen)} style={fabMain}>
          {fabOpen ? "✕" : "+"}
        </button>
      </div>

      {/* BOTTOM SHEET */}
      {sheetOpen && (
        <div
          onClick={() => setSheetOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
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
              backdropFilter: "blur(16px)",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 16,
            }}
          >
            <div style={{
              width: 40,
              height: 5,
              background: "#ccc",
              borderRadius: 10,
              margin: "0 auto 10px",
            }} />
            <UploadForm />
          </div>
        </div>
      )}

      {/* 🧠 PET CARD */}
      {selectedPet && (
        <div
          onClick={() => setSelectedPet(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
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
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(16px)",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 16,
              animation: "slideUp 0.25s ease",
            }}
          >
            <div style={{
              width: 40,
              height: 5,
              background: "#ccc",
              borderRadius: 10,
              margin: "0 auto 12px",
            }} />

            {selectedPet.image_url && (
              <img
                src={selectedPet.image_url}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
            )}

            <h2>{selectedPet.name}</h2>
            <p>🐾 {selectedPet.type}</p>
            <p>{selectedPet.description}</p>

            <div style={{ display: "flex", gap: 10 }}>
              <button style={actionPrimary}>📞 Contact</button>
              <button style={actionSecondary}>📍 Navigate</button>
            </div>
          </div>
        </div>
      )}

      <PetFeed pets={pets} />
    </div>
  );
}

const fabMain = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  border: "none",
  background: "#ff6b6b",
  color: "white",
  fontSize: 26,
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
};

const fabAction = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "none",
  background: "white",
};

const actionPrimary = {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  border: "none",
  background: "#ff6b6b",
  color: "white",
};

const actionSecondary = {
  flex: 1,
  padding: 12,
  borderRadius: 12,
  border: "none",
  background: "#eee",
};
