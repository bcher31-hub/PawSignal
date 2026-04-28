import UploadForm from "./UploadForm";

export default function UploadSheet({ onClose }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.handle} />
        <UploadForm />
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(8px)",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#111827",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    animation: "slideUpPremium 0.28s ease",
  },

  handle: {
    width: 40,
    height: 5,
    background: "#555",
    borderRadius: 10,
    margin: "0 auto 10px",
  },
};
