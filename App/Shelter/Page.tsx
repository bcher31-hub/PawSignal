"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ShelterDashboard() {

  const [pets, setPets] = useState([]);

  useEffect(() => {
    loadFoundPets();
  }, []);

  async function loadFoundPets() {
    const { data } = await supabase
      .from("found_pets")
      .select("*")
      .order("created_at", { ascending: false });

    setPets(data || []);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🏢 Shelter Dashboard</h1>

      {pets.map((p: any) => (
        <div key={p.id} style={{ border: "1px solid #ddd", margin: 10, padding: 10 }}>
          <h3>{p.name || "Unknown Pet"}</h3>
          <img src={p.image_url} width={200} />
          <p>{p.description}</p>
          <p>Status: {p.status}</p>

          <button
            onClick={async () => {
              await supabase
                .from("found_pets")
                .update({ status: "claimed" })
                .eq("id", p.id);

              loadFoundPets();
            }}
          >
            Mark Claimed
          </button>
        </div>
      ))}
    </div>
  );
}
