import { Controller } from 'stimulus';
import anime from 'animejs';

/**
 * Controller
 */
export default class extends Controller {
  /** */
  get initialY() {
    return this.element.dataset.initialY === 'false'
      ? false
      : parseInt(this.element.dataset.initialY);
  }

  /**
   * Connect controller
   * Enter DOM with a FLIP animation
   */
  connect() {
    const { initialY } = this;
    const finalY = this.element.getBoundingClientRect().top;
    const deltaY = initialY ? initialY - finalY : 0;
    const initialOpacity = this.initialY ? 1 : 0;

    anime({
      targets: this.element,
      translateY: [deltaY, 0],
      easing: 'spring(1, 3000, 20, 0)',
      opacity: {
        value: [initialOpacity, 1],
        duration: 500,
        easing: 'easeInQuad',
      },
    });
  }
}
