import {
  AbsoluteFill,
  Sequence,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SkillsLogos } from "./SkillsLogos";

export const SkillsReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleDuration = 2 * fps;
  const titleProgress = spring({
    fps,
    frame,
    config: {
      damping: 120,
      stiffness: 220,
      mass: 1.1,
    },
  });
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleTranslate = interpolate(titleProgress, [0, 1], [18, 0]);
  const titleScale = interpolate(frame, [0, 0.5 * fps], [0.96, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const logoFrame = Math.max(0, frame - titleDuration);
  const logoProgress = spring({
    fps,
    frame: logoFrame,
    config: {
      damping: 120,
      stiffness: 220,
      mass: 1.1,
    },
  });
  const logoOpacity = interpolate(logoProgress, [0, 1], [0, 1]);
  const logoScale = interpolate(logoProgress, [0, 1], [0.92, 1]);

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={titleDuration}>
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily:
                "GT Planar, 'GT Planar Text', 'GT Planar Trial', 'Helvetica Neue', Arial, sans-serif",
              fontSize: 80,
              fontWeight: 500,
              color: "#1f2328",
              textAlign: "center",
              letterSpacing: -0.5,
              opacity: titleOpacity,
              transform: `translateY(${titleTranslate}px) scale(${titleScale})`,
            }}
          >
            Agent Skill Now Available.
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sequence from={titleDuration}>
        <AbsoluteFill
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <SkillsLogos />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
