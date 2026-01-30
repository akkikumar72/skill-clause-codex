import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TERMINAL_COMMAND,
  TERMINAL_OUTPUT_LINE_COUNT,
  TERMINAL_SECONDS_PER_CHAR,
  TERMINAL_SECONDS_PER_LINE,
} from "./TerminalContent";
import { TerminalPrompt } from "./TerminalPrompt";
import { SkillsReveal } from "./SkillsReveal";

export const TerminalMaster = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, height } = useVideoConfig();
  const rotateY = interpolate(frame, [0, durationInFrames - 1], [10, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleUp = interpolate(frame, [0, durationInFrames - 1], [1, 1.03], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const typingEndFrame = Math.ceil(
    TERMINAL_COMMAND.length * TERMINAL_SECONDS_PER_CHAR * fps
  );
  const outputEndFrame =
    typingEndFrame +
    Math.ceil((TERMINAL_OUTPUT_LINE_COUNT - 1) * TERMINAL_SECONDS_PER_LINE * fps);
  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 16,
      stiffness: 180,
      mass: 1,
    },
  });
  const flipStartFrame = outputEndFrame;
  const flipProgressRaw = spring({
    fps,
    frame: Math.max(0, frame - flipStartFrame),
    config: {
      damping: 14,
      stiffness: 160,
      mass: 1,
    },
  });
  const flipProgress = Math.min(1, Math.max(0, flipProgressRaw));
  const translateY = interpolate(entrance, [0, 1], [height * 0.7, 0]);
  const entranceZ = interpolate(entrance, [0, 1], [-120, 40]);
  const entranceScale = interpolate(entrance, [0, 1], [0.96, 1.02]);
  const flipRotateX = interpolate(flipProgress, [0, 1], [0, 55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flipTranslateZ = interpolate(flipProgress, [0, 1], [0, 90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const terminalOpacity = interpolate(flipProgress, [0, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#FFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 1400,
      }}
    >
      <Sequence
        from={flipStartFrame}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <SkillsReveal />
      </Sequence>
      <Sequence
        style={{
          width: "100%",
          height: "100%",
          zIndex: 1,
          opacity: terminalOpacity,
          transform: `translateY(${translateY}px) translateZ(${
            entranceZ + flipTranslateZ
          }px) rotateX(${20 + flipRotateX}deg) rotateY(${rotateY}deg) scale(${
            scaleUp * entranceScale
          })`,
          transformOrigin: "50% 100%",
          transformStyle: "preserve-3d",
        }}
      >
        <TerminalPrompt />
      </Sequence>
    </AbsoluteFill>
  );
};
