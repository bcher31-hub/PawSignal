"use client";

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

function getScoreColor(score) {
  if (score >= 75) return "#2ecc71";
  if (score >= 45) return "#f39c12";
  return "#e74c3c";
}

export default function PetFeed({ pets = [], setSelectedPet }) {
  if (!pets.length) {
    return (
      <div style={{ padding: 20, textAlign: "center", opacity: 0.6 }}>
        <h3>🐾 No pets reported yet</h3>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ padding: "10px 12px", opacity: 0.8 }}>
        Recently Reported
      </h3>

      {/* GRID */}
      <div className="feed-grid">
        {pets.map((p) => {
          const score = calculateRecoveryScore(p);
          const color = getScoreColor(score);

          return (
            <div
              key={p.id}
              className="card float"
              onClick={() => setSelectedPet?.(p)}
              style={{ cursor: "pointer" }}
            >
              {/* IMAGE (FIXED CROP) */}
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  loading="lazy"
                />
              ) : (
                <div
                  style={{
                    height: 110,
                    borderRadius: 12,
                    background: "#1f2937",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    opacity: 0.6,
                    marginBottom: 8,
                  }}
                >
                  No Image
                </div>
              )}

              {/* NAME */}
              <h3>🐾 {p.name || "Unknown"}</h3>

              {/* TYPE */}
              <p>🐕 {p.type || "Unknown"}</p>

              {/* SCORE */}
              <div
                style={{
                  marginTop: 8,
                  padding: "6px",
                  borderRadius: 10,
                  border: `1px solid ${color}`,
                  fontSize: 11,
                  color,
                  textAlign: "center",
                }}
              >
                Recovery: {score}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
