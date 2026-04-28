import { Home, Plus, Search, Heart } from "lucide-react";

export default function BottomNav({ tab, setTab, setOpen }) {
  return (
    <div style={styles.nav}>
      <button onClick={() => setTab("home")} style={tab === "home" ? styles.active : styles.item}>
        <Home size={20} />
        Home
      </button>

      <button onClick={() => setOpen(true)} style={styles.item}>
        <Plus size={20} />
        Report
      </button>

      <button onClick={() => setTab("search")} style={tab === "search" ? styles.active : styles.item}>
        <Search size={20} />
        Search
      </button>

      <button onClick={() => setTab("fav")} style={tab === "fav" ? styles.active : styles.item}>
        <Heart size={20} />
        Favorites
      </button>
    </div>
  );
}

const styles = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    background: "rgba(10,12,16,0.95)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },

  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
    opacity: 0.6,
    color: "white",
    background: "none",
    border: "none",
  },

  active: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
    color: "#4ade80",
    background: "none",
    border: "none",
  },
};
