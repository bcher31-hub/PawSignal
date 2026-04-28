"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserLocation, getDistance } from "@/lib/geo";

import ActionButtons from "@/components/ActionButtons";
import PetGrid from "@/components/PetGrid";
import UploadSheet from "@/components/UploadSheet";

export default function Page() {
  const [pets, setPets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const init = async () => {
      const loc = await getUserLocation().catch(() => null);
      setLocation(loc);

      const { data } = await supabase.from("lost_pets").select("*");

      const enriched = (data || []).map((p) => {
        if (loc && p.lat && p.lng) {
          return {
            ...p,
            distance: getDistance(loc.lat, loc.lng, p.lat, p.lng),
          };
        }
        return p;
      });

      setPets(enriched);
      setFiltered(enriched);
    };

    init();
  }, []);

  useEffect(() => {
    let list = pets;

    if (search) {
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(list);
  }, [search, pets]);

  const handleNearby = () => {
    if (!location) return alert("Enable location");
    setFiltered(pets.filter((p) => p.distance && p.distance < 5));
  };

  return (
    <div style={styles.app}>
      <h2 style={styles.header}>PawSignal</h2>

      <div style={styles.welcome}>
        <div>
          <div style={{ fontWeight: 600 }}>Welcome back</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Find lost pets near you
          </div>
        </div>
        🐶
      </div>

      <ActionButtons onOpen={() => setOpen(true)} onNearby={handleNearby} />

      <input
        placeholder="Search pets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      <div style={styles.section}>Nearby Lost Pets</div>

      <PetGrid pets={filtered} onSelect={setSelectedPet} />

      {open && <UploadSheet onClose={() => setOpen(false)} />}

      {selectedPet && (
        <div style={styles.overlay} onClick={() => setSelectedPet(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <img src={selectedPet.image_url} style={styles.modalImg} />
            <h2>{selectedPet.name}</h2>
            <p>{selectedPet.description || "No description"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: {
    padding: 14,
    background: "#0b0f14",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  header: {
    textAlign: "center",
    fontWeight: 700,
  },

  welcome: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
  },

  search: {
    padding: 10,
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
  },

  section: {
    fontSize: 13,
    fontWeight: 600,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(8px)",
  },

  modal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#111827",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    animation: "slideUpPremium 0.28s ease",
  },

  modalImg: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 10,
  },
};
