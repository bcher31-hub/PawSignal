"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadForm() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
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
          console.error("Upload error:", uploadError.message);
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
      // 2. Insert into DB (RETURN DATA)
      // -------------------------
      const { data, error } = await supabase
        .from("lost_pets")
        .insert([
          {
            name: form.get("name"),
            type: form.get("type"),
            description: form.get("description"),
            latitude: 27.95,
            longitude: -82.46,
            image_url: imageUrl,
          },
        ])
        .select(); // 🔥 CRITICAL

      if (error) {
        console.error("Insert error:", error.message);
        setMsg("❌ Failed to save pet");
        setLoading(false);
        return;
      }

      // -------------------------
      // 3. INSTANT UI UPDATE (NO REFRESH)
      // -------------------------
      if (data && data[0]) {
        window.dispatchEvent(
          new CustomEvent("new-pet", { detail: data[0] })
        );
      }

      setMsg("✅ Pet reported!");
      e.target.reset();

    } catch (err) {
      console.error("Unexpected error:", err);
      setMsg("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      style={{
        padding: 15,
        borderRadius: 12,
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ marginBottom: 12 }}>🐾 Report Lost Pet</h3>

      <input
        name="name"
        placeholder="Pet name"
        required
        style={inputStyle}
      />

      <input
        name="type"
        placeholder="Type (Dog, Cat...)"
        required
        style={inputStyle}
      />

      <textarea
        name="description"
        placeholder="Description"
        style={{ ...inputStyle, minHeight: 60 }}
      />

      <input
        type="file"
        name="image"
        style={{ marginBottom: 12 }}
      />

      <button
  type="submit"
  disabled={loading}
  style={{
    width: "100%",
    padding: 12,
    background: loading ? "#ccc" : "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: loading ? "not-allowed" : "pointer",
    fontWeight: "bold",
    transition: "0.2s ease",
  }}
>
  {loading ? "Posting..." : "Report Pet 🐾"}
</button>

      {msg && (
        <p style={{ marginTop: 10, fontSize: 14 }}>
          {msg}
        </p>
      )}
    </form>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: 10,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};
