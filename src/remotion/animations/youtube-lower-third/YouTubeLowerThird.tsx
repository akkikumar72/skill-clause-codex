import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { Video } from "@remotion/media";

const { fontFamily: outfit } = loadOutfit("normal", {
  subsets: ["latin"],
  weights: ["400", "600", "700"],
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export type YouTubeLowerThirdProps = {
  name: string;
  subscriberCount: string;
  avatarUrl: string;
  backgroundVideoUrl?: string;
};

export const YouTubeLowerThird: React.FC<YouTubeLowerThirdProps> = ({
  name,
  subscriberCount,
  avatarUrl,
  backgroundVideoUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const showBackgroundVideo = Boolean(backgroundVideoUrl);

  const enterDuration = Math.round(fps * 0.7);
  const enterProgress = interpolate(frame, [0, enterDuration], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const outDuration = Math.round(fps * 0.7);
  const outStart = durationInFrames - outDuration - Math.round(fps * 0.2);
  const exitProgress = interpolate(
    frame,
    [outStart, outStart + outDuration],
    [1, 0],
    {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = enterProgress * exitProgress;
  const translateY = interpolate(enterProgress, [0, 1], [90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pressStart = Math.round(fps * 1.6);
  const pressDuration = Math.round(fps * 0.22);
  const releaseStart = pressStart + pressDuration;

  const pressProgress = interpolate(
    frame,
    [pressStart, releaseStart],
    [0, 1],
    {
      easing: Easing.out(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const pressedScale = interpolate(pressProgress, [0, 1], [1, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const releaseSpring = spring({
    frame: frame - releaseStart,
    fps,
    config: {
      damping: 12,
      stiffness: 200,
      mass: 0.7,
    },
  });
  const releasedScale = interpolate(releaseSpring, [0, 1], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const buttonScale = frame < releaseStart ? pressedScale : releasedScale;
  const isSubscribed = frame >= releaseStart;

  const lowerThirdWidth = 860;
  const lowerThirdHeight = 140;

  return (
    <AbsoluteFill style={{ fontFamily: outfit, backgroundColor: "transparent" }}>
      {showBackgroundVideo ? (
        <Video
          src={backgroundVideoUrl as string}
          muted
          loop
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <AbsoluteFill style={{ backgroundColor: "#0b0b0b" }} />
      )}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 70,
          width: lowerThirdWidth,
          height: lowerThirdHeight,
          transform: `translate(-50%, 0) translateY(${translateY}px)`,
          opacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 28,
            background: "#ffffff",
            boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "20px 28px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid #ffffff",
              boxShadow: "0 8px 16px rgba(0,0,0,0.18)",
              flexShrink: 0,
            }}
          >
            <Img
              src={avatarUrl}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 38,
                fontWeight: 700,
                color: "#111111",
                letterSpacing: 0.2,
              }}
            >
              {name}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 20,
                fontWeight: 500,
                color: "#5b5b5b",
              }}
            >
              {subscriberCount}
            </div>
          </div>
          <div
            style={{
              width: 184,
              height: 44,
              borderRadius: 22,
              background: "#0f0f0f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: 0.2,
              transform: `scale(${clamp(buttonScale, 0.9, 1.05)})`,
              boxShadow: "0 8px 18px rgba(0,0,0,0.2)",
            }}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
