"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Map from "@/components/Map";
import PetFeed from "@/components/PetFeed";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // =========================
  // 🔥 STEP 1 — SERVICE WORKER
  // =========================
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.log("SW registration failed:", err);
      });
    }
  }, []);

  // =========================
  // 🔐 STEP 2 — NOTIFICATION PERMISSION
  // =========================
  useEffect(() => {
    const requestPermission = async () => {
      if (!("Notification" in window)) return;

      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
    };

    requestPermission();
  }, []);

  // =========================
  // 🔥 STEP 3 — SINGLE SOURCE OF TRUTH (FIXED)
  // =========================
  useEffect(() => {
    const loadPets = async () => {
      const { data, error } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setPets(data || []);
    };

    loadPets();

    const channel = supabase
      .channel("lost_pets_realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT + future-proof
          schema: "public",
          table: "lost_pets",
        },
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

  return (
    <div style={{ position: "relative", fontFamily: "Arial" }}>

      {/* HEADER */}
      <h2 style={{ textAlign: "center", margin: 10 }}>
        🐾 PawSignal
      </h2>

      <p style={{ textAlign: "center", color: "#666" }}>
        Real-time lost pet recovery network
      </p>

      {/* MAP */}
      <Map pets={pets} />

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#ff6b6b",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontSize: 28,
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        +
      </button>

      {/* MODAL */}
      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              maxWidth: 420,
            }}
          >
            <UploadForm />
          </div>
        </div>
      )}

      {/* FEED */}
      <PetFeed pets={pets} />

    </div>
  );
}
