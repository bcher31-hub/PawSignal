"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Map from "@/components/Map";
import PetFeed from "@/components/PetFeed";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  const [pets, setPets] = useState([]);

  // 🧠 UI STATES
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

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

      {/* MAP (NOW CONTROLLED) */}
      <Map
        pets={pets}
        setSelectedPet={setSelectedPet}
      />

      {/* FEED (NOW CLICKABLE) */}
      <PetFeed
        pets={pets}
        setSelectedPet={setSelectedPet}
      />

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => setSheetOpen(true)}
        style={styles.fab}
      >
        +
      </button>

      {/* REPORT SHEET */}
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

      {/* 🧠 PET INTELLIGENCE SHEET (NEW) */}
      {selectedPet && (
        <div
          style={styles.overlay}
          onClick={() => setSelectedPet(null)}
        >
          <div
            style={styles.petSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.handle} />

            {selectedPet.image_url && (
              <img
                src={selectedPet.image_url}
                style={styles.petImage}
              />
            )}

            <h2>🐾 {selectedPet.name}</h2>
            <p style={{ color: "#94a3b8" }}>{selectedPet.type}</p>

            <p style={{ marginTop: 10, color: "#cbd5e1" }}>
              {selectedPet.description}
            </p>

            <div style={styles.actions}>
              <button style={styles.actionBtn}>📍 Navigate</button>
              <button style={styles.actionBtn}>📞 Contact</button>
              <button style={styles.actionBtn}>⚠️ Report</button>
            </div>

            <button
              onClick={() => setSelectedPet(null)}
              style={styles.closeBtn}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
