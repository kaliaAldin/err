export function animateCircleWithRAF(circle, targetRadius, targetOpacity, duration = 700) {
  const startTime = performance.now();
  const initialRadius = 0;
  const initialOpacity = 0;

  function step(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const currentRadius = initialRadius + progress * targetRadius;
    const currentOpacity = initialOpacity + progress * targetOpacity;

    circle.setStyle({ fillOpacity: currentOpacity });
    circle.setRadius(currentRadius);

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export function animateLineWithRAF(line, targetOpacity, duration = 2000) {
  const startTime = performance.now();
  const initialOpacity = 0;

  function step(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const currentOpacity = initialOpacity + progress * targetOpacity;

    line.setStyle({ opacity: currentOpacity });

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
