"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getDistanceMiles } from "@/lib/geo";

export default function Map({ pets, setPets }) {
  const leafletMap = useRef(null);
  const markerLayer = useRef([]);
  const radiusCircle = useRef(null);

  const [user, setUser] = useState(null);
  const [radius, setRadius] = useState(10);
  const [nearbyCount, setNearbyCount] = useState(0);

  // 🟢 INIT MAP
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

  // 🟢 LOAD PETS + REALTIME
  useEffect(() => {
    const loadPets = async () => {
      const { data } = await supabase
        .from("lost_pets")
        .select("*")
        .order("created_at", { ascending: false });

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

  // 🟢 SMART NEARBY ALERT ENGINE
  useEffect(() => {
    if (!leafletMap.current || !user) return;

    import("leaflet").then((L) => {
      // clear old markers
      markerLayer.current.forEach((m) =>
        leafletMap.current.removeLayer(m)
      );
      markerLayer.current = [];

      // remove old circle
      if (radiusCircle.current) {
        leafletMap.current.removeLayer(radiusCircle.current);
      }

      // 🔥 radius circle visualization
      radiusCircle.current = L.circle([user.lat, user.lng], {
        radius: radius * 1609,
        color: "#ff6b6b",
        fillColor: "#ff6b6b",
        fillOpacity: 0.1,
      }).addTo(leafletMap.current);

      let count = 0;

      pets.forEach((p) => {
        if (!p.latitude || !p.longitude) return;

        const d = getDistanceMiles(
          user.lat,
          user.lng,
          p.latitude,
          p.longitude
        );

        if (d <= radius) {
          count++;

          // 🔥 SMART MARKER
          const icon = L.divIcon({
            html: `<div style="
              background:${d < 2 ? "#ff3b3b" : "#ff914d"};
              color:white;
              padding:6px 10px;
              border-radius:20px;
              font-size:12px;
              font-weight:bold;
              white-space:nowrap;
            ">
              ${p.name}
            </div>`,
            className: "",
          });

          const marker = L.marker([p.latitude, p.longitude], {
            icon,
          })
            .addTo(leafletMap.current)
            .bindPopup(
              `<b>${p.name}</b><br/>${d.toFixed(1)} miles away`
            );

          markerLayer.current.push(marker);
        }
      });

      setNearbyCount(count);
    });
  }, [pets, user, radius]);

  return (
    <div style={{ textAlign: "center" }}>
      
      {/* 🔥 LIVE ALERT COUNTER */}
      <h3 style={{ marginTop: 10 }}>
        🐾 {nearbyCount} pets near you
      </h3>

      {/* RADIUS CONTROL */}
      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        style={{
          margin: "10px",
          padding: "8px",
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      />

      {/* MAP */}
      <div
        id="map"
        style={{
          height: "400px",
          width: "90%",
          margin: "auto",
          borderRadius: 12,
        }}
      />
    </div>
  );
}
