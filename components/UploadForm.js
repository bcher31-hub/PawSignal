"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadForm() {
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();

    const form = new FormData(e.target);
    const file = form.get("image");

    let imageUrl = null;

    if (file && file.name) {
      const fileName = Date.now() + "_" + file.name;

      await supabase.storage
        .from("pet-images")
        .upload(fileName, file);

      const { data } = supabase.storage
        .from("pet-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

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

    setMsg(error ? "Error posting" : "Pet reported 🐾");
    e.target.reset();
  }

  return (
    <form onSubmit={submit} style={{ padding: 20 }}>
      <h3>Report Lost Pet</h3>

      <input name="name" placeholder="Name" />
      <br />

      <input name="type" placeholder="Type (Dog/Cat)" />
      <br />

      <textarea name="description" placeholder="Description" />
      <br />

      <input type="file" name="image" />
      <br />

      <button type="submit">Submit</button>

      <p>{msg}</p>
    </form>
  );
}
