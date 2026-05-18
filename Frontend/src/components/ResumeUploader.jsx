"use client";

import { useState } from "react";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import useResumeStore from "@/store/resumeStore";

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { setResumeData } = useResumeStore();
  const { token } = useAuth();

  const handleUpload = async () => {
    if (!file) { alert("Please select a resume"); return; }
    const authToken = token || localStorage.getItem("token");
    if (!authToken) { alert("Please login first."); return; }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", file);
      const res = await API.post("/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setResumeData(res.data.data);
      alert("Resume uploaded successfully");
    } catch (error) {
      console.log(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const getFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? "#0f0f0f" : file ? "#22c55e" : "#e5e7eb"}`,
          borderRadius: "14px",
          padding: "28px 20px",
          textAlign: "center",
          background: dragOver ? "#f5f5f5" : file ? "#f0fdf4" : "#fafafa",
          transition: "all 0.2s ease",
          cursor: "pointer",
          marginBottom: "14px",
        }}
        onClick={() => document.getElementById("resume-file-input").click()}
      >
        <input
          id="resume-file-input"
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Icon */}
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: file ? "#dcfce7" : "#f5f5f5",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px",
        }}>
          {file ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        {file ? (
          <div>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#15803d", margin: "0 0 2px" }}>
              File ready
            </p>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
              {file.name} · {getFileSize(file.size)}
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", margin: "0 0 2px" }}>
              Drop your resume here
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
              PDF or DOCX · click to browse
            </p>
          </div>
        )}
      </div>

      {/* File info pill + change */}
      {file && (
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: "10px", padding: "8px 14px", marginBottom: "14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: "12px", color: "#15803d", fontWeight: "600" }}>
              {file.name}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setFile(null); }}
            style={{
              fontSize: "11px", color: "#6b7280", background: "none",
              border: "none", cursor: "pointer", padding: "0",
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        style={{
          width: "100%",
          background: loading ? "#d1d5db" : !file ? "#f3f4f6" : "#0f0f0f",
          color: !file ? "#9ca3af" : "#fff",
          border: "none",
          borderRadius: "12px",
          padding: "13px",
          fontSize: "13px",
          fontWeight: "700",
          cursor: !file || loading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          letterSpacing: "0.01em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {loading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
            </svg>
            Analyzing resume...
          </>
        ) : (
          "Upload & Analyze →"
        )}
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}