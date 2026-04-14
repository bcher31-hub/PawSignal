"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadForm() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 📍 SAFE GEOLOCATION (PROMISE WRAPPER)
  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 27.95, lng: -82.46 }); // fallback
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          resolve({ lat: 27.95, lng: -82.46 }); // fallback if denied
        }
      );
    });
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const form = new FormData(e.target);
      const file = form.get("image");

      // 📍 GET LOCATION FIRST
      const location = await getLocation();

      let imageUrl = null;

      // -------------------------
      // 1. Upload image (optional)
      // -------------------------
      if (file && file.name) {
        const fileName = `${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(fileName, file);

        if (uploadError) {
          console.log("Upload error:", uploadError.message);
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
      // 2. INSERT (REAL LOCATION FIXED)
      // -------------------------
      const { data, error } = await supabase
        .from("lost_pets")
        .insert([
          {
            name: form.get("name"),
            type: form.get("type"),
            description: form.get("description"),

            // 🔥 REAL GPS
            latitude: location.lat,
            longitude: location.lng,

            image_url: imageUrl,
          },
        ])
        .select();

      if (error) {
        console.log("Insert error:", error.message);
        setMsg("❌ Failed to save pet");
        setLoading(false);
        return;
      }

      // -------------------------
      // 3. REALTIME EVENT PUSH
      // -------------------------
      if (data?.[0]) {
        window.dispatchEvent(
          new CustomEvent("new-pet", { detail: data[0] })
        );
      }

      setMsg("🐾 Pet reported successfully!");
      e.target.reset();

    } catch (err) {
      console.log(err);
      setMsg("❌ Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form style={styles.card} onSubmit={submit}>
      <h3 style={{ marginBottom: 10 }}>🐾 Report Lost Pet</h3>

      <input name="name" placeholder="Pet name" required style={styles.input} />
      <input name="type" placeholder="Dog / Cat" required style={styles.input} />
      <textarea name="description" placeholder="Description" style={styles.input} />

      <input type="file" name="image" style={{ marginBottom: 10 }} />

      {/* 📍 LOCATION INDICATOR */}
      <p style={{ fontSize: 12, color: "#777" }}>
        📍 Auto-location will be used (or fallback if denied)
      </p>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Posting..." : "Report Pet 🐾"}
      </button>

      {msg && (
        <p style={{ marginTop: 10, fontSize: 13 }}>
          {msg}
        </p>
      )}
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
