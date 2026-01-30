import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";

const { fontFamily: outfit } = loadOutfit("normal", {
  subsets: ["latin"],
  weights: ["400", "600", "700"],
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const WidgetCard = ({
  x,
  y,
  rotation,
  startFrame,
  phaseOffset,
  offsetX,
  offsetY,
  width,
  height,
  src,
  render,
  alwaysVisible = false,
}: {
  x: number;
  y: number;
  rotation: number;
  startFrame: number;
  phaseOffset?: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  src: string;
  render?: (localFrame: number) => React.ReactNode;
  alwaysVisible?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = alwaysVisible ? frame : frame - startFrame;
  const entrance = alwaysVisible
    ? 1
    : spring({
        frame: localFrame,
        fps,
        config: {
          damping: 28,
          stiffness: 160,
          mass: 0.9,
        },
      });
  const entranceProgress = clamp(entrance, 0, 1);
  const stableWindow = frame >= 90 && frame <= 150;
  const phase = phaseOffset ?? startFrame;
  const baseFloat = Math.sin((frame + phase) / 14) * 6;
  const baseWobble = Math.cos((frame + phase) / 40) * 1.5;
  const float = stableWindow ? 0 : baseFloat;
  const wobble = stableWindow ? 0 : baseWobble;
  const rotationDrift = ((frame + phase) / (fps * 2)) * 2.5;
  const opacity = alwaysVisible
    ? 1
    : interpolate(localFrame, [0, fps * 0.6], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
  const translateX = alwaysVisible ? 0 : offsetX * (1 - entranceProgress);
  const translateY = alwaysVisible ? 0 : offsetY * (1 - entranceProgress);
  const scale = alwaysVisible ? 1 : 0.8 + 0.2 * entranceProgress;
  const contentFloat = stableWindow
    ? 0
    : Math.sin((frame + phase) / 18) * 2.2;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `translate(-50%, -50%) translate(${translateX}px, ${translateY + float}px) scale(${scale}) rotate(${rotation + wobble + rotationDrift}deg)`,
        opacity,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 20,
          padding: 14,
          background: "#1b1c21",
          boxShadow: "0 18px 32px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 14,
            overflow: "hidden",
            position: "relative",
            transform: `translateY(${contentFloat}px)`,
          }}
        >
          {render ? (
            render(localFrame)
          ) : (
            <Img
              src={staticFile(src)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              opacity: 0.5,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const HorizontalBarChart = ({
  values,
  localFrame,
  fps,
}: {
  values: number[];
  localFrame: number;
  fps: number;
}) => {
  const maxValue = Math.max(...values);
  const staggerFrames = fps * 0.1;
  const growFrames = fps * 0.5;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 8,
        padding: "4px 8px",
      }}
    >
      {values.map((value, index) => {
        const barStart = index * staggerFrames;
        const progress = interpolate(
          localFrame,
          [barStart, barStart + growFrames],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );
        const widthPercent = (value / maxValue) * 100 * progress;
        return (
          <div
            key={`hbar-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 10,
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${widthPercent}%`,
                  height: "100%",
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg, #ffb347 0%, #ff8b3d 55%, #ff6d2a 100%)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
                }}
              />
            </div>
            <div
              style={{
              fontSize: 14,
                color: "rgba(255,255,255,0.7)",
                width: 44,
                textAlign: "right",
              }}
            >
              {value.toFixed(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const StackedBarChart = ({
  localFrame,
  fps,
}: {
  localFrame: number;
  fps: number;
}) => {
  const columns = [
    [0.35, 0.25, 0.2, 0.2],
    [0.25, 0.3, 0.2, 0.25],
    [0.3, 0.2, 0.25, 0.25],
    [0.2, 0.3, 0.3, 0.2],
    [0.25, 0.25, 0.3, 0.2],
  ];
  const colors = ["#f55b57", "#ff9b3d", "#5fd08e", "#5aa9ff"];
  const staggerFrames = fps * 0.1;
  const growFrames = fps * 0.6;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 10,
        padding: "8px 12px",
      }}
    >
      {columns.map((segments, index) => {
        const columnStart = index * staggerFrames;
        const progress = interpolate(
          localFrame,
          [columnStart, columnStart + growFrames],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );
        return (
          <div
            key={`stack-${index}`}
            style={{
              width: 22,
              height: "100%",
              display: "flex",
              flexDirection: "column-reverse",
              gap: 4,
              transform: `scaleY(${progress})`,
              transformOrigin: "bottom",
            }}
          >
            {segments.map((segment, segmentIndex) => (
              <div
                key={`segment-${segmentIndex}`}
                style={{
                  height: `${segment * 100}%`,
                  borderRadius: 6,
                  background: colors[segmentIndex],
                  boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};

const CandlestickGraph = ({
  localFrame,
  fps,
}: {
  localFrame: number;
  fps: number;
}) => {
  const data = [
    { open: 92, high: 108, low: 86, close: 102 },
    { open: 102, high: 114, low: 98, close: 110 },
    { open: 110, high: 118, low: 104, close: 106 },
    { open: 106, high: 112, low: 96, close: 99 },
    { open: 99, high: 111, low: 94, close: 109 },
    { open: 109, high: 116, low: 101, close: 112 },
    { open: 112, high: 120, low: 108, close: 115 },
    { open: 115, high: 122, low: 109, close: 111 },
    { open: 111, high: 118, low: 103, close: 105 },
    { open: 105, high: 112, low: 98, close: 100 },
  ];

  const width = 220;
  const height = 120;
  const paddingX = 12;
  const paddingY = 14;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;
  const minValue = 86;
  const maxValue = 122;

  const reveal = interpolate(localFrame, [0, fps * 2.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const valueToY = (value: number) =>
    paddingY + ((maxValue - value) / (maxValue - minValue)) * usableHeight;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12,
        overflow: "hidden",
        background: "#11161c",
      }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%" }}>
        <rect x="0" y="0" width={width} height={height} fill="#11161c" />
        <path
          d={`M ${paddingX} ${paddingY + usableHeight * 0.25} H ${width - paddingX}`}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />
        <path
          d={`M ${paddingX} ${paddingY + usableHeight * 0.5} H ${width - paddingX}`}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />
        <path
          d={`M ${paddingX} ${paddingY + usableHeight * 0.75} H ${width - paddingX}`}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />
        {data.map((candle, index) => {
          const candleStart = index * fps * 0.12;
          const candleProgress = interpolate(
            localFrame,
            [candleStart, candleStart + fps * 0.6],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );
          const x =
            paddingX + (index / (data.length - 1)) * usableWidth;
          const bodyWidth = 10;
          const bodyTop = valueToY(Math.max(candle.open, candle.close));
          const bodyBottom = valueToY(Math.min(candle.open, candle.close));
          const wickTop = valueToY(candle.high);
          const wickBottom = valueToY(candle.low);
          const currentBodyTop = bodyBottom - (bodyBottom - bodyTop) * candleProgress;
          const currentWickTop = bodyBottom - (bodyBottom - wickTop) * candleProgress;
          const currentWickBottom =
            bodyBottom + (wickBottom - bodyBottom) * candleProgress;
          const isUp = candle.close >= candle.open;
          const color = isUp ? "#7CC776" : "#F2495C";

          return (
            <g key={`candle-${index}`} opacity={reveal}>
              <line
                x1={x}
                x2={x}
                y1={currentWickTop}
                y2={currentWickBottom}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <rect
                x={x - bodyWidth / 2}
                y={currentBodyTop}
                width={bodyWidth}
                height={Math.max(3, bodyBottom - currentBodyTop)}
                rx={2}
                fill={color}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const CpuGaugeWidget = ({
  localFrame,
  fps,
  title,
  start,
  end,
  accent,
  delayFrames = 0,
}: {
  localFrame: number;
  fps: number;
  title: string;
  start: number;
  end: number;
  accent: string;
  delayFrames?: number;
}) => {
  const progress = spring({
    frame: Math.max(0, localFrame - delayFrames),
    fps,
    config: {
      damping: 24,
      stiffness: 140,
      mass: 0.8,
    },
  });
  const eased = clamp(progress, 0, 1);
  const percent = interpolate(eased, [0, 1], [start, end], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arcProgress = clamp(percent / 100, 0, 1);
  const float = Math.sin((localFrame + delayFrames) / 12) * 2.5;
  const entrance = interpolate(eased, [0, 1], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(eased, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "10px 12px",
        boxSizing: "border-box",
        background: "#11161c",
        borderRadius: 14,
        border: "1px solid #1f2630",
        transform: `translateY(${float}px) scale(${entrance})`,
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#f0f4fa",
          letterSpacing: 0.2,
        }}
      >
        {title}
      </div>
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 200 120"
          style={{ width: "100%", height: "100%" }}
        >
          <path
            d="M 20 96 A 70 70 0 0 1 180 96"
            fill="none"
            stroke="#1b222c"
            strokeWidth={12}
            strokeLinecap="round"
          />
          <path
            d="M 20 96 A 70 70 0 0 1 180 96"
            fill="none"
            stroke={accent}
            strokeWidth={12}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - arcProgress}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "58%",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 24,
            fontWeight: 600,
            color: accent,
          }}
        >
          {percent.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

const CpuGaugePair = ({
  localFrame,
  fps,
}: {
  localFrame: number;
  fps: number;
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        gap: 10,
      }}
    >
      <CpuGaugeWidget
        localFrame={localFrame}
        fps={fps}
        title="CPU Requests usage"
        start={20}
        end={70}
        accent="rgba(87, 148, 242, 0.95)"
        delayFrames={0}
      />
      <CpuGaugeWidget
        localFrame={localFrame}
        fps={fps}
        title="CPU Limits usage"
        start={28}
        end={62}
        accent="rgba(124, 199, 118, 0.95)"
        delayFrames={Math.round(fps * 0.2)}
      />
    </div>
  );
};

const StorageGauge = ({
  localFrame,
  fps,
}: {
  localFrame: number;
  fps: number;
}) => {
  const progress = spring({
    frame: localFrame,
    fps,
    config: {
      damping: 22,
      stiffness: 120,
      mass: 0.9,
    },
  });
  const eased = clamp(progress, 0, 1);
  const value = interpolate(eased, [0, 1], [42, 93.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const max = 120;
  const ratio = clamp(value / max, 0, 1);
  const arcGlow = interpolate(eased, [0, 1], [0, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gradientId = "storage-gauge-gradient";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <svg viewBox="0 0 200 120" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6fdc6f" />
            <stop offset="55%" stopColor="#ffb347" />
            <stop offset="100%" stopColor="#ff5b6b" />
          </linearGradient>
        </defs>
        <path
          d="M 20 96 A 80 80 0 0 1 180 96"
          fill="none"
          stroke="#1b222c"
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          d="M 20 96 A 80 80 0 0 1 180 96"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={14}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - ratio}
          style={{ filter: `drop-shadow(0 0 8px rgba(255,120,120,${arcGlow}))` }}
        />
      </svg>
      <div
        style={{
          marginTop: -42,
          textAlign: "center",
          fontSize: 28,
          fontWeight: 700,
          color: "#ff5b6b",
          letterSpacing: 0.2,
        }}
      >
        {value.toFixed(1)} GB
      </div>
      <div
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.6)",
          marginTop: -4,
        }}
      >
        sda6
      </div>
    </div>
  );
};

export const DrilldownRemoval: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleOpacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contentOpacity = interpolate(frame, [fps * 0.8, fps * 1.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gearRotation = (frame / (fps * 10)) * 360;
  const gearScale = interpolate(frame, [0, fps * 1.2], [2.2, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const gearOpacity = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const loaderFade = interpolate(frame, [fps * 1.6, fps * 2.0], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoEnter = interpolate(frame, [fps * 1.4, fps * 2.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headline = "I just joined";
  const typeStart = Math.round(fps * 1.0);
  const typeEnd = typeStart + Math.round(fps * 1.2);
  const typedCount = Math.floor(
    interpolate(frame, [typeStart, typeEnd], [0, headline.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const typedHeadline = headline.slice(0, typedCount);

  const topLeftStart = Math.round(fps * 1.0);
  const topRightStart = Math.round(fps * 1.2);
  const midLeftStart = Math.round(fps * 1.3);
  const bottomLeftStart = Math.round(fps * 1.4);
  const midRightStart = Math.round(fps * 1.5);
  const bottomRightStart = Math.round(fps * 1.6);
  const gaugeLocalFrame = frame - midRightStart;
  const gaugeX = interpolate(
    gaugeLocalFrame,
    [0, fps * 1.4],
    [1260, 1340],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily: outfit,
        backgroundImage:
          "linear-gradient(135deg, #f6d37a 0%, #f2a14a 58%, #ef8d3a 100%)",
        color: "#0f0f0f",
      }}
    >
      <Audio src={staticFile("Graf/honey-kisses-413841.mp3")} volume={0.6} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.32) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.28) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), rgba(255,255,255,0) 55%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.18), rgba(0,0,0,0) 60%)",
        }}
      />

      <div style={{ opacity: contentOpacity }}>
        <Sequence>
          <WidgetCard
            x={20}
            y={60}
            rotation={12}
            startFrame={0}
            phaseOffset={topLeftStart}
            offsetX={-220}
            offsetY={0}
            width={260}
            height={150}
            src=""
            alwaysVisible
            render={(localFrame) => (
              <HorizontalBarChart
                values={[78.9, 78.0, 66.6, 21.7, 70.5]}
                localFrame={localFrame}
                fps={fps}
              />
            )}
          />
        </Sequence>
        <Sequence>
          <WidgetCard
            x={1260}
            y={60}
            rotation={-12}
            startFrame={0}
            phaseOffset={topRightStart}
            offsetX={220}
            offsetY={0}
            width={260}
            height={150}
            src=""
            alwaysVisible
            render={(localFrame) => (
              <StackedBarChart localFrame={localFrame} fps={fps} />
            )}
          />
        </Sequence>
        <Sequence>
          <WidgetCard
            x={40}
            y={330}
            rotation={8}
            startFrame={0}
            phaseOffset={midLeftStart}
            offsetX={-200}
            offsetY={0}
            width={240}
            height={140}
            src="Graf/grafana_table.webp"
            alwaysVisible
          />
        </Sequence>
        <Sequence>
          <WidgetCard
            x={gaugeX}
            y={330}
            rotation={-8}
            startFrame={0}
            phaseOffset={midRightStart}
            offsetX={260}
            offsetY={0}
            width={380}
            height={170}
            src=""
            alwaysVisible
            render={(localFrame) => (
              <CpuGaugePair localFrame={localFrame} fps={fps} />
            )}
          />
        </Sequence>
        <Sequence>
        <WidgetCard
          x={150}
          y={670}
          rotation={10}
          startFrame={0}
          phaseOffset={bottomLeftStart}
          offsetX={0}
          offsetY={220}
          width={260}
          height={150}
          src=""
          alwaysVisible
          render={(localFrame) => (
            <CandlestickGraph localFrame={localFrame} fps={fps} />
          )}
        />
      </Sequence>
      <Sequence>
        <WidgetCard
          x={1130}
          y={670}
          rotation={-10}
          startFrame={0}
          phaseOffset={bottomRightStart}
          offsetX={0}
          offsetY={-220}
          width={260}
          height={150}
          src=""
          alwaysVisible
          render={(localFrame) => (
            <StorageGauge localFrame={localFrame} fps={fps} />
          )}
        />
      </Sequence>
      </div>

      <Sequence>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 900,
              opacity: titleOpacity * contentOpacity,
            }}
          >
            {typedHeadline}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              maxWidth: 700,
              opacity: subtitleOpacity * contentOpacity,
            }}
          >
            Data Source and AI 
          </div>
          <div
            style={{
              opacity: gearOpacity * loaderFade,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${gearRotation}deg) scale(${gearScale})`,
            }}
          >
            <Img
              src={staticFile("Graf/blackGraf.webp")}
              style={{
                width: 88,
                height: 88,
                objectFit: "contain",
                filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
              }}
            />
          </div>
          <div
            style={{
              opacity: subtitleOpacity * contentOpacity * logoEnter,
              transform: `translateY(${interpolate(logoEnter, [0, 1], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
              marginTop: -6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={staticFile("Graf/Grafana_actual.svg")}
              style={{
                width: 300,
                height: 64,
                objectFit: "contain",
                filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))",
              }}
            />
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
