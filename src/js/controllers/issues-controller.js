import { Controller } from 'stimulus';
import { interpret } from '../state-machines/Interpreter';
import { issueListMachine } from '../state-machines/issueListMachine';
import { getMembers, memberToOption } from '../services/members';
import { getIssues, hasAssignee, issueToElement } from '../services/issues';
import { getQueryParam } from '../util/url';
import { show, hide } from '../util/animations';

/**
 * Controller
 */
export default class extends Controller {
  /** */
  static get targets() {
    return ['memberSelector', 'list', 'issue', 'loader', 'emptyMessage', 'errorMessage'];
  }

  /**
   * Initialize controller
   */
  initialize() {
    const machineWithActions = issueListMachine.withActions({
      renderMembers: context => this._renderMembers(context),
      showLoader: () => this._show(this.loaderTarget, 'loader'),
      hideLoader: () => this._hide(this.loaderTarget, 'loader'),
      fetchData: context => this._fetchData(context),
      updateCurrentMember: (context, payload) => context.currentMember = payload.member,
      renderIssues: context => this._renderIssues(context),
      showEmptyMessage: () => this._show(this.emptyMessageTarget, 'empty'),
      hideEmptyMessage: () => this._hide(this.emptyMessageTarget, 'empty'),
      showError: () => this._show(this.errorMessageTarget, 'error'),
      hideError: () => this._hide(this.errorMessageTarget, 'error'),
    });

    this.service = interpret(machineWithActions);
    this.animations = {};

    this.service.send('FETCH');
  }

  /**
   * Filter issues by member
   */
  filter(e) {
    const member = e.target.value;

    this.service.send('FILTER', { member })
  }

  /**
   * Retry data fetching
   */
  retry() {
    this.service.send('RETRY');
  }

  /**
   * Fetch GitHub data
   * @param {Object} context - Machine context
   */
  async _fetchData(context) {
    const { service } = this;
    let members;
    let issues;

    try {
      [members, issues] = await Promise.all([getMembers(), getIssues()]);
    } catch (error) {
      service.send('ERROR', error);
    }

    // Add "fake" member for 'None' option
    context.members = members.concat({ login: 'None' });

    context.issues = issues;

    service.send('SUCCESS');
  }

  /**
   * Render member options
   * @param {Object} context - Machine context
   */
  _renderMembers(context) {
    const { memberSelectorTarget } = this;
    const queryUser = getQueryParam('who');
    const queryUserisValid = context.members.find(member => member.login === queryUser);

    context.currentMember = (queryUser === 'None' || queryUserisValid)
      ? queryUser
      : 'All';

    context.members
      .map(member => {
        const isSelected = (member.login === context.currentMember);
        return memberToOption(member, isSelected);
      })
      .forEach(option => memberSelectorTarget.appendChild(option));
  }

  /**
   * Render issues assigned to the current member
   * @param {Object} context
   */
  _renderIssues(context) {
    const { listTarget, issueTargets, service } = this;

    // Filter issues by assignee
    const issuesToRender = context.issues
      .filter(issue => hasAssignee(issue, context.currentMember));

    // Store rendered issues positions for FLIP animations
    const initialYValues = issueTargets.reduce((obj, el) => {
      obj[el.dataset.issueNumber] = el.getBoundingClientRect().top;
      return obj;
    }, {});

    // Remove previous issues
    issueTargets.forEach(el => el.remove());

    // Append new issues
    issuesToRender.map(issue => {
        const additionalContext = {
          initialY: initialYValues[issue.number],
        };

        return issueToElement(issue, additionalContext);
      })
      .forEach(el => listTarget.appendChild(el));

    // If no issues were rendered, send signal to machine
    if (issuesToRender.length < 1) service.send('IS_EMPTY');
  }

  /**
   * Show an element
   * @param {Element} element - Element to show
   * @param {string} key      - Key used to store a reference to the animation
   */
  _show(element, key) {
    // Pause running animation
    if (this.animations[key]) this.animations[key].pause();

    this.animations[key] = show(element);
  }

  /**
   * Hide an element
   * @param {Element} element - Element to hide
   * @param {string} key      - Key used to store a reference to the animation
   */
  _hide(element, key) {
    // Pause running animation
    if (this.animations[key]) this.animations[key].pause();

    this.animations[key] = hide(element);
  }
}
