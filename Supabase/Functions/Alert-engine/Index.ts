import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

export default async function handler(req: Request) {

  const { record } = await req.json();

  const pet = record;

  // STEP 1: get all users
  const { data: users } = await supabase.from("users").select("*");

  if (!users) return new Response("No users");

  const alerts = [];

  for (const user of users) {

    const distance = getDistance(
      user.lat,
      user.lng,
      pet.latitude,
      pet.longitude
    );

    if (distance <= (user.alert_radius || 10)) {
      alerts.push({
        pet_id: pet.id,
        user_id: user.id,
        message: `🐾 Lost ${pet.name} spotted near you`,
        distance
      });
    }
  }

  if (alerts.length > 0) {
    await supabase.from("alerts").insert(alerts);
  }

  return new Response("OK");
}

// geo helper
function getDistance(lat1:number, lon1:number, lat2:number, lon2:number) {
  const R = 3958.8;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)**2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}
