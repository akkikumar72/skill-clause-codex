import { Composition } from "remotion";
import { TerminalPrompt } from "./TerminalPrompt";
import { TerminalMaster } from "./TerminalMaster";
import { SkillsLogos } from "./SkillsLogos";
import { DrilldownRemoval } from "./animations/drilldown-removal/DrilldownRemoval";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TerminalPrompt"
        component={TerminalPrompt}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={700}
      />
      <Composition
        id="TerminalMaster"
        component={TerminalMaster}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={700}
      />
      <Composition
        id="SkillsLogos"
        component={SkillsLogos}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={700}
      />
      <Composition
        id="DrilldownRemoval"
        component={DrilldownRemoval}
        durationInFrames={150}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
