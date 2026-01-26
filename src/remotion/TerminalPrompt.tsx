import { AbsoluteFill } from "remotion";
import { TerminalContent } from "./TerminalContent";

export const TerminalPrompt = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        fontFamily:
          "SF Mono, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      }}
    >
      <div
        style={{
          width: 1100,
          height: 640,
          backgroundColor: "#ffffff",
          borderRadius: 18,
          border: "1px solid #d7d9dd",
          boxShadow:
            "0 24px 60px rgba(15, 23, 42, 0.18), 0 8px 16px rgba(15, 23, 42, 0.08)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: 44,
            backgroundColor: "#f0f1f4",
            borderBottom: "1px solid #d7d9dd",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            fontSize: 14,
            fontWeight: 600,
            color: "#6b6f76",
            letterSpacing: 0.2,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                backgroundColor: "#ff5f57",
                border: "1px solid #d04a45",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                backgroundColor: "#febc2e",
                border: "1px solid #d19a26",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                backgroundColor: "#28c840",
                border: "1px solid #1ea333",
              }}
            />
          </div>
          <div>Terminal</div>
          <div style={{ width: 56 }} />
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: "#fbfbfc",
            padding: "28px 32px",
            display: "flex",
            alignItems: "flex-start",
            color: "#1f2328",
            fontSize: 30,
          }}
        >
          <TerminalContent />
        </div>
      </div>
    </AbsoluteFill>
  );
};
