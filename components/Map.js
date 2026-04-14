"use client";

import { useEffect, useRef, useState } from "react";
import { getDistanceMiles } from "@/lib/geo";

export default function Map({ pets = [] }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);

  const markersRef = useRef([]);
  const circleRef = useRef(null);

  const [user, setUser] = useState(null);
  const [radius, setRadius] = useState(10);
  const [nearbyCount, setNearbyCount] = useState(0);

  // =========================
  // 1. INIT MAP (SSR SAFE + LAZY LOAD)
  // =========================
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (leafletRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted) return;

      leafletRef.current = L;

      const map = L.map("map").setView([27.95, -82.46], 10);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      // safe geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const location = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            setUser(location);

            map.setView([location.lat, location.lng], 12);

            L.marker([location.lat, location.lng])
              .addTo(map)
              .bindPopup("📍 You are here");
          },
          () => {
            setUser({ lat: 27.95, lng: -82.46 });
          }
        );
      } else {
        setUser({ lat: 27.95, lng: -82.46 });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================
  // 2. RENDER ENGINE (SAFE + CONTROLLED)
  // =========================
  useEffect(() => {
    if (!mapRef.current || !leafletRef.current || !user) return;

    const L = leafletRef.current;

    // clear markers
    markersRef.current.forEach((m) => {
      mapRef.current.removeLayer(m);
    });
    markersRef.current = [];

    // clear circle
    if (circleRef.current) {
      mapRef.current.removeLayer(circleRef.current);
    }

    // draw radius
    circleRef.current = L.circle([user.lat, user.lng], {
      radius: radius * 1609,
      color: "#ff6b6b",
      fillColor: "#ff6b6b",
      fillOpacity: 0.1,
    }).addTo(mapRef.current);

    // =========================
    // SMART DETECTION ENGINE
    // =========================
    let count = 0;

    const validPets = Array.isArray(pets) ? pets : [];

    validPets.forEach((p) => {
      if (!p.latitude || !p.longitude) return;

      const d = getDistanceMiles(
        user.lat,
        user.lng,
        p.latitude,
        p.longitude
      );

      if (d > radius) return;

      count++;

      const isUrgent = d < 1;

      const icon = L.divIcon({
        html: `
          <div style="
            background:${isUrgent ? "#ff2d2d" : "#ff914d"};
            color:white;
            padding:6px 10px;
            border-radius:20px;
            font-size:12px;
            font-weight:600;
            white-space:nowrap;
            box-shadow:0 2px 6px rgba(0,0,0,0.2);
          ">
            ${p.name}
          </div>
        `,
        className: "",
      });

      const marker = L.marker([p.latitude, p.longitude], { icon })
        .addTo(mapRef.current)
        .bindPopup(`
          <b>${p.name}</b><br/>
          ${d.toFixed(1)} miles away
        `);

      markersRef.current.push(marker);
    });

    setNearbyCount(count);
  }, [pets, user, radius]);

  // =========================
  // 3. UI
  // =========================
  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ marginTop: 10 }}>
        {nearbyCount === 0
          ? "😌 No pets nearby"
          : `🐾 ${nearbyCount} pets near you`}
      </h3>

      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        style={{
          margin: "10px",
          padding: 8,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      />

      <div
        id="map"
        style={{
          height: "420px",
          width: "90%",
          margin: "auto",
          borderRadius: 12,
        }}
      />
    </div>
  );
}
