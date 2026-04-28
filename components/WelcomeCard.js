export default function WelcomeCard() {
  return (
    <div style={styles.card}>
      <div>
        <div style={styles.title}>Welcome back</div>
        <div style={styles.sub}>Find lost pets near you</div>
      </div>

      <div style={styles.avatar}>🐶</div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  title: {
    fontSize: 15,
    fontWeight: 700,
  },

  sub: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },

  avatar: {
    fontSize: 28,
  },
};
