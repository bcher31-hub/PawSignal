"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function Report() {
  const [msg, setMsg] = useState("");

  async function submit(e) {
  e.preventDefault();

  const form = new FormData(e.target);
  const file = form.get("image");

  let imageUrl = null;

  // ✅ SAFETY CHECK (fixes build/runtime crash)
  if (file && file instanceof File && file.name) {
    const fileName = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("pet-images")
      .upload(fileName, file);

    if (!uploadError) {
      const { data } = supabase.storage
        .from("pet-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }
  }

  const { error } = await supabase.from("lost_pets").insert([
    {
      name: form.get("name"),
      type: form.get("type"),
      description: form.get("description"),
      latitude: 0,
      longitude: 0,
      image_url: imageUrl,
    },
  ]);

  setMsg(error ? "Error" : "Posted 🐾");
}

  return (
    <form onSubmit={submit} style={{ padding: 20 }}>
      <input name="name" placeholder="Name" /><br/>
      <input name="type" placeholder="Type" /><br/>
      <textarea name="description" /><br/>
      <input type="file" name="image" /><br/>
      <button type="submit">Submit</button>

      <p>{msg}</p>
    </form>
  );
}
