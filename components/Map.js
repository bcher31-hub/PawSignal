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

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
        .addTo(map);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const u = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          setUser(u);
          map.setView([u.lat, u.lng], 12);

          L.marker([u.lat, u.lng]).addTo(map);
        },
        () => setUser({ lat: 27.95, lng: -82.46 })
      );
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
    clusterRef.current = cluster;
    mapRef.current.addLayer(cluster);

    circleRef.current = L.circle([user.lat, user.lng], {
      radius: radius * 1609,
    }).addTo(mapRef.current);

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
        html: `<div style="
          background:${isUrgent ? "#ff2d2d" : "#ff914d"};
          color:white;
          padding:6px 10px;
          border-radius:20px;
          font-size:12px;
        ">${p.name}</div>`,
        className: "",
      });

      const marker = L.marker([p.latitude, p.longitude], { icon });

      marker.on("click", () => {
        window.dispatchEvent(new CustomEvent("open-pet", { detail: p }));
      });

      cluster.addLayer(marker);

      heatPoints.push([p.latitude, p.longitude, 1]);
    });

    let zoneLevel = "CLEAR";
    if (count >= 5 || urgent >= 2) zoneLevel = "CRITICAL";
    else if (count >= 3) zoneLevel = "ACTIVE";
    else if (count >= 1) zoneLevel = "WATCH";

    setZone(zoneLevel);
    setNearbyCount(count);

    heatRef.current = L.heatLayer(heatPoints).addTo(mapRef.current);
  }, [pets, user, radius]);

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
      }}>
        🧭 {zone} ZONE • 🐾 {nearbyCount}
      </div>

      <input
        type="number"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
      />

      <div id="map" style={{ height: 450, marginTop: 10 }} />
    </div>
  );
}
