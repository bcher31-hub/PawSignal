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

      // 1. Upload image
      if (file && file.name) {
        const fileName = `${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(fileName, file);

        if (uploadError) {
          console.error(uploadError);
          setMsg("❌ Image upload failed");
          setLoading(false);
          return;
        }

        const { data } = supabase.storage
          .from("pet-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // 2. Insert into DB
      const { error } = await supabase.from("lost_pets").insert([
        {
          name: form.get("name"),
          type: form.get("type"),
          description: form.get("description"),
          latitude: 27.95,
          longitude: -82.46,
          image_url: imageUrl,
        },
      ]);

      if (error) {
        console.error(error);
        setMsg("❌ Failed to save pet");
        setLoading(false);
        return;
      }

      setMsg("✅ Pet reported!");
      e.target.reset();

    } catch (err) {
      console.error(err);
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
        background: "#f9f9f9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ marginBottom: 10 }}>🐾 Report Lost Pet</h3>

      <input
        name="name"
        placeholder="Pet name"
        required
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />

      <input
        name="type"
        placeholder="Type (Dog, Cat...)"
        required
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />

      <textarea
        name="description"
        placeholder="Description"
        style={{ width: "100%", marginBottom: 8, padding: 8 }}
      />

      <input type="file" name="image" style={{ marginBottom: 10 }} />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          background: "#ff6b6b",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {loading ? "Posting..." : "Report Pet"}
      </button>

      {msg && (
        <p style={{ marginTop: 10, fontSize: 14 }}>
          {msg}
        </p>
      )}
    </form>
  );
}
