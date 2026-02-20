export type SocialLinkId = "facebook" | "instagram" | "linkedin" | "tiktok" | "whatsapp" | "email";

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
 * Mock social links for development. Replace hrefs with real URLs for production.
 */
export const SOCIAL_LINKS: SocialLink[] = [
  { id: "facebook", label: "Facebook", icon: "mdi:facebook", href: "https://www.facebook.com/example" },
  { id: "instagram", label: "Instagram", icon: "mdi:instagram", href: "https://www.instagram.com/example" },
  { id: "linkedin", label: "LinkedIn", icon: "mdi:linkedin", href: "https://www.linkedin.com/company/example" },
  { id: "tiktok", label: "TikTok", icon: "fa6-brands:tiktok", href: "https://www.tiktok.com/@example" },
  { id: "whatsapp", label: "WhatsApp", icon: "mdi:whatsapp", href: "https://wa.me/1234567890" },
  { id: "email", label: "Email", icon: "mdi:email", href: "mailto:contact@example.com" }];

export function getSocialLinks() {
  return SOCIAL_LINKS;
}

