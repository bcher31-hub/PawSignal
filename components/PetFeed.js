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

// 🎨 Emotional scoring system
function getScoreColor(score) {
  if (score >= 75) return "#22c55e"; // green
  if (score >= 45) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

export default function PetFeed({ pets }) {
  if (!pets || pets.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#94a3b8" }}>
        <h2>Recently Reported Pets</h2>
        <p>No pets reported yet 🐾</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {/* HEADER */}
      <h2 style={{ marginBottom: 12, fontSize: 18 }}>
        🧠 Active Pet Reports
      </h2>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        {pets.map((p) => {
          const score = calculateRecoveryScore(p);
          const color = getScoreColor(score);

          return (
            <div
              key={p.id}
              className="card"
              style={{
                background: "rgba(17,24,39,0.85)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: 12,
                boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
                backdropFilter: "blur(14px)",
                transition: "0.2s ease",
                transform: "translateY(0px)",
              }}
            >
              {/* IMAGE */}
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 12,
                    marginBottom: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    height: 150,
                    borderRadius: 12,
                    background: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    marginBottom: 10,
                  }}
                >
                  No Image
                </div>
              )}

              {/* NAME */}
              <h3 style={{ margin: "4px 0", fontSize: 15 }}>
                {p.name || "Unknown Pet"}
              </h3>

              {/* TYPE */}
              <p style={{ fontSize: 13, color: "#94a3b8" }}>
                🐾 {p.type || "Unknown"}
              </p>

              {/* DESCRIPTION */}
              <p
                style={{
                  fontSize: 13,
                  color: "#cbd5e1",
                  marginTop: 6,
                  minHeight: 36,
                }}
              >
                {p.description || "No description provided"}
              </p>

              {/* 🧠 INTELLIGENCE BAR */}
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: `1px solid ${color}`,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <p style={{ margin: 0, fontSize: 13, color: "#fff" }}>
                  🧠 Recovery Chance:{" "}
                  <span style={{ color }}>{score}%</span>
                </p>
              </div>

              {/* TIMESTAMP */}
              {p.created_at && (
                <p style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>
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
