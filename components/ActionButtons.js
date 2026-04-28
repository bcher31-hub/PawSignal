export default function ActionButtons({ onOpen, onNearby }) {
  return (
    <div style={styles.row}>
      <button style={styles.primary} onClick={onOpen}>
        Report Lost Pet
      </button>

      <button style={styles.secondary} onClick={onNearby}>
        Found Pet Nearby
      </button>
    </div>
  );
}

const styles = {
  row: { display: "flex", gap: 8 },

  primary: {
    flex: 1,
    padding: 11,
    borderRadius: 14,
    background: "linear-gradient(135deg,#ff3b3b,#ff0000)",
    border: "none",
    color: "white",
    fontWeight: 600,
  },

  secondary: {
    flex: 1,
    padding: 11,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
  },
};
