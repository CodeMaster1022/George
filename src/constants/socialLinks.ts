export type SocialLinkId = "facebook" | "instagram" | "linkedin" | "whatsapp" | "email";

export type SocialLink = {
  id: SocialLinkId;
  label: string;
  /** Iconify icon name, e.g. "mdi:facebook" */
  icon: string;
  /**
   * Full URL (https://...), "mailto:...", or WhatsApp "https://wa.me/<number>".
   * Leave empty for now; icons will auto-hide until you add a link.
   */
  href: string;
};

/**
 * Fill these in later. Icons will show automatically once hrefs are set.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  { id: "facebook", label: "Facebook", icon: "mdi:facebook", href: "" },
  { id: "instagram", label: "Instagram", icon: "mdi:instagram", href: "" },
  { id: "linkedin", label: "LinkedIn", icon: "mdi:linkedin", href: "" },
  { id: "whatsapp", label: "WhatsApp", icon: "mdi:whatsapp", href: "" },
  { id: "email", label: "Email", icon: "mdi:email", href: "" },
];

export function getSocialLinks() {
  return SOCIAL_LINKS;
}

