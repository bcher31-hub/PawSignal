"use client";

// 🧠 Recovery Intelligence Engine
function calculateRecoveryScore(pet) {
  const now = new Date();
  const created = new Date(pet.created_at);

  const hoursAgo = (now - created) / (1000 * 60 * 60);

  let score = 100;

  if (hoursAgo > 1) score -= hoursAgo * 8;
  if (hoursAgo > 6) score -= 20;
  if (hoursAgo > 24) score -= 30;

  return Math.max(5, Math.min(100, Math.round(score)));
}

// 🎨 Score color helper (adds emotional UX layer)
function getScoreColor(score) {
  if (score >= 75) return "#2ecc71"; // green
  if (score >= 45) return "#f39c12"; // orange
  return "#e74c3c"; // red
}

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
        {pets.map((p) => {
          const score = calculateRecoveryScore(p);
          const color = getScoreColor(score);

          return (
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

              {/* NAME */}
              <h3 style={{ margin: "5px 0" }}>
                {p.name || "Unknown"}
              </h3>

              {/* TYPE */}
              <p style={{ margin: "5px 0", color: "#555" }}>
                🐕 {p.type || "Unknown"}
              </p>

              {/* DESCRIPTION */}
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  minHeight: "40px",
                }}
              >
                {p.description || "No description provided"}
              </p>

              {/* 🧠 RECOVERY INTELLIGENCE */}
              <div
                style={{
                  marginTop: 10,
                  padding: "8px",
                  borderRadius: "8px",
                  background: "#f9f9f9",
                  border: `1px solid ${color}`,
                }}
              >
                <p style={{ margin: 0, fontSize: "13px", color }}>
                  🧠 Recovery Chance: {score}%
                </p>
              </div>

              {/* TIMESTAMP */}
              {p.created_at && (
                <p style={{ fontSize: "12px", color: "#999", marginTop: 8 }}>
                  📅 {new Date(p.created_at).toLocaleString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
