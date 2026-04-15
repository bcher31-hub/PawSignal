"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Map from "@/components/Map";
import PetFeed from "@/components/PetFeed";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  // =========================
  // SERVICE WORKER
  // =========================
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // =========================
  // NOTIFICATIONS
  // =========================
  useEffect(() => {
    if (!("Notification" in window)) return;
    Notification.requestPermission();
  }, []);

  // =========================
  // SUPABASE SOURCE OF TRUTH
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
      .channel("pets-live")
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

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        🐾 PawSignal
      </div>

      {/* MAP */}
      <Map pets={pets} />

      {/* FEED */}
      <PetFeed pets={pets} />

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => setSheetOpen(true)}
        style={styles.fab}
      >
        +
      </button>

      {/* BOTTOM SHEET */}
      {sheetOpen && (
        <div style={styles.overlay} onClick={() => setSheetOpen(false)}>
          <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.handle} />
            <h3 style={{ marginBottom: 10 }}>Report Lost Pet</h3>
            <UploadForm />
            <button style={styles.closeBtn} onClick={() => setSheetOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: "#0b0f14",
    minHeight: "100vh",
    color: "white",
    padding: 12,
  },

  header: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: 700,
    margin: "10px 0",
    opacity: 0.9,
  },

  fab: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg,#ff6b6b,#ff3b3b)",
    color: "white",
    fontSize: 28,
    boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
    zIndex: 9999,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    zIndex: 9999,
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#111827",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
  },

  handle: {
    width: 40,
    height: 5,
    background: "#444",
    borderRadius: 10,
    margin: "0 auto 10px auto",
  },

  closeBtn: {
    marginTop: 10,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "none",
    background: "#222",
    color: "white",
  },
};
