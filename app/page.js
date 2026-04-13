"use client";

import { useState } from "react";
import Map from "@/components/Map";
import PetFeed from "@/components/PetFeed";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  const [pets, setPets] = useState([]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      
      {/* HEADER */}
      <h1 style={{ textAlign: "center", marginTop: 20 }}>
        🐾 PawSignal
      </h1>

      {/* UPLOAD SECTION */}
      <section style={{ marginBottom: 20 }}>
        <UploadForm />
      </section>

      {/* MAP SECTION */}
      <section style={{ marginBottom: 20 }}>
        <Map pets={pets} setPets={setPets} />
      </section>

      {/* FEED SECTION */}
      <section>
        <PetFeed pets={pets} />
      </section>

    </div>
  );
}
