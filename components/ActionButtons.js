export default function ActionButtons({ onOpen }) {
  return (
    <div style={styles.row}>
      <button style={styles.primary} onClick={onOpen}>
        Report Lost Pet
      </button>

      <button style={styles.secondary}>
        Found Pet Nearby
      </button>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    gap: 8,
  },

  primary: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    background: "linear-gradient(135deg,#ff4d4d,#ff1f1f)",
    border: "none",
    color: "white",
    fontWeight: 600,
    boxShadow: "0 6px 20px rgba(255,0,0,0.4)",
  },

  secondary: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "white",
  },
};
