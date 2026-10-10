import { Bot, Clapperboard, Globe, Share2, Smartphone, TrendingUp, Workflow, type LucideIcon } from 'lucide-react'

/** One icon per service id, shared by the capability list and the home strip. */
export const SERVICE_ICON: Record<string, LucideIcon> = {
  web: Globe,
  software: Workflow,
  mobile: Smartphone,
  ai: Bot,
  video: Clapperboard,
  marketing: TrendingUp,
  social: Share2,
}
