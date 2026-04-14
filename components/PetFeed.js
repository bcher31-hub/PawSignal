"use client";

export default function PetFeed({ pets }) {
  if (!pets || pets.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
        <h2>Recently Reported Pets</h2>
        <p>No pets reported yet 🐾</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "15px" }}>Recently Reported Pets</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "15px",
        }}
      >
        {pets.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: "12px",
              padding: "12px",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              transition: "0.2s",
            }}
          >
            {/* IMAGE */}
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <div
                style={{
                  height: "160px",
                  background: "#f3f3f3",
                  borderRadius: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                }}
              >
                No Image
              </div>
            )}

            {/* CONTENT */}
            <h3 style={{ margin: "5px 0" }}>
              {p.name || "Unknown"}
            </h3>

            <p style={{ margin: "5px 0", color: "#555" }}>
              🐕 {p.type || "Unknown"}
            </p>

            <p
              style={{
                fontSize: "14px",
                color: "#666",
                minHeight: "40px",
              }}
            >
              {p.description || "No description provided"}
            </p>

            {/* OPTIONAL METADATA */}
            {p.created_at && (
              <p style={{ fontSize: "12px", color: "#999" }}>
                {new Date(p.created_at).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
