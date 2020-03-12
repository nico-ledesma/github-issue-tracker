import anime from 'animejs';

/** */
export function show(el) {
  return anime({
    targets: el,
    opacity: 1,
    duration: 500,
    easing: 'easeOutQuad',
    begin: () => anime.set(el, { display: 'block' }),
  });
}

/** */
export function hide(el) {
  return anime({
    targets: el,
    opacity: 0,
    duration: 500,
    easing: 'easeOutQuad',
    complete: () => anime.set(el, { display: 'none' }),
  });
}
