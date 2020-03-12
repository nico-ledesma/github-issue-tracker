/**
 * Basic implementation of a finite state machine
 */
export class Machine {
  /**
   * Constructor
   * @param {Object} definition - Machine definition
   * @param {Object} actions    - Object mapping action names to function definitions
   */
  constructor(definition, actions) {
    this.context = definition.context || {};
    this.initial = definition.initial;
    this.states = definition.states;
    this.actions = actions;
  }

  /**
   * Pure function that determine the next state of the machine.
   * @param {string} originState
   * @param {string} event
   * @returns {Object} - Resulting machine state & actions that should be run by an interpreter
   */
  transition(originState, event) {
    const { states, actions } = this;
    const eventDefinition = states[originState].on[event];

    // Transition is not defined, so return the original state
    if (!eventDefinition) {
      return {
        state: originState,
        actions: [],
      };
    }

    // Get next state
    const finalState =
      typeof eventDefinition === 'string'
        ? eventDefinition
        : eventDefinition.target;

    // Get actions that should be triggered by an interpreter
    const exitActions = states[originState].exit || [];

    const transitionActions = states[originState].on[event].actions || [];

    const entryActions = states[finalState].entry || [];

    const actionsToRun = exitActions
      .concat(transitionActions)
      .concat(entryActions)
      .map(actionName => actions[actionName]);

    // Return next state representation
    return {
      state: finalState,
      actions: actionsToRun,
    };
  }

  /**
   * Create a new machine, extending current one with a new context
   * @param {Object} context
   * @returns {Object} - Extended machine
   */
  withContext(context) {
    const { initial, states, actions } = this;

    return new Machine({ context, initial, states }, actions);
  }

  /**
   * Create a new machine, extending current one with new action definitions
   * @param {Object} actions
   * @returns {Object} - Extended machine
   */
  withActions(actions) {
    const { context, initial, states } = this;

    return new Machine({ context, initial, states }, actions);
  }
}
