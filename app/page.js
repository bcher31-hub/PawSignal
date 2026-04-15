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
