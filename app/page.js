"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Map from "@/components/Map";
import UploadForm from "@/components/UploadForm";
import { Home, Plus, Search, Heart } from "lucide-react";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  // =========================
  // DATA
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
  }, []);

  return (
    <div style={styles.app}>

      {/* 🗺 MAP (BASE LAYER) */}
      <Map pets={pets} />

      {/* 🧭 TOP HUD */}
      <div style={styles.topHUD}>
        🐾 PawSignal
      </div>

      {/* 🐾 FLOATING PET CARDS */}
      <div style={styles.cardRail}>
        {pets.map((p) => (
          <div key={p.id} style={styles.card}>
            {p.image_url ? (
              <img src={p.image_url} style={styles.cardImg} />
            ) : (
              <div style={styles.noImg}>No Image</div>
            )}

            <div style={styles.cardInfo}>
              <h4>{p.name}</h4>
              <p>📍 Nearby</p>
            </div>
          </div>
        ))}
      </div>

      {/* ➕ FLOATING ACTION BUTTON */}
      <button style={styles.fab} onClick={() => setSheetOpen(true)}>
        <Plus size={26} />
      </button>

      {/* 📱 BOTTOM NAV */}
      <div style={styles.bottomNav}>
        <button style={styles.navItemActive}>
          <Home size={20} />
          <span>Home</span>
        </button>

        <button style={styles.navItem}>
          <Search size={20} />
          <span>Search</span>
        </button>

        <button style={styles.navItem}>
          <Heart size={20} />
          <span>Saved</span>
        </button>
      </div>

      {/* 📥 BOTTOM SHEET */}
      {sheetOpen && (
        <div style={styles.overlay} onClick={() => setSheetOpen(false)}>
          <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.handle} />
            <UploadForm />
          </div>
        </div>
      )}

    </div>
  );
}
const styles = {
  app: {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
  },

  topHUD: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1000,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
    color: "white",
    padding: 10,
    borderRadius: 12,
    textAlign: "center",
    fontWeight: "600",
  },

  cardRail: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    display: "flex",
    gap: 14,
    overflowX: "auto",
    padding: "0 16px",
    zIndex: 1000,
  },

  card: {
    minWidth: 180,
    background: "white",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  cardImg: {
    width: "100%",
    height: 130,
    objectFit: "cover",
  },

  noImg: {
    height: 130,
    background: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardInfo: {
    padding: 10,
  },

  fab: {
    position: "absolute",
    bottom: 110,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg,#ff6b6b,#ff3b3b)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    zIndex: 1000,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(12px)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1000,
  },

  navItem: {
    background: "transparent",
    border: "none",
    color: "#aaa",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 11,
  },

  navItemActive: {
    background: "transparent",
    border: "none",
    color: "#4ade80",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 11,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    zIndex: 2000,
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#111827",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },

  handle: {
    width: 40,
    height: 5,
    background: "#555",
    borderRadius: 10,
    margin: "0 auto 10px",
  },
};
