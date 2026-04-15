"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import UploadForm from "@/components/UploadForm";
import { Home, Plus, Search, Heart } from "lucide-react";

export default function Page() {
  const [pets, setPets] = useState([]);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("home");
  const [activePet, setActivePet] = useState(null);

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

      {/* HEADER */}
      <div style={styles.header}>🐾 PAWSIGNAL</div>

      {/* WELCOME */}
      <div style={styles.welcome}>
        <div>
          <div style={styles.welcomeTitle}>Welcome back</div>
          <div style={styles.welcomeSub}>
            Tap a pet to focus on map
          </div>
        </div>

        <div style={styles.avatar}>🐶</div>
      </div>

      {/* ACTIONS */}
      <div style={styles.actions}>
        <button style={styles.primaryBtn} onClick={() => setOpen(true)}>
          Report Lost Pet
        </button>

        <button style={styles.secondaryBtn}>
          Found Nearby
        </button>
      </div>

      {/* SECTION */}
      <div style={styles.title}>Nearby Lost Pets</div>

      {/* GRID */}
      <div style={styles.grid}>
        {pets.map((p, i) => {
          const isActive = activePet?.id === p.id;

          return (
            <div
              key={p.id}
              onClick={() => setActivePet(p)}
              style={{
                ...styles.card,
                transform: isActive ? "scale(1.03)" : "scale(1)",
                boxShadow: isActive
                  ? "0 0 0 2px #4ade80, 0 12px 30px rgba(0,0,0,0.5)"
                  : "0 6px 20px rgba(0,0,0,0.3)",
                border: isActive
                  ? "1px solid #4ade80"
                  : "1px solid rgba(255,255,255,0.06)",
                animation: `popIn 0.25s ease ${i * 0.04}s both`,
              }}
            >
              <div style={styles.imgWrap}>
                <img
                  src={p.image_url || "https://via.placeholder.com/300"}
                  style={{
                    ...styles.img,
                    filter: isActive
                      ? "brightness(1.05) saturate(1.2)"
                      : "none",
                  }}
                />

                <div style={styles.badge}>
                  📍 {Math.floor(Math.random() * 3 + 1)} mi
                </div>
              </div>

              <div style={styles.cardBody}>
                <div style={styles.name}>{p.name || "Unknown Pet"}</div>
                <div style={styles.meta}>
                  {isActive ? "Focused on map" : "Tap to focus"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FLOAT BUTTON */}
      <button style={styles.fab} onClick={() => setOpen(true)}>
        <Plus size={20} />
      </button>

      {/* BOTTOM NAV (REAL UX STATE) */}
      <div style={styles.nav}>
        <button
          onClick={() => setTab("home")}
          style={tab === "home" ? styles.navActive : styles.navItem}
        >
          <Home size={18} />
          Home
        </button>

        <button
          onClick={() => setTab("report")}
          style={tab === "report" ? styles.navActive : styles.navItem}
        >
          <Plus size={18} />
          Report
        </button>

        <button
          onClick={() => setTab("search")}
          style={tab === "search" ? styles.navActive : styles.navItem}
        >
          <Search size={18} />
          Search
        </button>

        <button
          onClick={() => setTab("fav")}
          style={tab === "fav" ? styles.navActive : styles.navItem}
        >
          <Heart size={18} />
          Favorites
        </button>
      </div>

      {/* MODAL */}
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
    height: "100vh",
    width: "100vw",
    background: "#0b0f14",
    color: "white",
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  header: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: 700,
  },

  welcome: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    background: "rgba(255,255,255,0.05)",
  },

  welcomeTitle: {
    fontSize: 14,
    fontWeight: 600,
  },

  welcomeSub: {
    fontSize: 11,
    opacity: 0.6,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  actions: {
    display: "flex",
    gap: 8,
  },

  primaryBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    background: "#ff4d4d",
    border: "none",
    fontSize: 12,
    fontWeight: 600,
    color: "white",
  },

  secondaryBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    fontSize: 12,
    color: "white",
  },

  title: {
    fontSize: 13,
    fontWeight: 600,
    opacity: 0.9,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
    overflowY: "auto",
    paddingBottom: 80,
  },

  card: {
    borderRadius: 14,
    overflow: "hidden",
    background: "rgba(255,255,255,0.05)",
    transition: "all 0.2s ease",
  },

  imgWrap: {
    position: "relative",
  },

  img: {
    width: "100%",
    height: 100,
    objectFit: "cover",
  },

  badge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    fontSize: 10,
    padding: "3px 6px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.6)",
  },

  cardBody: {
    padding: 8,
  },

  name: {
    fontSize: 12,
    fontWeight: 600,
  },

  meta: {
    fontSize: 10,
    opacity: 0.6,
  },

  fab: {
    position: "fixed",
    bottom: 85,
    right: 14,
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#ff4d4d,#ff1f1f)",
    border: "none",
    color: "white",
    boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
  },

  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    background: "#0b0f14",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
    opacity: 0.6,
    background: "transparent",
    border: "none",
    color: "white",
  },

  navActive: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
    color: "#4ade80",
    background: "transparent",
    border: "none",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#0f172a",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 14,
  },

  handle: {
    width: 40,
    height: 4,
    background: "#555",
    borderRadius: 10,
    margin: "0 auto 10px",
  },
};
