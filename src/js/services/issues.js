import moment from 'moment/src/moment';
import { calculateScore } from '../services/calculateScore';
import { getCollection } from '../util/fetch';
import { htmlToElement } from '../util/dom';
import { organization, repo } from '../../config.json';
import issueTpl from '../../views/components/issue.njk';

/**
 * Get all repository issues ordered by score
 * @returns {Promise} - Promise that resolves to an array of issues
 */
export async function getIssues() {
  const path = `/repos/${organization}/${repo}/issues`;
  const results = await getCollection(path, { state: 'open' });

  return results
    .filter(isIssue)
    .map(addMeta)
    .sort(sortByScore);
}

/**
 * Check if an item is an issue and not a pull request
 * @param {Object} issue
 * @returns {boolean}
 */
export function isIssue(issue) {
  return typeof issue.pull_request === 'undefined';
}

/**
 * Calculate and add custom issue meta
 * @param {Object} issue
 * @returns {Object} issue
 */
function addMeta(issue) {
  const now = moment();
  const creationDate = moment(issue.created_at);

  issue.daysAgo = now.diff(creationDate, 'days');
  issue.score = calculateScore(issue);

  return issue;
}

/**
 * Sort issues by score in descending order
 * @param {Object} issueA
 * @param {Object} issueB
 * @returns {number}
 */
function sortByScore(issueA, issueB) {
  if (issueA.score < issueB.score) return 1;
  if (issueA.score > issueB.score) return -1;
  return 0;
}

/**
 * Check if an issue is assigned to a user
 * @param {Object} issue
 * @param {string} user
 * @returns {boolean}
 */
export function hasAssignee(issue, user) {
  if (user === 'All') return true;

  if (user === 'None') return issue.assignees.length === 0;

  return issue.assignees.find(assignee => assignee.login === user);
}

/**
 * Create a DOM node for the issue view
 * @param {Object} issue
 * @param {Object} additionalContext
 */
export function issueToElement(issue, additionalContext) {
  const html = issueTpl.render({issue, ...additionalContext});

  return htmlToElement(html);
}
