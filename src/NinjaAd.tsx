import { useLayoutEffect, useRef } from "react";
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import gsap from "gsap";

const F = staticFile("fonts");
const CSS = `
@font-face { font-family: "Cairo"; font-weight: 800; src: url("${F}/cairo-arabic-800-normal.woff2") format("woff2"); unicode-range: U+0600-06FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFF; }
@font-face { font-family: "Cairo"; font-weight: 800; src: url("${F}/cairo-latin-800-normal.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }
@font-face { font-family: "Cairo"; font-weight: 900; src: url("${F}/cairo-arabic-900-normal.woff2") format("woff2"); unicode-range: U+0600-06FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFF; }
@font-face { font-family: "Cairo"; font-weight: 900; src: url("${F}/cairo-latin-900-normal.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }

      
      
      
      
      :root { --teal: #39C1CB; --navy: #0B2B33; --sun: #FFE14D; --deep: #1B8F9B; --glow: #6EE0E8; }
      .stage * { margin: 0; padding: 0; box-sizing: border-box; }
      .stage { width: 1080px; height: 1920px; overflow: hidden; position: relative; background: var(--teal); font-family: "Cairo", sans-serif; font-weight: 900; color: #fff; direction: rtl; }
      .fill { position: absolute; left: 0; top: 0; width: 1080px; height: 1920px; }
      .abs { position: absolute; }
      .t { text-align: center; left: 0; width: 1080px; white-space: nowrap; line-height: 1.1; }
      #bg { background: radial-gradient(1100px 1100px at 50% 55%, var(--glow) 0%, var(--teal) 50%, var(--deep) 100%); z-index: 0; }
      #bg2 { z-index: 0; background: #fff; opacity: 0; }
      #rays { z-index: 1; left: -420px; top: -200px; width: 1920px; height: 2300px; background: repeating-conic-gradient(from 0deg at 50% 52%, rgba(255,255,255,.16) 0deg 7deg, rgba(255,255,255,0) 7deg 18deg); }
      #decor { z-index: 2; overflow: hidden; }
      .sl { position: absolute; height: 6px; border-radius: 3px; background: rgba(255,255,255,.3); }
      .scene { z-index: 5; }
      #flash { z-index: 50; background: #fff; opacity: 0; }
      /* S1 hook */
      #s1-a { top: 190px; font-size: 215px; line-height: 1; }
      #s1-b { top: 395px; font-size: 265px; line-height: 1; color: var(--sun); text-shadow: 0 10px 0 rgba(11,43,51,.35); }
      #s1-ninja { left: 190px; top: 700px; width: 699px; height: 1226px; z-index: 3; }
      #s1-slash { left: -200px; top: 880px; width: 1500px; height: 26px; border-radius: 13px; background: #fff; z-index: 6; }
      /* S2 products */
      #s2-logo { left: 430px; top: 180px; width: 220px; height: 70px; }
      #s2-title { top: 262px; font-size: 100px; }
      .card { top: 400px; width: 450px; height: 640px; border-radius: 64px; background: #fff; color: var(--navy); box-shadow: 0 34px 70px rgba(11,43,51,.3); overflow: hidden; }
      #p1 { left: 540px; } #p2 { left: 90px; }
      .card svg { position: absolute; left: 45px; top: 24px; width: 360px; height: 330px; }
      .pname { position: absolute; left: 0; width: 450px; top: 358px; text-align: center; font-size: 52px; line-height: 1.15; white-space: nowrap; }
      .pnew { position: absolute; left: 0; width: 450px; top: 428px; text-align: center; font-size: 112px; line-height: 1; color: var(--deep); white-space: nowrap; }
      .pold { position: absolute; left: 0; width: 450px; top: 560px; text-align: center; font-size: 50px; line-height: 1; color: #8AA3A9; white-space: nowrap; }
      .pold i { position: absolute; left: 105px; top: 26px; width: 240px; height: 6px; background: #E5484D; border-radius: 3px; }
      #s2-ninja { left: 190px; top: 1100px; width: 699px; height: 1226px; z-index: 1; }
      /* S3 combo */
      #s3-old { top: 290px; font-size: 130px; color: rgba(255,255,255,.9); }
      #s3-strike { left: 330px; top: 372px; width: 420px; height: 14px; border-radius: 7px; background: var(--navy); }
      #s3-new { top: 470px; font-size: 310px; line-height: 1; }
      #s3-cur { top: 790px; font-size: 120px; color: var(--navy); }
      #s3-save { left: 200px; top: 960px; width: 680px; height: 170px; border-radius: 85px; background: var(--sun); color: var(--navy); font-size: 90px; display: flex; align-items: center; justify-content: center; white-space: nowrap; box-shadow: 0 26px 50px rgba(11,43,51,.28); }
      #s3-ninja { left: 190px; top: 1260px; width: 699px; height: 1226px; z-index: 1; }
      /* S4 speed */
      #s4-a { top: 330px; font-size: 150px; color: var(--navy); }
      #s4-b { top: 510px; font-size: 250px; line-height: 1; color: #fff; text-shadow: 0 10px 0 rgba(11,43,51,.3); }
      #s4-c { top: 860px; font-size: 76px; color: var(--navy); font-weight: 800; }
      #s4-ninja { left: 190px; top: 1020px; width: 699px; height: 1226px; z-index: 1; }
      /* S5 CTA */
      #s5-logo { left: 170px; top: 230px; width: 740px; height: 235px; }
      #s5-tag { top: 520px; font-size: 72px; color: var(--navy); }
      #s5-btn { left: 170px; top: 680px; width: 740px; height: 160px; border-radius: 80px; background: var(--teal); color: #fff; font-size: 80px; display: flex; align-items: center; justify-content: center; white-space: nowrap; box-shadow: 0 26px 50px rgba(27,143,155,.45); z-index: 4; }
      #s5-ninja { left: 190px; top: 960px; width: 699px; height: 1226px; z-index: 1; }
    
`;

export const NinjaAd = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const ref = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Build the paused GSAP timeline once, then seek it from Remotion's frame.
  useLayoutEffect(() => {
    const root = ref.current as HTMLElement;
    const ctx = gsap.context(() => {
      const ctxSet = gsap.set;
      const tl = gsap.timeline({ paused: true });
      const AR = "٠١٢٣٤٥٦٧٨٩";
      const arNum = (v) => v.toFixed(2).replace(/\d/g, (d) => AR[+d]).replace(".", "٫");
      const hide = (sel) => ctxSet(sel, { opacity: 0 });
      const reveal = (sel, from, to, at) =>
        tl.fromTo(sel, Object.assign({ opacity: 0 }, from), Object.assign({ opacity: 1, immediateRender: false }, to), at);

      // decor: rotating rays and speed lines
      tl.fromTo("#rays", { rotation: 0 }, { rotation: 40, duration: 11, ease: "none" }, 0);
      const decor = root.querySelector("#decor") as HTMLElement;
      const bursts = [0, 2.2, 5.4, 8.6];
      for (let i = 0; i < 12; i++) {
        const d = document.createElement("div");
        d.className = "sl"; d.id = "sl" + i;
        d.style.top = ((i * 157 + 90) % 1800) + "px";
        d.style.width = 240 + ((i * 61) % 360) + "px";
        d.style.left = "-700px";
        decor.appendChild(d);
        bursts.forEach((b, k) => tl.fromTo("#sl" + i, { x: 0 }, { x: 2000, duration: 0.8 + ((i + k) % 3) * 0.12, ease: "none" }, b + (i % 4) * 0.12));
      }

      // ---- S1: hook (everything visible at frame 0) ----
      tl.fromTo("#s1-ninja", { scale: 1.12, transformOrigin: "50% 100%" }, { scale: 1, duration: 0.25, ease: "power4.out" }, 0);
      tl.fromTo("#s1-a", { scale: 1.06 }, { scale: 1, duration: 0.2, ease: "power4.out" }, 0);
      tl.fromTo("#s1-b", { scale: 1.08 }, { scale: 1, duration: 0.25, ease: "back.out(2)" }, 0.05);
      ctxSet("#s1-slash", { rotation: -14, transformOrigin: "100% 50%", opacity: 0 });
      ctxSet("#flash", { opacity: 0 });
      tl.fromTo("#s1-slash", { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 1, duration: 0.14, ease: "power4.out", immediateRender: false }, 0.95);
      tl.fromTo("#flash", { opacity: 0.85 }, { opacity: 0, duration: 0.14, ease: "power2.out", immediateRender: false }, 0.95);
      tl.fromTo("#s1-ninja", { x: 0 }, { x: -30, duration: 0.9, ease: "sine.inOut", immediateRender: false }, 1.05);
      tl.to(["#s1-a", "#s1-b", "#s1-slash"], { scale: 1.25, opacity: 0, filter: "blur(12px)", duration: 0.22, ease: "power3.in", stagger: 0.02 }, 1.88);
      tl.to("#s1-ninja", { x: -900, rotation: -8, opacity: 1, duration: 0.25, ease: "power3.in" }, 1.92);

      // ---- S2: products ----
      hide(["#s2-logo", "#s2-title", "#p1", "#p2", "#s2-ninja"]);
      reveal("#s2-logo", { y: -40 }, { y: 0, duration: 0.3, ease: "power3.out" }, 2.3);
      reveal("#s2-title", { y: -60, filter: "blur(10px)" }, { y: 0, filter: "blur(0px)", duration: 0.3, ease: "power4.out" }, 2.3);
      reveal("#s2-ninja", { x: 800, y: 120, rotation: 8 }, { x: 0, y: 0, rotation: 0, duration: 0.45, ease: "power4.out" }, 2.2);
      reveal("#p1", { y: 900, rotation: 12, scale: 0.6 }, { y: 0, rotation: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 2.5);
      reveal("#p2", { y: 900, rotation: -12, scale: 0.6 }, { y: 0, rotation: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 3.0);
      tl.fromTo("#p1 .pnew", { scale: 1 }, { scale: 1.15, duration: 0.12, ease: "power2.out", immediateRender: false }, 3.55);
      tl.to("#p1 .pnew", { scale: 1, duration: 0.2, ease: "back.out(3)" }, 3.67);
      tl.fromTo("#p2 .pnew", { scale: 1 }, { scale: 1.15, duration: 0.12, ease: "power2.out", immediateRender: false }, 3.85);
      tl.to("#p2 .pnew", { scale: 1, duration: 0.2, ease: "back.out(3)" }, 3.97);
      tl.to(["#s2-logo", "#s2-title", "#p1", "#p2", "#s2-ninja"], { opacity: 0, y: -80, duration: 0.2, ease: "power3.in", stagger: 0.02 }, 5.15);

      // ---- S3: combo ----
      hide(["#s3-old", "#s3-strike", "#s3-new", "#s3-cur", "#s3-save", "#s3-ninja"]);
      reveal("#s3-old", { y: -50 }, { y: 0, duration: 0.3, ease: "power3.out" }, 5.45);
      reveal("#s3-strike", { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power4.out" }, 5.75);
      reveal("#s3-new", { scale: 0.7 }, { scale: 1, duration: 0.25, ease: "power3.out" }, 5.6);
      reveal("#s3-cur", { y: 30 }, { y: 0, duration: 0.3, ease: "power3.out" }, 5.8);
      const pv = { v: 24.9 };
      tl.fromTo(pv, { v: 24.9 }, { v: 15.9, duration: 0.9, ease: "power3.out", onUpdate: () => { root.querySelector("#s3-new").textContent = arNum(pv.v); } }, 5.6);
      tl.to("#s3-new", { color: "#FFE14D", duration: 0.05 }, 6.55);
      tl.fromTo("#s3-new", { scale: 1 }, { scale: 1.12, duration: 0.1, ease: "power2.out", immediateRender: false }, 6.55);
      tl.to("#s3-new", { scale: 1, duration: 0.2, ease: "back.out(3)" }, 6.65);
      reveal("#s3-save", { scale: 0.3, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2.6)" }, 7.1);
      reveal("#s3-ninja", { y: 500 }, { y: 0, duration: 0.45, ease: "back.out(1.4)" }, 6.9);
      tl.to(["#s3-old", "#s3-strike", "#s3-new", "#s3-cur", "#s3-save", "#s3-ninja"], { opacity: 0, scale: 0.92, duration: 0.2, ease: "power3.in" }, 8.4);

      // ---- S4: speed (ninja dashes through) ----
      hide(["#s4-a", "#s4-b", "#s4-c", "#s4-ninja"]);
            reveal("#s4-a", { x: 400, filter: "blur(14px)" }, { x: 0, filter: "blur(0px)", duration: 0.3, ease: "power4.out" }, 8.7);
      reveal("#s4-b", { scale: 1.7 }, { scale: 1, duration: 0.28, ease: "power4.out" }, 9.0);
      reveal("#s4-c", { y: 40 }, { y: 0, duration: 0.3, ease: "power3.out" }, 9.45);
      reveal("#s4-ninja", { x: 1300 }, { x: 0, duration: 0.45, ease: "power4.out" }, 8.62);
      tl.to("#s4-ninja", { x: -1300, duration: 0.3, ease: "power3.in" }, 10.62);
      tl.to(["#s4-a", "#s4-b", "#s4-c"], { opacity: 0, scale: 1.1, duration: 0.18, ease: "power3.in", stagger: 0.02 }, 10.78);

      // ---- S5: CTA ----
      hide(["#s5-logo", "#s5-tag", "#s5-btn", "#s5-ninja"]);
      tl.fromTo("#flash", { opacity: 1 }, { opacity: 0, duration: 0.25, ease: "power2.out", immediateRender: false }, 11.0);
      tl.fromTo("#bg2", { opacity: 0 }, { opacity: 1, duration: 0.05, immediateRender: false }, 11.0);
      reveal("#s5-logo", { scale: 1.7 }, { scale: 1, duration: 0.3, ease: "power4.out" }, 11.02);
      reveal("#s5-tag", { y: 50 }, { y: 0, duration: 0.3, ease: "power3.out" }, 11.5);
      reveal("#s5-btn", { y: 120, scale: 0.8 }, { y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }, 12.2);
      reveal("#s5-ninja", { y: 700 }, { y: 0, duration: 0.5, ease: "back.out(1.4)" }, 11.6);
      tl.to("#s5-btn", { scale: 1.06, duration: 0.25, ease: "power2.inOut" }, 13.0);
      tl.to("#s5-btn", { scale: 1, duration: 0.25, ease: "power2.inOut" }, 13.25);
      tl.to("#s5-btn", { scale: 1.06, duration: 0.25, ease: "power2.inOut" }, 13.7);
      tl.to("#s5-btn", { scale: 1, duration: 0.2, ease: "power2.inOut" }, 13.95);

      
      tlRef.current = tl;
      tl.seek(0);
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    tlRef.current?.seek(t, false);
  }, [t]);

  return (
    <div className="stage" ref={ref} dir="rtl">
      <style>{CSS}</style>
      <div id="bg" className="fill"></div>
      <div id="bg2" className="fill"></div>
      <div id="rays" style={{display: t<11 ? "block":"none"}} className="abs"></div>
      <div id="decor" className="fill"></div>

      
      <div id="s1" style={{display: t>=0 && t<2.2 ? "block":"none"}} className="fill scene">
        <img id="s1-ninja" className="abs" src={staticFile("ninja-char.png")} alt="" />
        <div id="s1-a" className="abs t">سهرتك</div>
        <div id="s1-b" className="abs t">وصلت!</div>
        <div id="s1-slash" className="abs"></div>
      </div>

      
      <div id="s2" style={{display: t>=2.2 && t<5.4 ? "block":"none"}} className="fill scene">
        <img id="s2-logo" className="abs" src={staticFile("ninja-logo-white.png")} alt="" />
        <div id="s2-title" className="abs t">شيبس + آيس كريم</div>
        <div id="p1" className="abs card">
          <svg viewBox="0 0 360 330">
            <path d="M70 30 L90 18 L110 30 L130 18 L150 30 L170 18 L190 30 L210 18 L230 30 L250 18 L270 30 L290 18 L290 40 L70 40 Z" fill="#E8890C" />
            <path d="M70 40 C40 120 40 220 70 300 L290 300 C320 220 320 120 290 40 Z" fill="url(#bagGrad)" />
            <path d="M70 300 L90 312 L110 300 L130 312 L150 300 L170 312 L190 300 L210 312 L230 300 L250 312 L270 300 L290 300 Z" fill="#E8890C" />
            <ellipse cx="180" cy="170" rx="92" ry="84" fill="#fff" />
            <ellipse cx="180" cy="170" rx="92" ry="84" fill="none" stroke="#FFC93C" strokeWidth="8" />
            <g fill="#FFC93C" stroke="#E8890C" strokeWidth="4"><ellipse cx="150" cy="150" rx="34" ry="24" transform="rotate(-20 150 150)" /><ellipse cx="205" cy="168" rx="34" ry="24" transform="rotate(25 205 168)" /><ellipse cx="170" cy="205" rx="34" ry="22" transform="rotate(-8 170 205)" /></g>
          </svg>
          <div className="pname">شيبس بالقشدة</div>
          <div className="pnew">٥٫٩٥</div>
          <div className="pold">١٠٫٩٥ ريال<i></i></div>
        </div>
        <div id="p2" className="abs card">
          <svg viewBox="0 0 360 330">
            <ellipse cx="180" cy="120" rx="118" ry="70" fill="#fff" />
            <path d="M70 110 C90 40 270 40 290 110 Z" fill="#fff" />
            <circle cx="150" cy="80" r="9" fill="#3A2420" /><circle cx="210" cy="70" r="8" fill="#3A2420" /><circle cx="180" cy="100" r="7" fill="#3A2420" /><circle cx="236" cy="104" r="7" fill="#3A2420" />
            <path d="M70 130 L290 130 L262 306 Q260 322 244 322 L116 322 Q100 322 98 306 Z" fill="#2B1B17" />
            <rect x="82" y="150" width="196" height="40" fill="#fff" opacity="0.92" />
            <rect x="170" y="48" width="14" height="110" rx="7" fill="#39C1CB" transform="rotate(24 177 100)" />
          </svg>
          <div className="pname">آيس كريم كوكيز</div>
          <div className="pnew">٩٫٩٥</div>
          <div className="pold">١٣٫٩٥ ريال<i></i></div>
        </div>
        <img id="s2-ninja" className="abs" src={staticFile("ninja-char.png")} alt="" />
      </div>

      
      <div id="s3" style={{display: t>=5.4 && t<8.6 ? "block":"none"}} className="fill scene">
        <div id="s3-old" className="abs t">٢٤٫٩٠</div>
        <div id="s3-strike" className="abs"></div>
        <div id="s3-new" className="abs t">٢٤٫٩٠</div>
        <div id="s3-cur" className="abs t">ريال للاثنين</div>
        <div id="s3-save" className="abs">وفّرت ٩ ريال</div>
        <img id="s3-ninja" className="abs" src={staticFile("ninja-char.png")} alt="" />
      </div>

      
      <div id="s4" style={{display: t>=8.6 && t<11.0 ? "block":"none"}} className="fill scene">
        <div id="s4-a" className="abs t">توصيل سريع</div>
        <div id="s4-b" className="abs t">٢٤ ساعة</div>
        <div id="s4-c" className="abs t">لين باب بيتك</div>
        <img id="s4-ninja" className="abs" src={staticFile("ninja-char.png")} alt="" />
      </div>

      
      <div id="s5" style={{display: t>=11 && t<15 ? "block":"none"}} className="fill scene">
        <img id="s5-logo" className="abs" src={staticFile("ninja-logo.png")} alt="" />
        <div id="s5-tag" className="abs t">حمّل التطبيق واطلب الحين</div>
        <div id="s5-btn" className="abs">ابدأ التسوق الآن</div>
        <img id="s5-ninja" className="abs" src={staticFile("ninja-char.png")} alt="" />
      </div>

      <div id="flash" className="fill"></div>
      <svg width="0" height="0" style={{position:"absolute"}}><defs><linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFB41F" /><stop offset="1" stopColor="#F26B0F" /></linearGradient></defs></svg>
      <Audio src={staticFile("sfx/mix.wav")} />
    </div>
  );
};
