"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getDistanceMiles } from "@/lib/geo";

export default function Map({ pets, setPets }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerLayer = useRef([]);
  const [user, setUser] = useState(null);
  const [radius, setRadius] = useState(10);

  // 🟢 INIT MAP (CLIENT ONLY SAFE)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (leafletMap.current) return;

    import("leaflet").then((L) => {
      leafletMap.current = L.map("map").setView([27.95, -82.46], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(leafletMap.current);

      navigator.geolocation.getCurrentPosition((pos) => {
        const u = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setUser(u);

        leafletMap.current.setView([u.lat, u.lng], 12);

        L.marker([u.lat, u.lng])
          .addTo(leafletMap.current)
          .bindPopup("📍 You are here");
      });
    });
  }, []);

  // 🟢 LOAD PETS + REALTIME UPDATES
  useEffect(() => {
    const loadPets = async () => {
      const { data } = await supabase.from("lost_pets").select("*");
      setPets(data || []);
    };

    loadPets();

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

  // 🟢 ALERTS LISTENER (FIXED - MERGED PROPERLY)
 

  // 🟢 UPDATE MARKERS
  useEffect(() => {
    if (!leafletMap.current || !user) return;

    import("leaflet").then((L) => {
      markerLayer.current.forEach((m) =>
        leafletMap.current.removeLayer(m)
      );
      markerLayer.current = [];

      pets.forEach((p) => {
        if (!p.latitude || !p.longitude) return;

        const d = getDistanceMiles(
          user.lat,
          user.lng,
          p.latitude,
          p.longitude
        );

        if (d <= radius) {
          const marker = L.marker([p.latitude, p.longitude])
            .addTo(leafletMap.current)
            .bindPopup(
              `<b>${p.name}</b><br/>${d.toFixed(1)} miles away`
            );

          markerLayer.current.push(marker);
        }
      });
    });
  }, [pets, user, radius]);

  return (
    <div style={{ textAlign: "center" }}>
      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        style={{ margin: "10px", padding: "8px" }}
      />

      <div
        id="map"
        style={{ height: "400px", width: "90%", margin: "auto" }}
      />
    </div>
  );
}
