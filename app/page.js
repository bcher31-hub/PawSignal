"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import UploadForm from "@/components/UploadForm";
import { Home, Plus, Search, Heart } from "lucide-react";

export default function Page() {
  const [pets, setPets] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

      setPets(data || []);
      setLoading(false);
    };

    fetchPets();
  }, []);

  return (
    <div style={styles.app}>

      {/* HEADER */}
      <div style={styles.header}>
        PawSignal
      </div>

      {/* WELCOME */}
      <div style={styles.welcomeCard}>
        <div>
          <div style={styles.welcomeTitle}>Welcome back 👋</div>
          <div style={styles.welcomeSub}>
            Helping reunite lost pets every day
          </div>
        </div>

        <div style={styles.avatar}>🐶</div>
      </div>

      {/* ACTION ROW */}
      <div style={styles.actions}>
        <button style={styles.lostBtn} onClick={() => setOpen(true)}>
          Report Lost Pet
        </button>

        <button style={styles.foundBtn}>
          Found Nearby
        </button>
      </div>

      {/* SECTION TITLE */}
      <div style={styles.sectionTitle}>
        Nearby Lost Pets
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={styles.skeletonCard} />
            ))
          : pets.map((p, i) => (
              <div
                key={p.id}
                style={{
                  ...styles.card,
                  animation: `fadeUp 0.25s ease ${i * 0.05}s both`,
                }}
              >
                <div style={styles.imageWrap}>
                  <img
                    src={p.image_url || "https://via.placeholder.com/300"}
                    style={styles.image}
                  />

                  <div style={styles.badge}>
                    📍 {Math.floor(Math.random() * 3 + 1)} mi
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.petName}>
                    {p.name || "Unknown Pet"}
                  </div>

                  <div style={styles.petMeta}>
                    Recently reported nearby
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* FLOAT BUTTON */}
      <button
        style={styles.fab}
        onClick={() => setOpen(true)}
      >
        <Plus size={20} />
      </button>

      {/* BOTTOM NAV */}
      <div style={styles.nav}>
        <button style={styles.navItemActive}><Home size={18} />Home</button>
        <button style={styles.navItem}><Plus size={18} />Report</button>
        <button style={styles.navItem}><Search size={18} />Search</button>
        <button style={styles.navItem}><Heart size={18} />Saved</button>
      </div>

      {/* SHEET */}
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

  /* BASE */
  app: {
    height: "100vh",
    width: "100vw",
    background: "#0b0f14",
    color: "#fff",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },

  /* HEADER */
  header: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.3,
    textAlign: "center",
    paddingTop: 4,
  },

  /* WELCOME */
  welcomeCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  welcomeTitle: {
    fontSize: 15,
    fontWeight: 600,
  },

  welcomeSub: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
  },

  /* ACTIONS */
  actions: {
    display: "flex",
    gap: 10,
  },

  lostBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    background: "#ff4d4d",
    border: "none",
    color: "white",
    fontWeight: 600,
    transition: "transform 0.15s ease",
  },

  foundBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    fontWeight: 500,
  },

  /* TITLE */
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    opacity: 0.9,
    marginTop: 4,
  },

  /* GRID */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    overflowY: "auto",
    paddingBottom: 90,
  },

  /* CARD */
  card: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.06)",
    transform: "translateY(0)",
    transition: "all 0.2s ease",
  },

  imageWrap: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 120,
    objectFit: "cover",
    filter: "contrast(1.05) saturate(1.05)",
  },

  badge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    fontSize: 10,
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(10px)",
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
    opacity: 0.55,
    marginTop: 3,
  },

  /* SKELETON */
  skeletonCard: {
    height: 180,
    borderRadius: 16,
    background: "rgba(255,255,255,0.04)",
    animation: "pulse 1.2s infinite",
  },

  /* FLOAT */
  fab: {
    position: "fixed",
    bottom: 88,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#ff5a5a,#ff2e2e)",
    border: "none",
    color: "white",
    boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
  },

  /* NAV */
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    background: "rgba(10,12,16,0.95)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backdropFilter: "blur(14px)",
  },

  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
    gap: 4,
    opacity: 0.6,
    background: "transparent",
    border: "none",
    color: "white",
  },

  navItemActive: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
    gap: 4,
    color: "#4ade80",
    background: "transparent",
    border: "none",
  },

  /* SHEET */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
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
  },

  handle: {
    width: 40,
    height: 4,
    background: "#555",
    borderRadius: 10,
    margin: "0 auto 10px",
  },
};

/* ANIMATIONS */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes pulse {
      0% { opacity: 0.4; }
      50% { opacity: 0.7; }
      100% { opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);
}
