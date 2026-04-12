export default function PetFeed({ pets }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Recently Reported Pets</h2>

      {pets.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ddd", margin: 10, padding: 10 }}>
          <h3>{p.name}</h3>
          <p>{p.type}</p>
          <p>{p.description}</p>

          {p.image_url && (
            <img
              src={p.image_url}
              style={{ width: 200, borderRadius: 10 }}
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
        </div>
      ))}
    </div>
  );
}
