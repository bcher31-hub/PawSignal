"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ReportForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const form = e.target;

    const name = form.pet_name.value;
    const type = form.pet_type.value;
    const location = form.location.value;
    const contact = form.contact.value;
    const description = form.description.value;
    const file = form.pet_image.files[0];

    let imageUrl = null;

    try {
      // 📍 Get location safely
      let coords = { latitude: null, longitude: null };

      try {
        const pos = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej)
        );

        coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
      } catch {
        console.warn("Location denied");
      }

      // 🖼 Upload image
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("pet-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("pet-images")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      // 🗄 Insert into DB
      const { error } = await supabase.from("lost_pets").insert([
        {
          name,
          type,
          last_seen_location: location,
          contact_info: contact,
          description,
          latitude: coords.latitude,
          longitude: coords.longitude,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      setStatus("✅ Pet reported successfully");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("❌ Error submitting");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Report Lost Pet 🐾</h3>

      <input name="pet_name" placeholder="Pet Name" required />
      <input name="pet_type" placeholder="Dog / Cat" required />
      <input name="location" placeholder="Last Seen Location" required />
      <input name="contact" placeholder="Contact Info" required />
      <input type="file" name="pet_image" />
      <textarea name="description" placeholder="Description" />

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      <p>{status}</p>
    </form>
  );
}
