import { UPLOAD_BASE_URL } from "../config/env";

export const FALLBACK_SITE_LOGO = "/FallbackLogo.jpg";

export const resolveSiteLogoSrc = (value = "", { fallback = FALLBACK_SITE_LOGO } = {}) => {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }
  return `${UPLOAD_BASE_URL}/${raw.replace(/^\/+/, "")}`;
};
