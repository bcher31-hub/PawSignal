"use client";

import { useEffect, useRef, useState } from "react";
import { getDistanceMiles } from "@/lib/geo";

export default function Map({ pets = [] }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);

  const clusterRef = useRef(null);
  const heatRef = useRef(null);
  const circleRef = useRef(null);

  const [user, setUser] = useState(null);
  const [radius, setRadius] = useState(10);
  const [nearbyCount, setNearbyCount] = useState(0);
  const [zone, setZone] = useState("CLEAR");

  // =========================
  // INIT MAP (SSR SAFE)
  // =========================
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (mapRef.current) return;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");
      await import("leaflet.heat");

      leafletRef.current = L;

      const map = L.map("map").setView([27.95, -82.46], 10);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      navigator.geolocation.getCurrentPosition((pos) => {
        const u = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setUser(u);
        map.setView([u.lat, u.lng], 12);

        L.marker([u.lat, u.lng]).addTo(map).bindPopup("📍 You are here");
      });
    })();
  }, []);

  // =========================
  // RENDER ENGINE
  // =========================
  useEffect(() => {
    if (!mapRef.current || !user || !leafletRef.current) return;

    const L = leafletRef.current;

    if (clusterRef.current) mapRef.current.removeLayer(clusterRef.current);
    if (heatRef.current) mapRef.current.removeLayer(heatRef.current);
    if (circleRef.current) mapRef.current.removeLayer(circleRef.current);

    const cluster = L.markerClusterGroup();
    mapRef.current.addLayer(cluster);
    clusterRef.current = cluster;

    circleRef.current = L.circle([user.lat, user.lng], {
      radius: radius * 1609,
      color: "#ff6b6b",
      fillOpacity: 0.08,
    }).addTo(mapRef.current);

    let count = 0;
    let urgent = 0;
    let heatPoints = [];

    pets.forEach((p) => {
      if (!p.latitude || !p.longitude) return;

      const d = getDistanceMiles(user.lat, user.lng, p.latitude, p.longitude);

      if (d > radius) return;

      count++;
      if (d < 1) urgent++;

      const icon = L.divIcon({
        html: `<div style="
          background:${d < 1 ? "#ff2d2d" : "#ff914d"};
          color:white;
          padding:6px 10px;
          border-radius:20px;
          font-size:12px;
          white-space:nowrap;
        ">${p.name}</div>`,
      });

      const marker = L.marker([p.latitude, p.longitude], { icon });

      marker.bindPopup(`<b>${p.name}</b><br/>${d.toFixed(1)} miles away`);

      cluster.addLayer(marker);

      heatPoints.push([p.latitude, p.longitude, 1]);
    });

    let zoneLevel = "CLEAR";
    if (count >= 5 || urgent >= 2) zoneLevel = "CRITICAL";
    else if (count >= 3) zoneLevel = "ACTIVE";
    else if (count >= 1) zoneLevel = "WATCH";

    setZone(zoneLevel);
    setNearbyCount(count);

    heatRef.current = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 20,
    }).addTo(mapRef.current);
  }, [pets, user, radius]);

  return (
    <div style={{ textAlign: "center" }}>

      {/* HUD */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 10,
        margin: "10px 0",
      }}>
        <div style={badge(zone)}>
          🧭 {zone}
        </div>

        <div style={badge()}>
          🐾 {nearbyCount} nearby
        </div>
      </div>

      {/* MAP */}
      <div
        id="map"
        style={{
          height: 450,
          width: "100%",
          borderRadius: 12,
        }}
      />

      {/* RADIUS */}
      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        style={input}
      />
    </div>
  );
}

const badge = (zone) => ({
  padding: "6px 12px",
  borderRadius: 20,
  background:
    zone === "CLEAR" ? "#1f2937" :
    zone === "WATCH" ? "#2d2a1f" :
    zone === "ACTIVE" ? "#3a1f1f" :
    "#5a0f0f",
  color: "white",
  fontSize: 12,
});

const input = {
  marginTop: 10,
  padding: 8,
  borderRadius: 8,
  border: "1px solid #333",
  background: "#111",
  color: "white",
};
