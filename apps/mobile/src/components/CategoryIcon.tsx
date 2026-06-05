import {
  Apple,
  BookOpen,
  Car,
  ChartNoAxesColumnIncreasing,
  CircleEllipsis,
  Gamepad2,
  Gift,
  HeartPulse,
  House,
  Phone,
  ShoppingBag,
  Utensils,
  Wallet,
  type LucideIcon
} from "lucide-react-native";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  apple: Apple,
  book: BookOpen,
  car: Car,
  chart: ChartNoAxesColumnIncreasing,
  gamepad: Gamepad2,
  gift: Gift,
  heart: HeartPulse,
  home: House,
  more: CircleEllipsis,
  phone: Phone,
  shopping: ShoppingBag,
  utensils: Utensils,
  wallet: Wallet
};

type Props = {
  name: string;
  color: string;
  size?: number;
};

export function CategoryIcon({ name, color, size = 24 }: Props) {
  const Icon = CATEGORY_ICONS[name] ?? CircleEllipsis;
  return <Icon color={color} size={size} strokeWidth={2.3} />;
}
