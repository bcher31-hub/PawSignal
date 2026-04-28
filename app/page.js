"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserLocation } from "@/lib/geo";

import TopBar from "@/components/TopBar";
import WelcomeCard from "@/components/WelcomeCard";
import ActionButtons from "@/components/ActionButtons";
import PetGrid from "@/components/PetGrid";
import BottomNav from "@/components/BottomNav";
import UploadSheet from "@/components/UploadSheet";

export default function Page() {
  const [pets, setPets] = useState([]);
  const [tab, setTab] = useState("home");
  const [open, setOpen] = useState(false);
  const [activePet, setActivePet] = useState(null);
  const [location, setLocation] = useState(null);

  // =========================
  // INIT (DATA + LOCATION)
  // =========================
  useEffect(() => {
    const init = async () => {
      // 📍 Get user location
      try {
        const loc = await getUserLocation();
        setLocation(loc);
        console.log("User location:", loc);
      } catch (err) {
        console.log("Location error:", err);
      }

      // 🐾 Load pets
      const { data } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

      setPets(data || []);
    };

    init();
  }, []);

  // =========================
  // TAB LOGIC (REAL UX)
  // =========================
  let filteredPets = pets;

  if (tab === "fav") {
    // (placeholder favorites logic)
    filteredPets = pets.filter((p) => p.is_favorite);
  }

  if (tab === "search") {
    // (future search filter)
    filteredPets = pets;
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div style={styles.app}>

      {/* HEADER */}
      <TopBar />

      {/* WELCOME */}
      <WelcomeCard location={location} />

      {/* ACTION BUTTONS */}
      <ActionButtons onOpen={() => setOpen(true)} />

      {/* SECTION TITLE */}
      <div style={styles.sectionTitle}>
        Nearby Lost Pets
      </div>

      {/* PET GRID */}
      <PetGrid
        pets={filteredPets}
        activePet={activePet}
        setActivePet={setActivePet}
        userLocation={location}
      />

      {/* BOTTOM NAV */}
      <BottomNav
        tab={tab}
        setTab={setTab}
        setOpen={setOpen}
      />

      {/* UPLOAD SHEET */}
      {open && (
        <UploadSheet onClose={() => setOpen(false)} />
      )}

    </div>
  );
}

// =========================
// STYLES (LOCKED SYSTEM)
// =========================
const styles = {
  app: {
    height: "100vh",
    width: "100vw",
    background: "#0b0f14",
    color: "white",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    opacity: 0.9,
    marginTop: 4,
  },
};
