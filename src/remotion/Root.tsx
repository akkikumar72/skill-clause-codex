import { Composition } from "remotion";
import { TerminalPrompt } from "./TerminalPrompt";
import { TerminalMaster } from "./TerminalMaster";
import { SkillsLogos } from "./SkillsLogos";
import { DrilldownRemoval } from "./animations/drilldown-removal/DrilldownRemoval";
import {
  YouTubeLowerThird,
  YouTubeLowerThirdProps,
} from "./animations/youtube-lower-third/YouTubeLowerThird";

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
      <Composition
        id="YouTubeLowerThird"
        component={YouTubeLowerThird}
        durationInFrames={180}
        fps={30}
        width={1280}
        height={720}
        defaultProps={
          {
            name: "Remotion",
            subscriberCount: "2,300 subscribers",
            avatarUrl:
              "https://yt3.googleusercontent.com/U1odzKpyZw7s4kcP0O1LwLXqmvoho1jqVxZ7EABsT8IRIEuzTF4Vwu-cdq3387GmzmQq9Fxhi4c=s900-c-k-c0x00ffffff-no-rj",
            backgroundVideoUrl: "",
          } satisfies YouTubeLowerThirdProps
        }
      />
    </>
  );
};
