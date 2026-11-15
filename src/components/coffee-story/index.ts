// @ts-nocheck
const CHAPTERS = [
  { tag: 'الفصل الأول: الطحن', title: ['القهوة الرائعة', 'تبدأ من هنا'], text: 'نحمّص حبوبنا على دفعات صغيرة، ونطحنها قبل الشحن بساعات لتصلك النكهة كما خرجت من المحمصة.', btn: 'تسوّق الحبوب' },
  { tag: 'الفصل الثاني: السكب', title: ['دقة في', 'كل سكبة'], text: 'ماء بحرارة ٩٤ درجة، وسكب دائري بطيء. ست دقائق من الهدوء تصنع فنجانًا لا يُنسى.', btn: 'أدوات التحضير' },
  { tag: 'الفصل الثالث: الرشفة', title: ['لحظتك', 'المثالية'], text: 'رائحة الهيل، وطعم الكراميل، وبقية صباحك تتحسّن. اطلب الآن واستلم خلال يومين.', btn: 'اطلب فنجانك' },
];

const ART = [
  '<svg viewBox="0 0 300 300"><ellipse cx="150" cy="150" rx="98" ry="130" transform="rotate(25 150 150)" fill="#5a3320"/><path d="M118 36C168 90 100 160 160 218C185 244 192 262 190 270" stroke="#2a150b" stroke-width="9" fill="none" stroke-linecap="round"/></svg>',
  '<svg viewBox="0 0 300 340"><path d="M158 20V128" stroke="#e3a867" stroke-width="5"/><path d="M70 120H230L190 190H110Z" fill="#d9c3a0"/><path d="M150 190V232" stroke="#6b3a1f" stroke-width="5"/><path d="M90 232H210L232 320H68Z" fill="#cfd8d8" opacity=".25" stroke="#e8dccb" stroke-width="2"/><path d="M76 285H224L232 320H68Z" fill="#6b3a1f"/></svg>',
  '<svg viewBox="0 0 320 300"><path d="M70 150H250C250 215 220 250 160 250C100 250 70 215 70 150Z" fill="#a8896a"/><ellipse cx="160" cy="150" rx="90" ry="16" fill="#3a1f10"/><path d="M248 165C290 160 290 215 238 222" stroke="#a8896a" stroke-width="14" fill="none" stroke-linecap="round"/><ellipse cx="160" cy="262" rx="120" ry="14" fill="#7a5a3c"/></svg>',
];

const STYLE = `
  :host { display: block; }
  .stage { position: relative; height: 100vh; min-height: 560px; overflow: hidden; transition: background .8s, color .8s; background: #efe2cf; color: #24160f; direction: rtl; font-family: 'Amiri', 'Traditional Arabic', serif; }
  .stage.c1 { background: #1b110c; color: #efe2cf; }
  .stage.c2 { background: #2a1a12; color: #efe2cf; }
  .stage::before { content: ''; position: absolute; inset: 8% 4%; border: 1px solid #c08350; opacity: .45; border-radius: 4px; pointer-events: none; }
  .chap { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 4vw; padding: 0 9vw; opacity: 0; visibility: hidden; transition: opacity .7s, visibility .7s; }
  .chap.on { opacity: 1; visibility: visible; }
  small { color: #c08350; font: 400 15px sans-serif; display: block; margin-bottom: 10px; }
  h2 { font-size: clamp(38px, 7vw, 92px); line-height: 1.15; margin: 0 0 18px; font-weight: 700; }
  p { max-width: 34ch; font: 400 clamp(15px, 1.5vw, 19px) / 1.8 sans-serif; margin: 0 0 26px; opacity: .85; }
  a { display: inline-block; border: 1px solid currentColor; padding: 10px 28px; border-radius: 99px; color: inherit; text-decoration: none; font: 500 15px sans-serif; }
  a:hover { background: #c08350; border-color: #c08350; color: #24160f; }
  .art { display: flex; justify-content: center; }
  svg { width: min(42vw, 52vh); height: auto; filter: drop-shadow(0 30px 40px rgba(0,0,0,.4)); }
  .dots { position: absolute; left: 3vw; top: 50%; transform: translateY(-50%); display: grid; gap: 12px; z-index: 2; }
  .dots button { width: 9px; height: 9px; padding: 0; border: 0; border-radius: 50%; background: #c08350; opacity: .4; cursor: pointer; transition: .4s; }
  .dots button.on { opacity: 1; height: 24px; border-radius: 6px; }
  @media (max-width: 760px) {
    .chap { grid-template-columns: 1fr; align-content: center; gap: 2vh; }
    .art { order: -1; }
    svg { width: min(60vw, 32vh); }
  }
`;

export default class CoffeeStory extends HTMLElement {
  connectedCallback() {
    this._c = 0;
    const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
    const dots = CHAPTERS.map((c, i) => `<button data-i="${i}" aria-label="${c.tag}"></button>`).join('');
    const chaps = CHAPTERS.map(
      (c, i) => `<div class="chap"><div><small>${c.tag}</small><h2>${c.title[0]}<br>${c.title[1]}</h2><p>${c.text}</p><a href="#">${c.btn}</a></div><div class="art">${ART[i]}</div></div>`
    ).join('');
    root.innerHTML = `<style>${STYLE}</style><div class="stage"><div class="dots">${dots}</div>${chaps}</div>`;
    this._root = root;
    const stage = root.querySelector('.stage');

    this._go = (i) => {
      const n = CHAPTERS.length;
      this._c = (i + n) % n;
      stage.className = 'stage c' + this._c;
      root.querySelectorAll('.chap').forEach((el, k) => el.classList.toggle('on', k === this._c));
      root.querySelectorAll('.dots button').forEach((el, k) => el.classList.toggle('on', k === this._c));
    };
    this._stop = () => clearInterval(this._t);
    this._start = () => {
      this._stop();
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this._t = setInterval(() => this._go(this._c + 1), 6000);
    };

    root.querySelectorAll('.dots button').forEach((b) =>
      b.addEventListener('click', () => {
        this._go(Number(b.dataset.i));
        this._start();
      })
    );
    let x0 = null;
    stage.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) {
        this._go(this._c + (dx < 0 ? 1 : -1));
        this._start();
      }
    });
    stage.addEventListener('mouseenter', this._stop);
    stage.addEventListener('mouseleave', this._start);

    this._go(0);
    this._start();
  }

  disconnectedCallback() {
    if (this._stop) this._stop();
  }
}
