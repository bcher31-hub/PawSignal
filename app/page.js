"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Map from "@/components/Map";
import UploadForm from "@/components/UploadForm";
import { Home, Plus, Search, Heart } from "lucide-react";

export default function Page() {
  const [pets, setPets] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      const { data } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

      setPets(data || []);
    };

    fetchPets();
  }, []);

  return (
    <div style={styles.app}>

      {/* MAP LAYER */}
      <div style={styles.map}>
        <Map pets={pets} activePet={active} />
      </div>

      {/* TOP BAR */}
      <div style={styles.topBar}>
        🐾 PawSignal
      </div>

      {/* SNAP FEED */}
      <div style={styles.feed}>
        {pets.map((p) => (
          <div
            key={p.id}
            style={{
              ...styles.card,
              border: active?.id === p.id
                ? "2px solid #4ade80"
                : "1px solid rgba(255,255,255,0.08)",
            }}
            onClick={() => setActive(p)}
          >
            {p.image_url ? (
              <img src={p.image_url} style={styles.img} />
            ) : (
              <div style={styles.noImg}>No Image</div>
            )}

            <div style={styles.info}>
              <div style={styles.name}>{p.name || "Unknown"}</div>
              <div style={styles.meta}>Tap to locate</div>
            </div>
          </div>
        ))}
      </div>

      {/* FLOAT ACTION BUTTON */}
      <button style={styles.fab} onClick={() => setOpen(true)}>
        <Plus size={26} />
      </button>

      {/* BOTTOM NAV */}
      <div style={styles.nav}>
        <button style={styles.navActive}>
          <Home size={18} />
          <span>Home</span>
        </button>

        <button style={styles.navItem}>
          <Search size={18} />
          <span>Search</span>
        </button>

        <button style={styles.navItem}>
          <Heart size={18} />
          <span>Saved</span>
        </button>
      </div>

      {/* BOTTOM SHEET */}
      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
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
    width: "100vw",
    overflow: "hidden",
    background: "#0b0f14",
  },

  map: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },

  topBar: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    zIndex: 10,
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(14px)",
    color: "white",
    textAlign: "center",
    padding: "10px",
    borderRadius: 14,
    fontWeight: 600,
  },

  feed: {
    position: "absolute",
    bottom: 110,
    left: 0,
    right: 0,
    display: "flex",
    gap: 12,
    padding: "0 14px",
    overflowX: "auto",
    zIndex: 10,
  },

  card: {
    minWidth: 170,
    borderRadius: 16,
    overflow: "hidden",
    background: "rgba(255,255,255,0.95)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },

  img: {
    width: "100%",
    height: 120,
    objectFit: "cover",
  },

  noImg: {
    height: 120,
    background: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    padding: 10,
  },

  name: {
    fontSize: 13,
    fontWeight: 600,
  },

  meta: {
    fontSize: 11,
    opacity: 0.7,
  },

  fab: {
    position: "absolute",
    bottom: 110,
    right: 18,
    width: 62,
    height: 62,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg,#ff6b6b,#ff2d2d)",
    color: "white",
    zIndex: 10,
    boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
  },

  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 10,
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  navItem: {
    background: "transparent",
    border: "none",
    color: "#888",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 11,
  },

  navActive: {
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
    zIndex: 100,
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#0f172a",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
    animation: "slideUp 0.25s ease",
  },

  handle: {
    width: 44,
    height: 5,
    background: "#555",
    borderRadius: 10,
    margin: "0 auto 10px",
  },
};
