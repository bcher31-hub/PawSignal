"use client";"use client";

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
      // 1. Upload image (SAFE)
      // -------------------------
      if (file && file.name) {
        const fileName = `${Date.now()}_${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError.message);
          setMsg("Image upload failed");
          setLoading(false);
          return;
        }

        const { data } = supabase.storage
          .from("pet-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // -------------------------
      // 2. INSERT ROW (FIXED)
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
        .select(); // IMPORTANT FIX

      if (error) {
        console.error("Insert error:", error.message);
        setMsg("Database insert failed");
        setLoading(false);
        return;
      }

      console.log("Inserted row:", data);

      setMsg("🐾 Pet reported successfully!");
      e.target.reset();
    } catch (err) {
      console.error("Unexpected error:", err);
      setMsg("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ padding: 20 }}>
      <h3>Report Lost Pet</h3>

      <input name="name" placeholder="Name" required />
      <br />

      <input name="type" placeholder="Type (Dog/Cat)" required />
      <br />

      <textarea name="description" placeholder="Description" />
      <br />

      <input type="file" name="image" />
      <br />

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Submit"}
      </button>

      <p>{msg}</p>
    </form>
  );
}
