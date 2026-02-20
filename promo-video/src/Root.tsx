import { Composition } from "remotion";
import { ThemeleonPromo } from "./ThemeleonPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ThemeleonPromo"
        component={ThemeleonPromo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
