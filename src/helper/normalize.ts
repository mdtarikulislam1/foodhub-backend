export const normalizeName = (name: string, forSlug = false): string => {
  let normalized = name.trim().toLowerCase();

  if (forSlug) {
    normalized = normalized.replace(/\s+/g, "-").replace(/-+/g, "-");
  }

  return normalized;
};
