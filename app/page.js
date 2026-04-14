"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Map from "@/components/Map";
import PetFeed from "@/components/PetFeed";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // 🔥 LOAD INITIAL DATA
  useEffect(() => {
    const loadPets = async () => {
      const { data, error } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setPets(data || []);
    };

    loadPets();
  }, []);

  // 🔥 REAL-TIME SUBSCRIPTION (ONLY SOURCE OF TRUTH)
  useEffect(() => {
    const channel = supabase
      .channel("lost_pets_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "lost_pets",
        },
        (payload) => {
          setPets((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div style={{ position: "relative", fontFamily: "Arial" }}>

      {/* HEADER */}
      <h2 style={{ textAlign: "center", margin: 10 }}>
        🐾 PawSignal
      </h2>

      {/* MAP */}
      <Map pets={pets} />

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#ff6b6b",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontSize: 28,
          cursor: "pointer",
        }}
      >
        +
      </button>

      {/* MODAL */}
      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UploadForm />
          </div>
        </div>
      )}

      {/* FEED */}
      <PetFeed pets={pets} />

    </div>
  );
}
