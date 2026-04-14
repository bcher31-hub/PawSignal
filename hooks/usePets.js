"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function usePets() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    // 1. initial load
    const loadPets = async () => {
      const { data } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

      setPets(data || []);
    };

    loadPets();

    // 2. realtime updates
    const channel = supabase
      .channel("pets")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "lost_pets" },
        (payload) => {
          setPets((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { pets, setPets };
}
