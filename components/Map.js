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
  // 🧱 INIT MAP (SAFE SSR)
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

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const u = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          setUser(u);

          map.setView([u.lat, u.lng], 12);

          L.marker([u.lat, u.lng])
            .addTo(map)
            .bindPopup("📍 You are here");
        },
        () => {
          setUser({ lat: 27.95, lng: -82.46 });
        }
      );
    })();
  }, []);

  // =========================
  // 🧠 RENDER ENGINE (HARDENED)
  // =========================
  useEffect(() => {
    if (!mapRef.current || !user || !leafletRef.current) return;

    const L = leafletRef.current;

    // =========================
    // 🧹 CLEAN OLD LAYERS
    // =========================
    if (clusterRef.current) {
      mapRef.current.removeLayer(clusterRef.current);
    }

    if (heatRef.current) {
      mapRef.current.removeLayer(heatRef.current);
    }

    if (circleRef.current) {
      mapRef.current.removeLayer(circleRef.current);
    }

    // =========================
    // 📦 CLUSTER SYSTEM
    // =========================
    const cluster = L.markerClusterGroup();
    clusterRef.current = cluster;
    mapRef.current.addLayer(cluster);

    // =========================
    // 📍 RADIUS CIRCLE
    // =========================
    circleRef.current = L.circle([user.lat, user.lng], {
      radius: radius * 1609,
      color: "#ff6b6b",
      fillColor: "#ff6b6b",
      fillOpacity: 0.08,
    }).addTo(mapRef.current);

    // =========================
    // 🧠 AI ENGINE
    // =========================
    let count = 0;
    let urgent = 0;
    let heatPoints = [];

    pets.forEach((p) => {
      if (!p.latitude || !p.longitude) return;

      const d = getDistanceMiles(
        user.lat,
        user.lng,
        p.latitude,
        p.longitude
      );

      if (d > radius) return;

      count++;
      if (d < 1) urgent++;

      const isUrgent = d < 1;

      const icon = L.divIcon({
        html: `
          <div style="
            background:${isUrgent ? "#ff2d2d" : "#ff914d"};
            color:white;
            padding:6px 10px;
            border-radius:20px;
            font-size:12px;
            font-weight:bold;
            white-space:nowrap;
          ">
            ${p.name}
          </div>
        `,
        className: "",
      });

      const marker = L.marker([p.latitude, p.longitude], { icon });

      marker.bindPopup(`
        <b>${p.name}</b><br/>
        ${d.toFixed(1)} miles away
      `);

      cluster.addLayer(marker);

      heatPoints.push([p.latitude, p.longitude, 1]);
    });

    // =========================
    // 🧭 ZONE ENGINE
    // =========================
    let zoneLevel = "CLEAR";

    if (count >= 5 || urgent >= 2) zoneLevel = "CRITICAL";
    else if (count >= 3) zoneLevel = "ACTIVE";
    else if (count >= 1) zoneLevel = "WATCH";

    setZone(zoneLevel);
    setNearbyCount(count);

    // =========================
    // 🔥 HEATMAP LAYER
    // =========================
    heatRef.current = L.heatLayer(heatPoints, {
      radius: 30,
      blur: 20,
      maxZoom: 15,
    }).addTo(mapRef.current);
  }, [pets, user, radius]);

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        background:
          zone === "CLEAR" ? "#e8f5e9" :
          zone === "WATCH" ? "#fff8e1" :
          zone === "ACTIVE" ? "#ffebee" :
          "#b71c1c",
        color: zone === "CRITICAL" ? "white" : "black",
        fontWeight: "bold"
      }}>
        🧭 Zone Status: {zone}
      </div>

      <h3 style={{ marginTop: 10 }}>
        🐾 {nearbyCount} pets nearby
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
          height: "450px",
          width: "90%",
          margin: "auto",
          borderRadius: 12,
        }}
      />
    </div>
  );
}
