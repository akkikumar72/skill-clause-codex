import { useCurrentFrame, useVideoConfig } from "remotion";

type TerminalCursorProps = {
  isTyping: boolean;
};

export const TerminalCursor = ({ isTyping }: TerminalCursorProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const blinkOn = Math.floor(frame / (0.55 * fps)) % 2 === 0;
  const opacity = isTyping ? 1 : blinkOn ? 1 : 0;

  return (
    <span
      style={{
        width: 10,
        height: 20,
        borderRadius: 2,
        backgroundColor: "#1f2328",
        opacity,
      }}
    />
  );
};
