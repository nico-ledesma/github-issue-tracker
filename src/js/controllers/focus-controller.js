import { Controller } from 'stimulus';
import debounce from '../util/debounce';

/**
 * Apply focus only for keyboard navigation
 */
export default class extends Controller {
  /**
   * Initialize controller
   */
  initialize() {
    this.tabClass = this.data.get('tabClass') || 'user-is-tabbing';

    // Bind & debounce handlers
    this._handleFirstTab = debounce(this._handleFirstTab.bind(this), 250);
    this._handleMouseDownOnce = debounce(this._handleMouseDownOnce.bind(this), 250);

    // Start listening for Tab key press
    window.addEventListener('keydown', this._handleFirstTab);
  }

  /**
   * Add class when user first press Tab key,
   * start listening for click interaction
   */
  _handleFirstTab(e) {
    if (e.keyCode === 9) {
      this.element.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', this._handleFirstTab);
      window.addEventListener('mousedown', this._handleMouseDownOnce);
    }
  }

  /**
   * Remove class on click interaction,
   * start listening for Tab key press
   */
  _handleMouseDownOnce() {
    this.element.classList.remove('user-is-tabbing');
    window.removeEventListener('mousedown', this._handleMouseDownOnce);
    window.addEventListener('keydown', this._handleFirstTab);
  }
}
