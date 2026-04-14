"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadForm() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);

  // 🔥 GET USER LOCATION
  async function getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => reject(err)
      );
    });
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const location = await getLocation();
      setCoords(location);

      const form = new FormData(e.target);
      const file = form.get("image");

      let imageUrl = null;

      // -------------------------
      // 1. Upload image
      // -------------------------
      if (file && file.name) {
        const fileName = `${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(fileName, file);

        if (uploadError) {
          setMsg("❌ Image upload failed");
          setLoading(false);
          return;
        }

        const { data } = supabase.storage
          .from("pet-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // -------------------------
      // 2. INSERT WITH REAL LOCATION
      // -------------------------
      const { data, error } = await supabase
        .from("lost_pets")
        .insert([
          {
            name: form.get("name"),
            type: form.get("type"),
            description: form.get("description"),
            latitude: location.lat,
            longitude: location.lng,
            image_url: imageUrl,
          },
        ])
        .select();

      if (error) {
        setMsg("❌ Failed to save pet");
        setLoading(false);
        return;
      }

      // 🔥 REAL-TIME PUSH EVENT
      if (data?.[0]) {
        window.dispatchEvent(
          new CustomEvent("new-pet", { detail: data[0] })
        );
      }

      setMsg("🐾 Pet reported from your location!");
      e.target.reset();

    } catch (err) {
      console.error(err);
      setMsg("❌ Location permission denied or error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={styles.card}>
      <h3>🐾 Report Lost Pet</h3>

      <input name="name" placeholder="Pet name" required style={styles.input} />
      <input name="type" placeholder="Dog / Cat" required style={styles.input} />
      <textarea name="description" placeholder="Description" style={styles.input} />

      <input type="file" name="image" style={{ marginBottom: 10 }} />

      {/* 🔥 LOCATION STATUS */}
      <p style={{ fontSize: 12, color: "#666" }}>
        📍 Location will be captured automatically
      </p>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Posting..." : "Report Pet 🐾"}
      </button>

      {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
    </form>
  );
}

const styles = {
  card: {
    padding: 15,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },
};
