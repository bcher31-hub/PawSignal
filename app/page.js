export default function Home() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif" }}>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <h1 style={styles.h1}>🐾 PawSignal</h1>
        <h2 style={styles.tagline}>Bring them home faster.</h2>

        <p style={styles.subtext}>
          A real-time community network that helps lost pets get found faster
          using live alerts, maps, and local volunteers.
        </p>

        <div style={styles.buttonRow}>
          <button style={styles.primaryBtn}>Join Waitlist</button>
          <button style={styles.secondaryBtn}>See How It Works</button>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section style={styles.sectionDark}>
        <h2>Every minute matters when a pet is lost.</h2>

        <p>
          Flyers are slow. Social media posts get buried. Most pets are found
          within 24–48 hours—but only if people nearby know quickly.
        </p>

        <div style={styles.statsRow}>
          <div>🐶 10M+ pets lost yearly</div>
          <div>⏱ Most found in first 24 hours</div>
          <div>📉 Traditional methods are too slow</div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section style={styles.section}>
        <h2>Meet PawSignal</h2>

        <p>
          PawSignal turns every phone into a live search network for lost pets.
        </p>

        <ul>
          <li>📍 Real-time lost pet map</li>
          <li>🚨 Instant neighborhood alerts</li>
          <li>👀 Crowd-powered sightings</li>
          <li>🔔 Location-based notifications</li>
        </ul>
      </section>

      {/* APP PREVIEW */}
      <section style={styles.sectionDark}>
        <h2>Live Map + Alerts</h2>

        <div style={styles.mockPhone}>
          <p>📱 App Preview</p>
          <p>🟥 Lost pet near you</p>
          <p>📍 0.8 miles away</p>
          <p>👀 3 sightings reported</p>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section style={styles.section}>
        <h2>Built for communities, not algorithms.</h2>

        <p>
          No ads. No noise. Just real people helping bring pets home.
        </p>

        <div style={styles.trustGrid}>
          <div>🛡 Verified sightings</div>
          <div>📍 GPS accuracy</div>
          <div>🚫 Anti-spam protection</div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={styles.cta}>
        <h2>Be part of the network that brings pets home.</h2>

        <button style={styles.primaryBtnLarge}>
          Join the PawSignal Waitlist
        </button>

        <p style={{ marginTop: 10, opacity: 0.8 }}>
          Launching soon in select cities.
        </p>
      </section>

    </main>
  );
}
