import PetCard from "./PetCard";

export default function PetGrid({ pets, activePet, setActivePet }) {
  return (
    <div style={styles.grid}>
      {pets.map((p, i) => (
        <PetCard
          key={p.id}
          pet={p}
          active={activePet?.id === p.id}
          onClick={() => setActivePet(p)}
          index={i}
        />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 8, // tighter than before
    overflowY: "auto",
    paddingBottom: 90,
  },
};
