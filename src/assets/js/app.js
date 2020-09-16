import confetti from 'canvas-confetti';

const fireworks = () =>
  confetti.create(document.getElementById('canvas'), {
    resize: true,
    useWorker: true,
  })({ particleCount: 200, spread: 200 });

document.querySelector('button').addEventListener('click', () => {
  fireworks();
});

fireworks();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      /* eslint-disable */
      .then(() => {
        console.log('sw.js is loaded');
      })
      .catch(() => {});
    /* eslint-enable */
  });
}
