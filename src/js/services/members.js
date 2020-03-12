import { getCollection } from '../util/fetch';
import { htmlToElement } from '../util/dom';
import { organization } from '../../config.json';
import memberOptionTpl from '../../views/components/member-option.njk';

/**
 * Get all the organization members
 * @returns {Array} - Array of member objects
 */
export async function getMembers() {
  const path = `/orgs/${organization}/members`;

  return getCollection(path);
}

/**
 * Create an <option> element from a member object
 * @param {Object} member
 * @param {boolean} isSelected
 */
export function memberToOption(member, isSelected) {
  const html = memberOptionTpl.render({member, isSelected});

  return htmlToElement(html);
}
