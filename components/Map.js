"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { getDistanceMiles } from "@/lib/geo";

export default function Map({ pets = [] }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  const markersRef = useRef([]);
  const circleRef = useRef(null);

  const [user, setUser] = useState(null);
  const [radius, setRadius] = useState(10);
  const [nearbyCount, setNearbyCount] = useState(0);

  // =========================
  // 1. INIT MAP (RUN ONCE)
  // =========================
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (leafletMap.current) return;

    leafletMap.current = L.map("map").setView([27.95, -82.46], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(leafletMap.current);

    navigator.geolocation.getCurrentPosition((pos) => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setUser(location);

      leafletMap.current.setView([location.lat, location.lng], 12);

      L.marker([location.lat, location.lng])
        .addTo(leafletMap.current)
        .bindPopup("📍 You are here");
    });
  }, []);

  // =========================
  // 2. RENDER PETS (OPTIMIZED)
  // =========================
  useEffect(() => {
    if (!leafletMap.current || !user) return;

    const L = require("leaflet"); // safe runtime access

    // 🔥 CLEAR OLD MARKERS
    markersRef.current.forEach((m) => {
      leafletMap.current.removeLayer(m);
    });
    markersRef.current = [];

    // 🔥 CLEAR OLD CIRCLE
    if (circleRef.current) {
      leafletMap.current.removeLayer(circleRef.current);
    }

    // 🔥 DRAW RADIUS CIRCLE
    circleRef.current = L.circle([user.lat, user.lng], {
      radius: radius * 1609,
      color: "#ff6b6b",
      fillColor: "#ff6b6b",
      fillOpacity: 0.1,
    }).addTo(leafletMap.current);

    // =========================
    // 3. SMART FILTER ENGINE
    // =========================
    let count = 0;

    const validPets = pets.filter(
      (p) => p.latitude && p.longitude
    );

    validPets.forEach((p) => {
      const distance = getDistanceMiles(
        user.lat,
        user.lng,
        p.latitude,
        p.longitude
      );

      if (distance > radius) return;

      count++;

      const isUrgent = distance < 2;

      const icon = L.divIcon({
        html: `
          <div style="
            background:${isUrgent ? "#ff3b3b" : "#ff914d"};
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
        .addTo(leafletMap.current)
        .bindPopup(`
          <b>${p.name}</b><br/>
          ${distance.toFixed(1)} miles away
        `);

      markersRef.current.push(marker);
    });

    setNearbyCount(count);
  }, [pets, user, radius]);

  // =========================
  // 4. UI
  // =========================
  return (
    <div style={{ textAlign: "center" }}>
      
      {/* LIVE COUNTER */}
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
          padding: 8,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      />

      {/* MAP CONTAINER */}
      <div
        id="map"
        style={{
          height: "420px",
          width: "90%",
          margin: "auto",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
}
