import { useCurrentFrame, useVideoConfig } from "remotion";
import { TerminalCursor } from "./TerminalCursor";

export const TERMINAL_COMMAND = "npx skills add remotion-dev/skills";
export const TERMINAL_SECONDS_PER_CHAR = 0.06;
export const TERMINAL_SECONDS_PER_LINE = 0.05;
const ASCII_LINES = [
  "███████╗██╗  ██╗██╗██╗     ██╗     ███████╗",
  "██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝",
  "███████╗█████╔╝ ██║██║     ██║     ███████╗",
  "╚════██║██╔═██╗ ██║██║     ██║     ╚════██║",
  "███████║██║  ██╗██║███████╗███████╗███████║",
  "╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝",
];
const OUTPUT_LINES = [
  "Source: https://github.com/remotion-dev/skills.git",
  "Cloning repository...",
  "Repository cloned",
  "Found 1 skill",
  "Skill: remotion-best-practices",
  "Best practices for Remotion - Video creation in React",
];
export const TERMINAL_OUTPUT_LINE_COUNT =
  ASCII_LINES.length + 1 + OUTPUT_LINES.length;

export const TerminalContent = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const framesPerChar = TERMINAL_SECONDS_PER_CHAR * fps;
  const charsTyped = Math.min(
    TERMINAL_COMMAND.length,
    Math.floor(frame / framesPerChar)
  );
  const typedText = TERMINAL_COMMAND.slice(0, charsTyped);
  const isTyping = charsTyped < TERMINAL_COMMAND.length;
  const typingEndFrame = Math.ceil(TERMINAL_COMMAND.length * framesPerChar);
  const framesPerLine = TERMINAL_SECONDS_PER_LINE * fps;
  const outputLines = [...ASCII_LINES, "", ...OUTPUT_LINES];
  const visibleLineCount = Math.max(
    0,
    Math.min(
      outputLines.length,
      Math.floor((frame - typingEndFrame) / framesPerLine) + 1
    )
  );
  const showOutput = visibleLineCount > 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: "#3b3f45" }}>guest@macbook ~ %</span>
        <span>{typedText}</span>
        <TerminalCursor isTyping={isTyping} />
      </div>
      {showOutput ? (
        <div style={{ color: "#4b4f56", lineHeight: 1.4 }}>
          {outputLines.slice(0, visibleLineCount).map((line, index) => {
            const isAscii = index < ASCII_LINES.length;
            return isAscii ? (
              <pre
                key={`${line}-${index}`}
                style={{ margin: 0, color: "#9aa0a6", lineHeight: 1.1 }}
              >
                {line === "" ? " " : line}
              </pre>
            ) : (
              <div
                key={`${line}-${index}`}
                style={{ marginTop: line === "" ? 12 : 0 }}
              >
                {line === "" ? " " : line}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
