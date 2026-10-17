import {
  Plane, Clapperboard, Megaphone, Music, Camera, Video, Scissors,
  Palette, Wand2, Calendar, Mic, Play, type LucideIcon,
} from "lucide-react";

// Identificadores definidos en schemaTypes/shared/icons.ts del Studio.
const serviceIcons: Record<string, LucideIcon> = {
  plane: Plane,
  clapperboard: Clapperboard,
  megaphone: Megaphone,
  music: Music,
  camera: Camera,
  video: Video,
  scissors: Scissors,
  palette: Palette,
  "wand-sparkles": Wand2,
  calendar: Calendar,
  mic: Mic,
  play: Play,
};

export function getServiceIcon(icon: string | null): LucideIcon {
  return icon && Object.prototype.hasOwnProperty.call(serviceIcons, icon) ? serviceIcons[icon] : Scissors;
}
