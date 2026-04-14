"use client";

import { useState } from "react";
import Map from "@/components/Map";
import PetFeed from "@/components/PetFeed";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  const [pets, setPets] = useState([]);

  return (
    <div style={{ fontFamily: "Arial" }}>
      
      {/* HEADER */}
      <h2 style={{ textAlign: "center", margin: 10 }}>
        🐾 PawSignal
      </h2>

      {/* MAP FIRST (PRIMARY EXPERIENCE) */}
      <Map pets={pets} setPets={setPets} />

      {/* QUICK ACTION (VISIBLE, NOT DOMINANT) */}
      <div style={{ padding: "10px 20px" }}>
        <UploadForm />
      </div>

      {/* FEED (SECONDARY) */}
      <PetFeed pets={pets} />

    </div>
  );
}
