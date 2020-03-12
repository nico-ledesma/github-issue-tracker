import moment from 'moment/src/moment';
import { getWeekdays } from '../util/date';

const WEIGHTS = {
  'Critical Priority': 1000,
  'High Priority' : 50,
  'Mid Priority': 20,
  'Low Priority': 10,
  'default': 10,
};

export function calculateScore(issue) {
  const weights = issue.labels
    .filter(label => typeof WEIGHTS[label.name] !== 'undefined')
    .map(label => WEIGHTS[label.name]);

  // Use default weight if there were no weight-labels
  const weight = weights.length ? Math.max(weights) : WEIGHTS['default'];

  // Get weekdays from creation to now
  const now = moment();
  const creationDate = moment(issue.created_at);
  const weekdays = getWeekdays(creationDate, now);

  // Avoid zero-score issues when weekdays < 1
  const multiplier = weekdays || 1;

  return weight * multiplier;
}
