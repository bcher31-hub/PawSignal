"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ShelterDashboard() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

      setPets(data || []);
    };

    load();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🏠 Shelter Dashboard</h1>

      <p style={{ color: "#666" }}>
        Intake overview of lost pets in your network
      </p>

      {pets.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 10,
            borderRadius: 10,
          }}
        >
          <h3>{p.name}</h3>
          <p>Type: {p.type}</p>
          <p>{p.description}</p>

          <p style={{ fontSize: 12, color: "#999" }}>
            📍 {p.latitude}, {p.longitude}
          </p>

          <button
            style={{
              marginTop: 8,
              padding: 8,
              background: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: 6,
            }}
          >
            Mark as Received
          </button>
        </div>
      ))}
    </div>
  );
}
