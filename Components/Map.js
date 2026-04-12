"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { supabase } from "@/lib/supabaseClient";
import { getDistanceMiles } from "@/lib/geo";

export default function Map({ pets, setPets }) {
  const mapRef = useRef(null);
  const markerLayer = useRef([]);
  const [user, setUser] = useState(null);
  const [radius, setRadius] = useState(10);

  // INIT MAP ONLY ONCE
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = L.map("map").setView([27.95, -82.46], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(mapRef.current);

    navigator.geolocation.getCurrentPosition((pos) => {
      const u = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setUser(u);

      mapRef.current.setView([u.lat, u.lng], 12);

      L.marker([u.lat, u.lng])
        .addTo(mapRef.current)
        .bindPopup("📍 You are here");
    });
  }, []);

  // LOAD PETS (REAL-TIME SAFE)
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("lost_pets").select("*");
      setPets(data || []);
    };

    load();

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

  // UPDATE MAP MARKERS
  useEffect(() => {
    if (!mapRef.current || !user) return;

    markerLayer.current.forEach((m) => mapRef.current.removeLayer(m));
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
          .addTo(mapRef.current)
          .bindPopup(`
            <b>${p.name}</b><br/>
            ${d.toFixed(1)} miles away
          `);

        markerLayer.current.push(marker);
      }
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
