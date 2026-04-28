export default function PetCard({ pet, active, onClick, index }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        transform: active ? "scale(1.03)" : "scale(1)",
        boxShadow: active
          ? "0 0 0 2px #4ade80, 0 12px 35px rgba(0,0,0,0.6)"
          : "0 8px 25px rgba(0,0,0,0.5)",
        animation: `fadeUp 0.25s ease ${index * 0.04}s both`,
      }}
    >
      {/* IMAGE */}
      <img
        src={pet.image_url || "https://via.placeholder.com/300"}
        style={styles.img}
      />

      {/* GRADIENT OVERLAY */}
      <div style={styles.overlay} />

      {/* TEXT OVER IMAGE */}
      <div style={styles.info}>
        <div style={styles.name}>{pet.name || "Unknown"}</div>
        <div style={styles.distance}>1.2 miles away</div>
        <div style={styles.time}>● Just now</div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "contrast(1.1) saturate(1.1)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.1))",
  },

  info: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: 700,
  },

  distance: {
    fontSize: 11,
    opacity: 0.9,
  },

  time: {
    fontSize: 10,
    color: "#4ade80",
    marginTop: 2,
  },
};
