import PepsiArt from "./PepsiArt";
import MirindaArt from "./MirindaArt";
import SevenUpArt from "./SevenUpArt";
import MountainDewArt from "./MountainDewArt";
import StingArt from "./StingArt";
import AquafinaArt from "./AquafinaArt";

export type BrandArtComponent = (props: { className?: string }) => JSX.Element;

// Keyed by the same `brand` string used in src/lib/store.ts GAMES[].
// All artwork here is original — stylized bottle/can shapes with each
// brand's color palette and an abstract mark designed for this project,
// not a reproduction of any official logo or product photography.
export const BRAND_ART: Record<string, BrandArtComponent> = {
  Pepsi: PepsiArt,
  Mirinda: MirindaArt,
  "7UP": SevenUpArt,
  "Mountain Dew": MountainDewArt,
  Sting: StingArt,
  Aquafina: AquafinaArt
};

export { PepsiArt, MirindaArt, SevenUpArt, MountainDewArt, StingArt, AquafinaArt };
