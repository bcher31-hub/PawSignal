"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import UploadForm from "@/components/UploadForm";
import { Home, Plus, Search, Heart } from "lucide-react";

export default function Page() {
  const [pets, setPets] = useState([]);
  const [open, setOpen] = useState(false);

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

      {/* ================= HEADER ================= */}
      <div style={styles.header}>
        PawSignal
      </div>

      {/* ================= WELCOME ================= */}
      <div style={styles.welcomeCard}>
        <div>
          <div style={styles.welcomeTitle}>Welcome back 👋</div>
          <div style={styles.welcomeSub}>
            Help reunite lost pets with their families
          </div>
        </div>

        <div style={styles.avatar}>
          🐶
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div style={styles.actions}>
        <button style={styles.lostBtn} onClick={() => setOpen(true)}>
          Report Lost Pet
        </button>

        <button style={styles.foundBtn}>
          Found Nearby
        </button>
      </div>

      {/* ================= SECTION TITLE ================= */}
      <div style={styles.sectionTitle}>
        Nearby Lost Pets
      </div>

      {/* ================= GRID ================= */}
      <div style={styles.grid}>
        {pets.map((p) => (
          <div key={p.id} style={styles.card}>
            <div style={styles.imageWrap}>
              <img
                src={p.image_url || "https://via.placeholder.com/300"}
                style={styles.image}
              />

              <div style={styles.distanceBadge}>
                📍 1.2 mi
              </div>
            </div>

            <div style={styles.cardBody}>
              <div style={styles.petName}>
                {p.name || "Unknown Pet"}
              </div>

              <div style={styles.petMeta}>
                Last seen near your area
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= FLOAT BUTTON ================= */}
      <button style={styles.fab} onClick={() => setOpen(true)}>
        <Plus size={22} />
      </button>

      {/* ================= BOTTOM NAV ================= */}
      <div style={styles.nav}>
        <button style={styles.navItemActive}>
          <Home size={18} />
          Home
        </button>

        <button style={styles.navItem}>
          <Plus size={18} />
          Report
        </button>

        <button style={styles.navItem}>
          <Search size={18} />
          Search
        </button>

        <button style={styles.navItem}>
          <Heart size={18} />
          Saved
        </button>
      </div>

      {/* ================= MODAL ================= */}
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

  /* ================= BASE ================= */
  app: {
    height: "100vh",
    width: "100vw",
    background: "#0b0f14",
    color: "#fff",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    overflow: "hidden",
  },

  /* ================= HEADER ================= */
  header: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: "center",
    letterSpacing: 0.5,
  },

  /* ================= WELCOME ================= */
  welcomeCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.06)",
    padding: 14,
    borderRadius: 16,
  },

  welcomeTitle: {
    fontSize: 15,
    fontWeight: 600,
  },

  welcomeSub: {
    fontSize: 12,
    opacity: 0.65,
    marginTop: 4,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
  },

  /* ================= ACTIONS ================= */
  actions: {
    display: "flex",
    gap: 10,
  },

  lostBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    border: "none",
    background: "#ff4d4d",
    color: "white",
    fontWeight: 600,
  },

  foundBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "white",
    fontWeight: 500,
  },

  /* ================= SECTION TITLE ================= */
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    marginTop: 2,
    opacity: 0.9,
  },

  /* ================= GRID ================= */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    overflowY: "auto",
    paddingBottom: 90,
  },

  /* ================= CARD ================= */
  card: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    overflow: "hidden",
  },

  imageWrap: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 120,
    objectFit: "cover",
  },

  distanceBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    fontSize: 10,
    padding: "4px 8px",
    borderRadius: 12,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
  },

  cardBody: {
    padding: 10,
  },

  petName: {
    fontSize: 13,
    fontWeight: 600,
  },

  petMeta: {
    fontSize: 11,
    opacity: 0.6,
    marginTop: 4,
  },

  /* ================= FLOAT ACTION ================= */
  fab: {
    position: "fixed",
    bottom: 90,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg,#ff5a5a,#ff2e2e)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },

  /* ================= NAV ================= */
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    background: "#0b0f14",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    fontSize: 10,
    opacity: 0.6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    background: "transparent",
    border: "none",
    color: "white",
  },

  navItemActive: {
    fontSize: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    color: "#4ade80",
    background: "transparent",
    border: "none",
  },

  /* ================= SHEET ================= */
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },

  handle: {
    width: 40,
    height: 4,
    background: "#555",
    borderRadius: 10,
    margin: "0 auto 10px",
  },
};
