/**
 * Return target/rel props for external links, or empty object for internal links.
 */
export function getExternalLinkProps(url) {
  if (!url || url.startsWith('/') || url.startsWith('#')) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
}
