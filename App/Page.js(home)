"use client";

import { useEffect, useState } from "react";
import Map from "@/components/Map";
import PetFeed from "@/components/PetFeed";

export default function Home() {
  const [pets, setPets] = useState([]);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🐾 PawSignal</h1>

      <Map pets={pets} setPets={setPets} />

      <PetFeed pets={pets} />
    </div>
  );
}
