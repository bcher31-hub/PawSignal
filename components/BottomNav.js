"use client";

import { Home, Plus, Search, Heart } from "lucide-react";

export default function BottomNav({ tab, setTab, setOpen }) {
  return (
    <div style={styles.wrapper}>

      {/* HOME */}
      <button
        onClick={() => setTab("home")}
        style={tab === "home" ? styles.active : styles.item}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      {/* SEARCH */}
      <button
        onClick={() => setTab("search")}
        style={tab === "search" ? styles.active : styles.item}
      >
        <Search size={20} />
        <span>Search</span>
      </button>

      {/* FLOAT CENTER ACTION */}
      <button style={styles.fab} onClick={() => setOpen(true)}>
        <Plus size={26} />
      </button>

      {/* FAVORITES */}
      <button
        onClick={() => setTab("fav")}
        style={tab === "fav" ? styles.active : styles.item}
      >
        <Heart size={20} />
        <span>Saved</span>
      </button>

      {/* REPORT (ALT TAB) */}
      <button
        onClick={() => setOpen(true)}
        style={styles.item}
      >
        <Plus size={20} />
        <span>Report</span>
      </button>

    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: 10,
    left: 10,
    right: 10,
    height: 70,
    borderRadius: 20,

    // 🔥 GLASS EFFECT
    background: "rgba(15,18,25,0.75)",
    backdropFilter: "blur(20px)",

    // 🔥 DEPTH (THIS IS THE IMPORTANT PART YOU ASKED ABOUT)
    boxShadow: `
      0 -4px 20px rgba(0,0,0,0.4),
      inset 0 1px 0 rgba(255,255,255,0.05)
    `,

    border: "1px solid rgba(255,255,255,0.06)",

    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 100,
  },

  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
    color: "#aaa",
    background: "transparent",
    border: "none",
    gap: 3,
    transition: "all 0.2s ease",
  },

  active: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
    color: "#4ade80",
    background: "transparent",
    border: "none",
    gap: 3,
    transform: "translateY(-2px)", // 🔥 subtle lift
  },

  fab: {
    position: "absolute",
    top: -22,
    width: 58,
    height: 58,
    borderRadius: "50%",
    border: "none",

    // 🔥 GRADIENT POP
    background: "linear-gradient(135deg,#ff4d4d,#ff1f1f)",
    color: "white",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    // 🔥 FLOATING DEPTH
    boxShadow: "0 10px 30px rgba(255,0,0,0.5)",

    cursor: "pointer",
  },
};
