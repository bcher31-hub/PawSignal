export default function PetCard({ pet, onSelect }) {
  return (
    <div
      className="card"
      style={{
        ...styles.card,
        animation: "fadeUp 0.3s ease",
      }}
      onClick={() => onSelect(pet)}
    >
      <img src={pet.image_url} style={styles.img} />

      <div style={styles.overlay} />

      <div style={styles.info}>
        <div style={styles.name}>{pet.name}</div>
        <div style={styles.meta}>
          {pet.distance ? `${pet.distance.toFixed(1)} mi away` : "Nearby"}
        </div>
        <div style={styles.live}>● Just now</div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    position: "relative",
    height: 130,
    borderRadius: 14,
    overflow: "hidden",
    cursor: "pointer",
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "contrast(1.15) saturate(1.2)",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1))",
  },

  info: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },

  name: { fontSize: 13, fontWeight: 700 },
  meta: { fontSize: 11, opacity: 0.8 },
  live: { fontSize: 10, color: "#4ade80" },
};
