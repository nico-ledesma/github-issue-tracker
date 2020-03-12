/**
 * Check if a date is a saturday
 * @param {Object} date - Moment.js date object
 * @returns {boolean}
 */
export const isSaturday = date => date.isoWeekday() === 6;

/**
 * Check if a date is a sunday
 * @param {Object} date - Moment.js date object
 * @returns {boolean}
 */
export const isSunday = date => date.isoWeekday() === 7;

/**
 * Check if a date is a saturday or sunday
 * @param {Object} date - Moment.js date object
 * @returns {boolean}
 */
export const isWeekend = date => isSaturday(date) || isSunday(date);

/**
 * If date is a weekend, returns a new date representing the next weekday start
 * @param {Object} date - Moment.js date object
 * @returns {Object}    - Moment.js date object
 */
export const toNextWeekday = date => {
  const _date = date.clone();

  if (!isWeekend(_date)) return _date;

  if (isSaturday(_date)) _date.add(2, 'days');
  if (isSunday(_date)) _date.add(1, 'days');

  return _date.startOf('day');
};

/**
 * If date is a weekend, returns a new date representing the previous weekday end
 * @param {Object} date - Moment.js date object
 * @returns {Object}    - Moment.js date object
 */
export const toPreviousWeekday = date => {
  const _date = date.clone();

  if (!isWeekend(_date)) return _date;

  if (isSaturday(_date)) _date.subtract(1, 'days');
  if (isSunday(_date)) _date.subtract(2, 'days');

  return _date.endOf('day');
};

/**
 * Get the number of weekdays between two days.
 * If the end date is lower than the start date, the returned value is zero.
 * @param {*} start  - Moment.js date object
 * @param {*} end    - Moment.js date object
 * @returns {number}
 */
export const getWeekdays = (start, end) => {
  const _start = toNextWeekday(start);
  const _end = toPreviousWeekday(end);

  if (_end.isSameOrBefore(_start)) return 0;

  let days = _end.diff(_start, 'days');
  let counter = 0;
  let date;

  while (counter >= 0) {
    date = _start.clone().add(counter, 'days');

    if (isWeekend(date)) days--;

    counter = date.isSame(_end, 'day') ? -1 : counter + 1;
  }

  return days;
};
