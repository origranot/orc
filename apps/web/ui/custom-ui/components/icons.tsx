import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  InfinityIcon,
  Command,
  CopyIcon,
  CreditCard,
  File,
  UsersIcon,
  MousePointerClick,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  LucideProps,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  FileQuestion,
  Settings,
  CodeIcon,
  SunMedium,
  Braces,
  Trash,
  User,
  Microscope,
  LayoutDashboard,
  ListOrdered,
  BrainCog,
  PackageSearch,
  ShieldCheck,
  ScanBarcode,
  StoreIcon,
  Menu,
  X,
  type IconNode as LucideIcon,
  ScanSearch,
  ShoppingBasket,
  HammerIcon,
  PackageOpen,
  InfoIcon,
  StickyNote,
  BadgeInfo,
  Mail,
  Home,
  AlertCircle,
  AArrowUp,
  Gift,
  Folder,
} from 'lucide-react';
import { FaAws, FaDigitalOcean, FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { SiKubernetes } from 'react-icons/si';

export type Icon = LucideIcon;

export const Icons = {
  basket: ShoppingBasket,
  scanSearch: ScanSearch,
  shield: ShieldCheck,
  package: PackageSearch,
  brain: BrainCog,
  badgeInfo: BadgeInfo,
  list: ListOrdered,
  logo: Command,
  close: X,
  store: StoreIcon,
  mail: Mail,
  home: Home,
  alertCircle: AlertCircle,
  hammer: HammerIcon,
  mousePointerClick: MousePointerClick,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  aArrowUp: AArrowUp,
  media: Image,
  note: StickyNote,
  copy: CopyIcon,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  info: InfoIcon,
  warning: AlertTriangle,
  user: User,
  microscope: Microscope,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  gift: Gift,
  fileQuestion: FileQuestion,
  packageOpen: PackageOpen,
  sun: SunMedium,
  dashboard: LayoutDashboard,
  braces: Braces,
  moon: Moon,
  menu: Menu,
  laptop: Laptop,
  api: CodeIcon,
  users: UsersIcon,
  scanBarcode: ScanBarcode,
  infinity: InfinityIcon,
  kubernetes: SiKubernetes,
  aws: FaAws,
  gcp: FaGoogle,
  azure: FaMicrosoft,
  digitalocean: FaDigitalOcean,
  google: ({ ...props }: LucideProps) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>Google</title>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
  twitter: X,
  check: Check,
  chrome: ({ ...props }: LucideProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  ),
  unknown: ({ ...props }) => <img src="/images/integrations/icons/unknown.png" alt="Unknown logo" {...props} />,
  folder: Folder,
};
