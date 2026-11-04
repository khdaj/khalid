import { Composition } from "remotion";
import { NinjaAd } from "./NinjaAd";

export const Root = () => (
  <Composition id="NinjaAd" component={NinjaAd} durationInFrames={450} fps={30} width={1080} height={1920} />
);
