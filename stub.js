// Заглушка: «Знак» с главной сайта (sign.js – копия site/public/assets/js/sign.js, обновляется при выкладке).
// Точки собираются в фирменный «!», потом по кругу в фигуры рутины, которую забирают агенты, и снова в «!».
// Курсор расталкивает точки, щелчок разбрасывает, фигуру можно крутить мышью или пальцем.
(() => {
  const cv = document.querySelector('.field');
  if (!cv || !window.Sign) return;
  const hero = document.querySelector('.hero');
  const sign = window.Sign.create(cv, {
    host: hero, interactive: true, start: 'mark', count: innerWidth < 700 ? 1500 : 3200,
    frame: (W, H) => (W >= 900
      ? { ox: W * 0.75, oy: H * 0.47, S: Math.min(W * 0.16, H * 0.29) }
      : { ox: W * 0.5, oy: H * 0.2, S: Math.min(W * 0.3, H * 0.12) }),
  });
  const ORDER = ['loop', 'report', 'mark', 'contract', 'post', 'mark', 'summary', 'chain', 'mark'];
  let i = -1, hover = false;
  setInterval(() => { if (!hover && !document.hidden) { i = (i + 1) % ORDER.length; sign.morph(ORDER[i]); } }, 4200);
  const btn = document.querySelector('.btn');
  btn?.addEventListener('pointerenter', () => { hover = true; sign.morph('mark'); });
  btn?.addEventListener('pointerleave', () => { hover = false; });
})();
