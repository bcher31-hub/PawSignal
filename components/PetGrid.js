import PetCard from "./PetCard";

export default function PetGrid({ pets, onSelect }) {
  return (
    <div style={styles.grid}>
      {pets.map((p) => (
        <PetCard key={p.id} pet={p} onSelect={onSelect} />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 8,
    overflowY: "auto",
    paddingBottom: 90,
    scrollBehavior: "smooth",
  },
};
