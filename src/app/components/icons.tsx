import {
  Wallet,
  MapPin,
  User,
  Users,
  Percent,
  Plus,
  Trash2,
  Edit,
  MoreVertical,
  Monitor,
} from "lucide-react";

export const Icons = {
  wallet: Wallet,
  mapPin: MapPin,
  user: User,
  users: Users,
  percentage: Percent,
  plus: Plus,
  trash: Trash2,
  edit: Edit,
  moreVertical: MoreVertical,
  monitor: Monitor,
  spinner: ({ ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};
