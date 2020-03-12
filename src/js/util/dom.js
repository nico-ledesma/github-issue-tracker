/**
 * Get a single DOM Node from an HTML string
 * @param {string} html - HTML representing a single element
 * @returns {Node}
 */
export const htmlToElement = html => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();

  return template.content.firstChild;
}
