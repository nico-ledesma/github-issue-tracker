/**
 * Creates a service that interprets a Machine,
 * keeps track of the current state and executes side-effects (actions)
 */
export class Interpreter {
  /**
   * Constructor
   * @param {Object} machine
   */
  constructor(machine) {
    this.machine = machine;
    this.currentState = machine.initial;
  }

  /**
   * Trigger a machine transition
   * @param {string} event   - Event name
   * @param {Object} payload - Custom arguments passed to machine actions
   * @returns {string}       - Machine state
   */
  send(event, payload) {
    const { machine, currentState } = this;

    const transition = machine.transition(currentState, event);

    this.currentState = transition.state;

    transition.actions.forEach(action => action(machine.context, payload));

    return this.currentState;
  }
}

/**
 * Helper function used to simplify machine services creation
 * @param {Object} machine
 * @return {Object} - Interpreted machine (service)
 */
export const interpret = machine => new Interpreter(machine);
