"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import TopBar from "@/components/TopBar";
import WelcomeCard from "@/components/WelcomeCard";
import ActionButtons from "@/components/ActionButtons";
import PetGrid from "@/components/PetGrid";
import BottomNav from "@/components/BottomNav";
import UploadSheet from "@/components/UploadSheet";

export default function Page() {
  const [pets, setPets] = useState([]);
  const [tab, setTab] = useState("home");
  const [open, setOpen] = useState(false);
  const [activePet, setActivePet] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      const { data } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

      setPets(data || []);
    };

    fetchPets();
  }, []);

  return (
    <div style={styles.app}>

      <TopBar />

      <WelcomeCard />

      <ActionButtons onOpen={() => setOpen(true)} />

      <PetGrid
        pets={pets}
        activePet={activePet}
        setActivePet={setActivePet}
      />

      <BottomNav tab={tab} setTab={setTab} setOpen={setOpen} />

      {open && <UploadSheet onClose={() => setOpen(false)} />}

    </div>
  );
}

const styles = {
  app: {
    height: "100vh",
    width: "100vw",
    background: "#0b0f14",
    color: "white",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflow: "hidden",
    fontFamily: "system-ui",
  },
};
