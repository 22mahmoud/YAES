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
