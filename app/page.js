"use client";

import { useState, useEffect } from "react";
import Map from "@/components/Map";
import PetFeed from "@/components/PetFeed";
import UploadForm from "@/components/UploadForm";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // 🔥 LOAD EXISTING PETS (ON PAGE LOAD)
  useEffect(() => {
    const loadPets = async () => {
      const { data, error } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Load error:", error.message);
        return;
      }

      setPets(data || []);
    };

    loadPets();
  }, []);

  // 🔥 REAL-TIME LISTENER (FRONTEND EVENT SYSTEM)
  useEffect(() => {
    const handler = (e) => {
      setPets((prev) => [e.detail, ...prev]);
    };

    window.addEventListener("new-pet", handler);

    return () => {
      window.removeEventListener("new-pet", handler);
    };
  }, []);

  return (
    <div style={{ position: "relative", fontFamily: "Arial" }}>
      
      {/* HEADER */}
      <h2 style={{ textAlign: "center", margin: 10 }}>
        🐾 PawSignal
      </h2>

      <p style={{
        textAlign: "center",
        color: "#666",
        marginBottom: 10
      }}>
        Helping lost pets find their way home ❤️
      </p>

      {/* ALERT BANNER */}
      <div style={{
        background: "#fff5f5",
        padding: 10,
        borderRadius: 10,
        textAlign: "center",
        margin: "10px",
        color: "#ff4d4d"
      }}>
        🚨 Stay alert — pets reported near your area
      </div>

      {/* MAP */}
      <Map pets={pets} setPets={setPets} />

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
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
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
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: 20,
              borderRadius: 12,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <button
              onClick={() => setShowForm(false)}
              style={{ float: "right", border: "none", background: "none" }}
            >
              ✖
            </button>

            <UploadForm />
          </div>
        </div>
      )}

      {/* FEED */}
      <PetFeed pets={pets} />
    </div>
  );
}
