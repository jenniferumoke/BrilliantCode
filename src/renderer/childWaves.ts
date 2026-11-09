// Welcome-screen wave animation for the child pane.
// Moved out of an inline <script> so childIndex.html can use a strict CSP.
// @ts-nocheck
(function() {
  const canvas = document.getElementById('waves-canvas');
  if (!canvas) return;

  const charW = 7.2;
  const charH = 14;
  const chars = ' ·.,:;~-=≈░▒';
  let time = 0;
  let width, height;

  function resize() {
    width = Math.ceil(window.innerWidth / charW) + 2;
    height = Math.ceil(window.innerHeight / charH) + 2;
  }

  resize();
  window.addEventListener('resize', resize);

  function render() {
    let output = '';
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const wave1 = Math.sin((x * 0.08) + (y * 0.03) + time * 0.5);
        const wave2 = Math.sin((x * 0.12) + time * 0.35 + 2);
        const wave3 = Math.sin((x * 0.05) + (y * 0.06) - time * 0.2 + 1);
        const wave4 = Math.cos((x * 0.15) - (y * 0.02) + time * 0.7);
        const combined = wave1 + wave2 * 0.7 + wave3 * 1.2 + wave4 * 0.5;
        const normalized = (combined + 3.4) / 6.8;
        const charIndex = Math.floor(normalized * (chars.length - 1));
        output += chars[Math.max(0, Math.min(chars.length - 1, charIndex))];
      }
      output += '\n';
    }
    canvas.textContent = output;
    time += 0.025;
    requestAnimationFrame(render);
  }

  render();
})();
