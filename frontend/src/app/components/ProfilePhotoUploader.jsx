"use client";

import { useEffect, useState } from "react";
import {
  uploadProfilePhotos,
  listProfilePhotos,
  deleteProfilePhoto,
} from "@/lib/api/profilePhotos";

export default function ProfilePhotoUploader() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [photos, setPhotos] = useState([]);
  const BACKEND = "http://127.0.0.1:8000";

  async function refreshPhotos() {
    const existing = await listProfilePhotos();
    const normalized = existing.map((p) => ({
      ...p,
      image: p.image?.startsWith("http") ? p.image : `${BACKEND}${p.image}`,
    }));
    setPhotos(normalized);
  }

  useEffect(() => {
    refreshPhotos().catch(console.error);
  }, []);

  async function handleChange(e) {
    setMsg("");
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (files.length === 0) return;

    try {
      setLoading(true);
      await uploadProfilePhotos(files);

      await refreshPhotos();

      setMsg("Uploaded!");
    } catch (err) {
      setMsg("Upload failed. Check console + backend logs.");
      console.error(err);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProfilePhoto(id);
      await refreshPhotos();
    } catch (e) {
      console.error(e);
      setMsg("Delete failed.");
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ fontWeight: 600, marginBottom: 8 }}>
        Profile Photos ({photos.length}/10)
      </h3>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        disabled={loading || photos.length >= 10}
      />

      <div style={{ marginTop: 8 }}>{loading ? "Uploading..." : msg}</div>

      {photos.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {photos.map((p) => (
            <div key={p.id} style={{ position: "relative" }}>
              <img
                src={p.image}
                alt="profile"
                style={{
                  width: 90,
                  height: 90,
                  objectFit: "cover",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.15)",
                }}
              />
              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
                title="Delete"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
