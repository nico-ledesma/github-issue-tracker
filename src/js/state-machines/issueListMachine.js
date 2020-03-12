import { Machine } from './Machine';

/**
 * Issue list machine representation,
 * used to keep state and execute side-effects
 */
export const issueListMachine = new Machine({
  context: {
    currentMember: 'all',
    members: [],
    issues: [],
  },
  initial: 'starting',
  states: {
    starting: {
      on: {
        FETCH: 'loading',
      },
    },
    loading: {
      on: {
        SUCCESS: {
          target: 'idle',
          actions: ['renderMembers'],
        },
        ERROR: 'failure',
      },
      entry: ['showLoader', 'fetchData'],
      exit: ['hideLoader'],
    },
    idle: {
      on: {
        FILTER: {
          target: 'idle',
          actions: ['updateCurrentMember'],
        },
        IS_EMPTY: 'empty',
      },
      entry: ['renderIssues'],
    },
    empty: {
      on: {
        FILTER: {
          target: 'idle',
          actions: ['updateCurrentMember'],
        },
      },
      entry: ['showEmptyMessage'],
      exit: ['hideEmptyMessage'],
    },
    failure: {
      on: {
        RETRY: 'loading',
      },
      entry: ['showError'],
      exit: ['hideError'],
    },
  },
});
