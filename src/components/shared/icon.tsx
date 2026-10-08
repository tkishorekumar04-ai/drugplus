import {
  Activity, Atom, Award, BadgeCheck, Baby, Beaker, Bone, Boxes, Brain, ClipboardCheck, Droplet, Droplets, Ear, Eye, Factory,
  FlaskConical, Globe, HandHeart, Handshake, HeartPulse, Layers, Leaf, Megaphone, Microscope, Package, Pill, PillBottle,
  Salad, ShieldCheck, Sparkles, Stethoscope, Syringe, Tablets, Target, TestTubes, Thermometer, Truck, Venus, Warehouse, Wind,
  type LucideIcon, type LucideProps,
} from "lucide-react";

/** Icon keys stored in the database (categories, therapeutic areas) map to line icons here. */
export const ICONS: Record<string, LucideIcon> = {
  activity: Activity, atom: Atom, award: Award, badge: BadgeCheck, baby: Baby, beaker: Beaker, bone: Bone, boxes: Boxes,
  brain: Brain, clipboard: ClipboardCheck, droplet: Droplet, droplets: Droplets, ear: Ear, eye: Eye, factory: Factory,
  flask: FlaskConical, globe: Globe, care: HandHeart, handshake: Handshake, heart: HeartPulse, layers: Layers, leaf: Leaf,
  megaphone: Megaphone, microscope: Microscope, package: Package, pill: Pill, bottle: PillBottle, gut: Salad, shield: ShieldCheck,
  sparkles: Sparkles, stethoscope: Stethoscope, syringe: Syringe, tablets: Tablets, target: Target, tubes: TestTubes,
  thermometer: Thermometer, truck: Truck, venus: Venus, warehouse: Warehouse, wind: Wind,
};

export const ICON_KEYS = Object.keys(ICONS).sort();

export function Icon({ name, ...props }: { name?: string | null } & Omit<LucideProps, "name">) {
  const Cmp = (name && ICONS[name]) || Pill;
  return <Cmp aria-hidden="true" strokeWidth={1.6} {...props} />;
}
