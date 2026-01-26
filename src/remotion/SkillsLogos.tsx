import { AbsoluteFill, Img, staticFile } from "remotion";

const LogoPlus = () => (
  <div
    style={{
      fontSize: 72,
      fontWeight: 600,
      color: "#6f757c",
      lineHeight: 1,
    }}
  >
    +
  </div>
);

const OpenCodeMark = () => (
  <svg
    width={72}
    height={90}
    viewBox="0 0 32 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="OpenCode logo"
    role="img"
  >
    <g clipPath="url(#opencodeMarkClip)">
      <path d="M24 32H8V16H24V32Z" fill="#4B4646" />
      <path d="M24 8H8V32H24V8ZM32 40H0V0H32V40Z" fill="#F1ECEC" />
    </g>
    <defs>
      <clipPath id="opencodeMarkClip">
        <rect width="32" height="40" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const SkillsLogos = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#f5f6f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <Img
          src={staticFile("brand/remotion-logo.png")}
          style={{ height: 140, width: "auto" }}
        />
        <LogoPlus />
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Img
            src={staticFile("brand/claude-logo.svg")}
            style={{ height: 90, width: "auto" }}
          />
          <OpenCodeMark />
        </div>
      </div>
    </AbsoluteFill>
  );
};
