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

function isNew(created_at) {
  const now = new Date();
  const time = new Date(created_at);
  return (now - time) / 60000 < 5; // 5 min “new” window
}

export default function PetFeed({ pets = [], setSelectedPet }) {
  if (!pets || pets.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#aaa" }}>
        <h2>Recently Reported Pets</h2>
        <p>No activity yet 🐾</p>
      </div>
    );
  }

  // 🧠 SORT: newest first (alive feed behavior)
  const sortedPets = [...pets].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div style={{ padding: 16, paddingBottom: 120 }}>
      <h2 style={{ marginBottom: 12, fontSize: 18 }}>
        🧠 Live Pet Activity Feed
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sortedPets.map((p) => {
          const score = calculateRecoveryScore(p);
          const color = getScoreColor(score);
          const newItem = isNew(p.created_at);

          return (
            <div
              key={p.id}
              onClick={() => setSelectedPet?.(p)}
              className="card"
              style={{
                background: "rgba(17,24,39,0.92)",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 18,
                padding: 14,
                boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
                backdropFilter: "blur(16px)",
                position: "relative",
                cursor: "pointer",

                animation: newItem
                  ? "slideUp 0.3s ease, warningGlow 2s infinite"
                  : "slideUp 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-6px) scale(1.01)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
              }}
            >
              {/* IMAGE */}
              {p.image_url ? (
                <img
                  src={p.image_url}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 14,
                    marginBottom: 10,
                  }}
                />
              ) : (
                <div
                  style={{
                    height: 160,
                    borderRadius: 14,
                    background: "#111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                  }}
                >
                  No Image
                </div>
              )}

              {/* NAME */}
              <h3 style={{ marginBottom: 4 }}>{p.name || "Unknown"}</h3>

              {/* TYPE */}
              <p style={{ color: "#9ca3af", fontSize: 13 }}>
                🐕 {p.type || "Unknown"}
              </p>

              {/* DESCRIPTION */}
              <p style={{ fontSize: 13, color: "#cbd5e1", marginTop: 6 }}>
                {p.description || "No description provided"}
              </p>

              {/* RECOVERY SCORE */}
              <div
                style={{
                  marginTop: 10,
                  padding: 8,
                  borderRadius: 10,
                  border: `1px solid ${color}`,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <p style={{ margin: 0, fontSize: 12, color }}>
                  🧠 Recovery Chance: {score}%
                </p>
              </div>

              {/* NEW BADGE */}
              {newItem && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "#ef4444",
                    padding: "4px 8px",
                    borderRadius: 20,
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  NEW
                </div>
              )}

              {/* TIMESTAMP */}
              <p style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>
                {new Date(p.created_at).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
