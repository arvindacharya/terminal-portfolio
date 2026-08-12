import { useState, useEffect, useRef, useCallback } from 'react';
import { THEMES, SHELL, PROJECTS, BELIEFS, STACK, ROLES, NAVITEMS } from './data.js';
import portrait from './assets/arvind-portrait.png';
import resumePdf from './assets/Arvind_Acharya_Resume.pdf';

const STORE = 'portfolio-shell';
const NARROW = 720;

function useShell() {
  const [shell, setShell] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORE);
      return saved === 'pwsh' || saved === 'zsh' ? saved : 'zsh';
    } catch {
      return 'zsh';
    }
  });

  useEffect(() => {
    const t = THEMES[shell];
    const vars = {
      '--t-bg': t.bg, '--t-fg': t.fg, '--t-accent': t.accent, '--t-mut': t.mut,
      '--t-dim': t.dim, '--t-faint': t.faint, '--t-line': t.line, '--t-line2': t.line2,
      '--t-tint': t.tint, '--t-tint2': t.tint2, '--t-chrome': t.chrome,
      '--t-font': t.font, '--t-radius': t.radius, '--t-radius-lg': t.radiusLg,
      '--t-scan': t.scan
    };
    [document.documentElement, document.body].forEach((el) => {
      Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v));
    });
    try { window.localStorage.setItem(STORE, shell); } catch { /* private mode */ }
  }, [shell]);

  return [shell, setShell];
}

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.innerWidth < NARROW);
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < NARROW);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return narrow;
}

function useActiveSection() {
  const [active, setActive] = useState('whoami');
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const mid = window.innerHeight * 0.42;
        let best = null, bestD = Infinity;
        NAVITEMS.forEach(([, id]) => {
          const el = document.getElementById(id);
          if (!el) return;
          const r = el.getBoundingClientRect();
          const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
          if (d < bestD) { bestD = d; best = id; }
        });
        setActive((prev) => (best && best !== prev ? best : prev));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return active;
}

function useReveal(deps) {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.06 });
    const t = setTimeout(() => {
      document.querySelectorAll('section[data-screen-label]').forEach((el, i) => {
        if (i === 0 || el.dataset.revealed) return;
        el.dataset.revealed = '1';
        el.style.opacity = '0';
        el.style.transform = 'translateY(14px)';
        el.style.transition = 'opacity 700ms cubic-bezier(.16,1,.3,1), transform 700ms cubic-bezier(.16,1,.3,1)';
        io.observe(el);
      });
    }, 80);
    return () => { clearTimeout(t); io.disconnect(); };
  }, deps);
}

const scrollToId = (id, offset = 64) => {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
};

export default function App() {
  const [shell, setShell] = useShell();
  const narrow = useNarrow();
  const active = useActiveSection();
  const [open, setOpen] = useState(null);
  const [stage, setStage] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [roleOpen, setRoleOpen] = useState(0);
  const [menu, setMenu] = useState(false);
  const firstRender = useRef(true);
  useReveal([]);

  const T = THEMES[shell];
  const S = SHELL[shell];
  const isPwsh = shell === 'pwsh';
  const isCase = open !== null;
  const project = PROJECTS[isCase ? open : 0];
  const st = Math.min(stage, project.stages.length - 1);
  const stageData = project.stages[st];
  const nextIdx = isCase ? (open + 1) % PROJECTS.length : 0;
  const cwd = isCase ? `~/projects/${project.file}` : '~';

  const openCase = useCallback((i) => {
    setOpen(i);
    setStage(0);
    requestAnimationFrame(() => scrollToId('projects'));
  }, []);

  const closeCase = useCallback(() => {
    setOpen(null);
    setHovered(null);
    requestAnimationFrame(() => scrollToId('projects'));
  }, []);

  useEffect(() => { firstRender.current = false; }, []);

  const titleText = isPwsh
    ? (narrow
        ? (isCase ? `C:\\portfolio\\projects\\${project.file}` : 'C:\\portfolio')
        : `Windows PowerShell — ${isCase ? `C:\\portfolio\\projects\\${project.file}` : 'C:\\portfolio'}`)
    : `arvind@portfolio: ${cwd}`;

  const activeCmd =
    active === 'projects'
      ? (isCase ? (narrow ? S.catBare(project.file) : S.cat(project.file)) : S.ls)
      : active === 'whoami' ? S.whoami
      : active === 'log' ? S.log
      : active === 'mail' ? S.mail
      : active === 'stack' ? S.tree
      : S.approach;

  const facts = [
    { k: 'role', v: 'AI Engineer, GSK' },
    { k: 'focus', v: 'enterprise AI agents, automation, data' },
    { k: 'shipped', v: '8 systems to production' },
    { k: 'based', v: 'Bengaluru, India' }
  ];

  const channels = [
    { label: 'email', value: 'arvindacharya2000@gmail.com', href: 'mailto:arvindacharya2000@gmail.com' },
    { label: 'linkedin', value: 'linkedin.com/in/arvindacharya', href: 'https://www.linkedin.com/in/arvindacharya' },
    { label: 'github', value: 'github.com/arvindacharya', href: 'https://github.com/arvindacharya' },
    { label: 'combat24', value: 'combat24.in', href: 'https://combat24.in' },
    { label: 'résumé', value: 'Arvind_Acharya_Resume.pdf', href: resumePdf }
  ];

  const sectionPad = { padding: 'clamp(50px,8vh,90px) 0' };
  const promptRow = { display: 'flex', gap: 10, alignItems: 'baseline', fontSize: 14, flexWrap: 'wrap' };
  const kicker = { fontSize: 12.5, color: 'var(--t-dim)' };
  const bodyText = { margin: 0, fontSize: 14, lineHeight: 1.8, color: 'var(--t-mut)', textWrap: 'pretty' };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--t-bg)', fontFamily: 'var(--t-font)', color: 'var(--t-fg)', paddingBottom: 'calc(clamp(96px,14vh,132px) + env(safe-area-inset-bottom, 0px))', transition: 'background 420ms ease,color 420ms ease' }}>
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 94, pointerEvents: 'none', opacity: 'var(--t-scan)', background: 'repeating-linear-gradient(180deg,rgba(255,255,255,0.014) 0 1px,transparent 1px 3px)' }} />
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 93, pointerEvents: 'none', background: 'radial-gradient(120% 80% at 50% 0%, var(--t-tint), transparent 62%)' }} />

      {/* Title bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 96, background: 'var(--t-chrome)', backdropFilter: 'blur(18px)', borderBottom: '1px solid var(--t-line)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: 'calc(9px + env(safe-area-inset-top, 0px)) clamp(12px,3.5vw,40px) 9px', display: 'flex', alignItems: 'center', gap: 'clamp(8px,1.4vw,14px)' }}>
          {!isPwsh && !narrow && (
            <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--t-faint)' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--t-faint)' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--t-accent)' }} />
            </div>
          )}
          {isPwsh && (
            <span style={{ width: 15, height: 15, flexShrink: 0, border: '1px solid var(--t-mut)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 600, color: 'var(--t-mut)' }}>PS</span>
          )}
          <span style={{ fontSize: 12.5, color: 'var(--t-mut)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: '1 1 auto' }}>{titleText}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', flexShrink: 0, border: '1px solid var(--t-line2)', borderRadius: 'var(--t-radius)', overflow: 'hidden' }}>
            {['zsh', 'pwsh'].map((k) => (
              <button key={k} type="button" onClick={() => setShell(k)} title={THEMES[k].title}
                style={{ background: k === shell ? T.tint2 : 'transparent', border: 'none', color: k === shell ? T.accent : T.mut, fontFamily: 'inherit', fontSize: 12, fontWeight: 600, letterSpacing: '0.02em', padding: '7px 12px', minHeight: 32, cursor: 'pointer', transition: 'background 300ms ease,color 300ms ease' }}>
                {THEMES[k].label}
              </button>
            ))}
          </div>
          {isPwsh && !narrow && (
            <div style={{ display: 'flex', gap: 2, flexShrink: 0, marginLeft: 2 }}>
              <span style={{ width: 26, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-mut)' }}>
                <span aria-hidden style={{ width: 9, height: 1, background: 'currentColor', transform: 'translateY(3px)' }} />
              </span>
              <span style={{ width: 26, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-mut)' }}>
                <span aria-hidden style={{ width: 8, height: 8, border: '1px solid currentColor', boxSizing: 'border-box' }} />
              </span>
              <span style={{ width: 26, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-mut)' }}>
                <span aria-hidden style={{ width: 9, height: 9, position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'currentColor', transform: 'translateY(-50%) rotate(45deg)' }} />
                  <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'currentColor', transform: 'translateY(-50%) rotate(-45deg)' }} />
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 clamp(16px,3.5vw,40px)' }}>
        {/* whoami */}
        <section data-screen-label="whoami" id="whoami" style={{ padding: 'calc(clamp(74px,12vh,150px) + env(safe-area-inset-top, 0px)) 0 clamp(50px,8vh,90px)' }}>
          {isPwsh && (
            <div style={{ fontSize: 12.5, color: 'var(--t-dim)', lineHeight: 1.9, marginBottom: 26, animation: 't-boot 500ms ease both' }}>
              <div>PowerShell 7.4.6</div>
              <div>Loading personal and system profiles took 612ms.</div>
            </div>
          )}
          <div style={{ ...promptRow, fontSize: 'clamp(13px,1.2vw,15px)', color: 'var(--t-dim)' }}>
            <span style={{ color: 'var(--t-accent)' }}>{S.prompt}</span>
            <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-block', animation: 't-type 900ms steps(24,end) 200ms both', color: 'var(--t-fg)' }}>{S.whoami}</span>
          </div>
          <div style={{ marginTop: 'clamp(28px,5vh,44px)', animation: 't-in 700ms cubic-bezier(.16,1,.3,1) 900ms both' }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(30px,5.2vw,68px)', lineHeight: 1.06, letterSpacing: '-0.035em', fontWeight: 600 }}>
              Arvind&nbsp;Acharya
              <span style={{ color: 'var(--t-accent)', animation: 't-caret 1.1s step-end infinite', marginLeft: '0.1em' }}>{S.caret}</span>
            </h1>
            <div style={{ marginTop: 14, fontSize: 'clamp(14px,1.4vw,18px)', color: 'var(--t-accent)', letterSpacing: '0.02em' }}>
              AI Engineer · intelligent systems, automation, developer tooling
            </div>
            <p style={{ margin: 'clamp(26px,4vh,38px) 0 0', maxWidth: '68ch', fontSize: 'clamp(14px,1.2vw,16px)', lineHeight: 1.78, color: 'var(--t-fg)', opacity: 0.78, textWrap: 'pretty' }}>
              I design intelligent systems, automation workflows, and developer solutions that transform complex processes into scalable, efficient experiences. Passionate about turning ideas into products that create measurable impact.
            </p>
            <div style={{ marginTop: 'clamp(30px,5vh,46px)', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <a href="#projects" onClick={(e) => { e.preventDefault(); scrollToId('projects'); }}
                style={{ border: '1px solid var(--t-accent)', color: 'var(--t-accent)', borderRadius: 'var(--t-radius)', padding: '12px 16px', fontSize: 13.5, fontWeight: 500, minHeight: 44, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                {S.arrow} {S.ls}
              </a>
              <a href={resumePdf} target="_blank" rel="noopener noreferrer"
                style={{ border: '1px solid var(--t-line2)', color: 'var(--t-mut)', borderRadius: 'var(--t-radius)', padding: '12px 16px', fontSize: 13.5, minHeight: 44, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                {S.arrow} {S.resume}
              </a>
            </div>
            <div style={{ marginTop: 'clamp(34px,6vh,56px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(268px,1fr))', gap: '12px 30px', maxWidth: 820, fontSize: 13, color: 'var(--t-dim)' }}>
              {facts.map((f) => (
                <div key={f.k} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{ color: 'var(--t-faint)', flexShrink: 0 }}>{S.bullet}</span>
                  <span style={{ flexShrink: 0 }}>{f.k}</span>
                  <span style={{ color: 'var(--t-fg)', opacity: 0.78 }}>{f.v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* projects */}
        <section data-screen-label="projects" id="projects" style={sectionPad}>
          {!isCase ? (
            <div>
              <div style={{ ...promptRow, marginBottom: 8 }}>
                <span style={{ color: 'var(--t-accent)' }}>{S.prompt}</span><span>{S.ls}</span>
              </div>
              <div style={{ ...kicker, marginBottom: 20 }}>{S.lsHeader}</div>
              <div>
                {PROJECTS.map((p, i) => {
                  const on = hovered === i;
                  return (
                    <button key={p.file} type="button" onClick={() => openCase(i)} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                      style={{ width: '100%', background: on ? T.tint2 : 'transparent', border: 'none', borderTop: '1px solid var(--t-line)', color: 'var(--t-fg)', fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer', padding: '16px clamp(8px,1.2vw,14px)', margin: '0 clamp(-8px,-1.2vw,-14px)', display: 'block', transition: 'background 300ms ease' }}>
                      {!narrow ? (
                        <span style={{ display: 'grid', gridTemplateColumns: 'auto auto 1fr auto', gap: '6px clamp(12px,2vw,26px)', alignItems: 'baseline' }}>
                          <span style={{ fontSize: 12.5, color: 'var(--t-mut)', whiteSpace: 'nowrap' }}>{isPwsh ? p.dirmeta : p.perm}</span>
                          <span style={{ fontSize: 'clamp(15px,1.5vw,19px)', fontWeight: 600, color: on ? T.accent : T.fg, letterSpacing: '-0.01em', whiteSpace: 'nowrap', transition: 'color 250ms ease' }}>{S.fileLabel(p.file)}</span>
                          <span style={{ fontSize: 13.5, color: 'var(--t-mut)', lineHeight: 1.5 }}>{p.one}</span>
                          <span style={{ fontSize: 12.5, color: on ? T.accent : T.dim, whiteSpace: 'nowrap', transition: 'color 250ms ease' }}>{p.year} {on ? S.arrow : ' '}</span>
                        </span>
                      ) : (
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                            <span style={{ fontSize: 16, fontWeight: 600, color: on ? T.accent : T.fg, letterSpacing: '-0.01em', wordBreak: 'break-all' }}>{S.fileLabel(p.file)}</span>
                            <span style={{ fontSize: 12.5, color: on ? T.accent : T.dim, whiteSpace: 'nowrap', flexShrink: 0 }}>{p.year} {on ? S.arrow : ' '}</span>
                          </span>
                          <span style={{ fontSize: 13.5, color: 'var(--t-mut)', lineHeight: 1.55 }}>{p.one}</span>
                        </span>
                      )}
                    </button>
                  );
                })}
                <div style={{ borderTop: '1px solid var(--t-line)' }} />
              </div>
            </div>
          ) : (
            <div style={{ animation: 't-in 450ms ease both' }}>
              <div style={promptRow}>
                <span style={{ color: 'var(--t-accent)' }}>{S.prompt}</span><span>{S.cat(project.file)}</span>
              </div>
              <button type="button" onClick={closeCase}
                style={{ marginTop: 18, background: 'none', border: '1px solid var(--t-line2)', borderRadius: 'var(--t-radius)', color: 'var(--t-mut)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer', padding: '10px 14px', minHeight: 44 }}>
                ← {S.back}
              </button>

              <h2 style={{ margin: 'clamp(26px,4vh,40px) 0 0', fontSize: 'clamp(26px,4.4vw,54px)', lineHeight: 1.05, letterSpacing: '-0.035em' }}>{project.name}</h2>
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--t-accent)' }}>{project.domain} · {project.year}</div>
              <p style={{ margin: '22px 0 0', maxWidth: '66ch', fontSize: 'clamp(14px,1.2vw,16.5px)', lineHeight: 1.78, color: 'var(--t-fg)', opacity: 0.78, textWrap: 'pretty' }}>{project.lede}</p>

              <div style={{ marginTop: 'clamp(40px,6vh,72px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 22 }}>
                {project.metrics.map((m) => (
                  <div key={m.l} style={{ borderLeft: '1px solid var(--t-accent)', paddingLeft: 16 }}>
                    <div style={{ fontSize: 'clamp(20px,2.2vw,28px)', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--t-fg)' }}>{m.v}</div>
                    <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--t-mut)', lineHeight: 1.55 }}>{m.l}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'clamp(44px,7vh,84px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(24px,3vw,52px)' }}>
                {project.chapters.map((ch) => (
                  <div key={ch.head}>
                    <div style={{ fontSize: 12.5, color: 'var(--t-accent)', marginBottom: 12 }}>{S.marker} {ch.head}</div>
                    <p style={{ ...bodyText, color: 'var(--t-fg)', opacity: 0.78 }}>{ch.body}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'clamp(44px,7vh,84px)' }}>
                <div style={{ ...promptRow, marginBottom: 18 }}>
                  <span style={{ color: 'var(--t-accent)' }}>{S.prompt}</span><span>{S.trace(stageData.slug)}</span>
                </div>
                <div style={{ border: '1px solid var(--t-line2)', borderRadius: 'var(--t-radius-lg)', background: 'rgba(255,255,255,0.015)' }}>
                  <div style={narrow
                    ? { display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--t-line2)' }
                    : { display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid var(--t-line2)' }}>
                    {project.stages.map((s, i) => (
                      <button key={s.slug} type="button" onClick={() => setStage(i)}
                        style={{
                          background: i === st ? T.tint2 : 'transparent', border: 'none',
                          borderRight: narrow ? 'none' : '1px solid var(--t-line)',
                          borderBottom: `2px solid ${i === st ? T.accent : 'transparent'}`,
                          color: i === st ? T.fg : T.mut, fontFamily: 'inherit', fontSize: 13,
                          textAlign: narrow ? 'left' : 'center',
                          padding: '14px 15px', minHeight: narrow ? 48 : 46, cursor: 'pointer', transition: 'all 250ms ease'
                        }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ padding: 'clamp(18px,2.6vw,30px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 'clamp(20px,3vw,44px)', alignItems: 'start' }}>
                    <div>
                      <div style={{ ...kicker, marginBottom: 10 }}>{stageData.role}</div>
                      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.75, color: 'var(--t-fg)', textWrap: 'pretty' }}>{stageData.detail}</p>
                    </div>
                    <div style={{ display: 'grid', gap: 9 }}>
                      {stageData.flow.map((label, i) => (
                        <div key={label} style={{ display: 'flex', gap: 11, fontSize: 13.5, alignItems: 'baseline' }}>
                          <span style={{ color: i === 0 ? T.accent : T.faint, flexShrink: 0, whiteSpace: 'pre' }}>
                            {i === stageData.flow.length - 1 ? S.last : S.branch}
                          </span>
                          <span style={{ color: i === 0 ? T.fg : T.mut }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'clamp(40px,6vh,72px)' }}>
                <div style={{ ...kicker, marginBottom: 14 }}>{S.deps}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {project.stack.map((name) => (
                    <span key={name} style={{ fontSize: 12.5, color: 'var(--t-fg)', opacity: 0.78, border: '1px solid var(--t-line2)', borderRadius: 'calc(var(--t-radius) - 1px)', padding: '5px 10px' }}>{name}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'clamp(40px,6vh,72px)', borderTop: '1px solid var(--t-line)', paddingTop: 22, display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <button type="button" onClick={closeCase} style={{ background: 'none', border: 'none', color: 'var(--t-mut)', fontFamily: 'inherit', fontSize: 13.5, cursor: 'pointer', padding: '11px 0', minHeight: 44, textAlign: 'left' }}>← {S.ls}</button>
                <button type="button" onClick={() => openCase(nextIdx)} style={{ background: 'none', border: 'none', color: 'var(--t-accent)', fontFamily: 'inherit', fontSize: 13.5, cursor: 'pointer', padding: '11px 0', minHeight: 44, textAlign: 'right' }}>{S.cat(PROJECTS[nextIdx].file)} →</button>
              </div>
            </div>
          )}
        </section>

        {/* stack */}
        <section data-screen-label="stack" id="stack" style={sectionPad}>
          <div style={{ ...promptRow, marginBottom: 'clamp(24px,4vh,40px)' }}>
            <span style={{ color: 'var(--t-accent)' }}>{S.prompt}</span><span>{S.tree}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 'clamp(24px,3.5vw,56px)' }}>
            {STACK.map((g) => (
              <div key={g.name}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t-accent)', marginBottom: 14 }}>{S.dirLabel(g.name)}</div>
                <div style={{ display: 'grid', gap: 9 }}>
                  {g.items.map((name, i) => (
                    <div key={name} style={{ display: 'flex', gap: 9, fontSize: 13.5, color: 'var(--t-mut)', lineHeight: 1.45 }}>
                      <span style={{ color: 'var(--t-faint)', flexShrink: 0, whiteSpace: 'pre' }}>{i === g.items.length - 1 ? S.last : S.branch}</span>
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* experience */}
        <section data-screen-label="log" id="log" style={sectionPad}>
          <div style={{ ...promptRow, marginBottom: 'clamp(24px,4vh,40px)' }}>
            <span style={{ color: 'var(--t-accent)' }}>{S.prompt}</span><span>{S.log}</span>
          </div>
          <div>
            {ROLES.map((r, i) => (
              <div key={r.hash} style={{ borderTop: '1px solid var(--t-line)' }}>
                <button type="button" onClick={() => setRoleOpen(roleOpen === i ? -1 : i)}
                  style={{ width: '100%', background: 'none', border: 'none', color: 'var(--t-fg)', fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer', padding: '16px 0', minHeight: 44, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 'clamp(12px,2vw,24px)', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--t-accent)', whiteSpace: 'nowrap' }}>{r.hash}</span>
                  <span>
                    <span style={{ display: 'block', fontSize: 'clamp(15px,1.6vw,20px)', fontWeight: 600, letterSpacing: '-0.015em' }}>{r.title}</span>
                    <span style={{ display: 'block', fontSize: 13, color: 'var(--t-mut)', marginTop: 5 }}>{r.org}</span>
                  </span>
                  <span style={{ display: 'flex', gap: 14, alignItems: 'baseline', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 12.5, color: 'var(--t-dim)' }}>{r.years}</span>
                    <span style={{ fontSize: 13, color: roleOpen === i ? T.accent : T.dim }}>{roleOpen === i ? '[-]' : '[+]'}</span>
                  </span>
                </button>
                {roleOpen === i && (
                  <div style={{ padding: '0 0 26px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 'clamp(18px,3vw,48px)', animation: 't-in 380ms ease both' }}>
                    <p style={{ ...bodyText, maxWidth: '60ch' }}>{r.brief}</p>
                    <div style={{ display: 'grid', gap: 10 }}>
                      {r.shipped.map((text) => (
                        <div key={text} style={{ display: 'flex', gap: 10, fontSize: 13.5, lineHeight: 1.6, color: 'var(--t-fg)', opacity: 0.82 }}>
                          <span style={{ color: 'var(--t-accent)', flexShrink: 0 }}>+</span><span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--t-line)' }} />
          </div>
        </section>

        {/* philosophy */}
        <section data-screen-label="philosophy" id="philosophy" style={sectionPad}>
          <div style={{ ...promptRow, marginBottom: 'clamp(30px,5vh,52px)' }}>
            <span style={{ color: 'var(--t-accent)' }}>{S.prompt}</span><span>{S.approach}</span>
          </div>
          <div style={{ display: 'grid', gap: 'clamp(34px,5vh,60px)' }}>
            {BELIEFS.map((b) => (
              <div key={b.head} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(18px,3vw,52px)', alignItems: 'start' }}>
                <h3 style={{ margin: 0, fontSize: 'clamp(19px,2.4vw,30px)', lineHeight: 1.24, letterSpacing: '-0.025em', textWrap: 'balance' }}>{b.head}</h3>
                <p style={{ ...bodyText, maxWidth: '62ch' }}>{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* about */}
        <section data-screen-label="about" id="about" style={sectionPad}>
          <div style={{ ...promptRow, marginBottom: 'clamp(26px,4vh,44px)' }}>
            <span style={{ color: 'var(--t-accent)' }}>{S.prompt}</span><span>{S.readme}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(26px,4vw,72px)', alignItems: 'start' }}>
            <div>
              <p style={{ margin: '0 0 20px', fontSize: 'clamp(16px,1.6vw,21px)', lineHeight: 1.6, letterSpacing: '-0.02em', maxWidth: '44ch', textWrap: 'pretty' }}>
                I grew up in Bengaluru and got curious about computers the way a lot of people my age did — by gaming on them, then wondering how they worked.
              </p>
              <p style={{ ...bodyText, margin: '0 0 18px', maxWidth: '60ch' }}>
                I travel whenever I get the chance. Somewhere new resets something that a weekend off never quite does. I watch football and support Arsenal, which has taught me more about patience than any job has. I read less than I mean to, but a bookshop is still hard to walk past.
              </p>
              <p style={{ ...bodyText, maxWidth: '60ch' }}>
                Most days I lift weights, though if I had the choice it would always be swimming — I am genuinely good at that one, with an undefeated streak in races I have no intention of putting at risk.
              </p>
            </div>
            <div style={{ height: 'clamp(340px,42vw,520px)', borderRadius: 'var(--t-radius-lg)', overflow: 'hidden' }}>
              <img src={portrait} alt="Arvind Acharya" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* contact */}
        <section data-screen-label="mail" id="mail" style={{ padding: 'clamp(50px,8vh,90px) 0 clamp(30px,5vh,60px)' }}>
          <div style={{ ...promptRow, marginBottom: 'clamp(26px,4vh,44px)' }}>
            <span style={{ color: 'var(--t-accent)' }}>{S.prompt}</span><span>{S.mail}</span>
          </div>
          <h2 style={{ margin: 0, maxWidth: '26ch', fontSize: 'clamp(24px,4.2vw,52px)', lineHeight: 1.08, letterSpacing: '-0.035em', textWrap: 'balance' }}>Have something worth building?</h2>
          <p style={{ margin: '20px 0 clamp(30px,5vh,48px)', maxWidth: '56ch', fontSize: 14.5, lineHeight: 1.75, color: 'var(--t-mut)', textWrap: 'pretty' }}>
            Hiring, building, or stuck on a process that should already be automatic. I read everything.
          </p>
          <div style={{ display: 'grid', maxWidth: 640 }}>
            {channels.map((c) => (
              <a key={c.label} href={c.href} target={c.href.startsWith('http') || c.href.endsWith('.pdf') ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ borderTop: '1px solid var(--t-line)', padding: '16px 0', minHeight: 44, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'baseline', color: 'var(--t-fg)', textDecoration: 'none' }}>
                <span style={{ fontSize: 12.5, color: 'var(--t-dim)', minWidth: 74 }}>{c.label}</span>
                <span style={{ fontSize: 'clamp(14px,1.5vw,18px)', fontWeight: 500 }}>{c.value}</span>
                <span style={{ color: 'var(--t-accent)', fontSize: 13 }}>→</span>
              </a>
            ))}
            <div style={{ borderTop: '1px solid var(--t-line)' }} />
          </div>
          <div style={{ marginTop: 'clamp(44px,7vh,80px)', fontSize: 12.5, color: 'var(--t-mut)', lineHeight: 1.9 }}>
            <div>{S.exit(cwd)}</div>
            <div>{S.exitNote}</div>
          </div>
        </section>
      </div>

      {/* desktop command strip */}
      {!narrow && (
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 97, background: 'var(--t-chrome)', backdropFilter: 'blur(18px)', borderTop: '1px solid var(--t-line)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '9px clamp(12px,3.5vw,40px)', display: 'flex', alignItems: 'center', gap: 'clamp(8px,1.4vw,18px)' }}>
            <span style={{ fontSize: 12.5, color: 'var(--t-accent)', flexShrink: 0 }}>{S.navGlyph}</span>
            {NAVITEMS.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }}
                style={{ fontSize: 12.5, color: active === id ? T.fg : T.mut, background: active === id ? T.tint2 : 'transparent', borderRadius: 'calc(var(--t-radius) - 1px)', padding: '5px 9px', whiteSpace: 'nowrap', flexShrink: 0, textDecoration: 'none', transition: 'color 250ms ease,background 300ms ease' }}>
                {label}
              </a>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--t-mut)', whiteSpace: 'nowrap', flexShrink: 0 }}>{S.hint}</span>
          </div>
        </nav>
      )}

      {/* phone command bar + sheet */}
      {narrow && (
        <>
          <button type="button" onClick={() => setMenu((m) => !m)}
            style={{ position: 'fixed', bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))', left: 14, right: 14, zIndex: 100, background: 'var(--t-chrome)', backdropFilter: 'blur(18px)', border: '1px solid var(--t-line2)', borderRadius: 'var(--t-radius)', boxShadow: '0 10px 30px rgba(0,0,0,0.45)', color: 'var(--t-fg)', fontFamily: 'inherit', textAlign: 'left', cursor: 'pointer', padding: '15px 16px', display: 'flex', alignItems: 'center', gap: 10, minHeight: 54 }}>
            <span style={{ fontSize: 14, color: 'var(--t-accent)', flexShrink: 0 }}>{isPwsh ? 'PS>' : S.prompt}</span>
            <span style={{ fontSize: 13.5, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{activeCmd}</span>
            <span style={{ fontSize: 13, color: 'var(--t-mut)', flexShrink: 0, width: 14, textAlign: 'right' }}>{menu ? '✕' : '▲'}</span>
          </button>

          {menu && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'var(--t-bg)', display: 'flex', flexDirection: 'column', padding: 'calc(20px + env(safe-area-inset-top, 0px)) 20px calc(96px + env(safe-area-inset-bottom, 0px))', animation: 't-in 260ms ease both', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontSize: 13, color: 'var(--t-mut)', paddingBottom: 18, borderBottom: '1px solid var(--t-line)' }}>
                <span style={{ color: 'var(--t-accent)' }}>{S.prompt}</span><span>{S.help}</span>
              </div>
              {NAVITEMS.map(([label, id, desc]) => (
                <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); setMenu(false); scrollToId(id); }}
                  style={{ borderBottom: '1px solid var(--t-line)', padding: '16px 2px', display: 'flex', alignItems: 'baseline', gap: 12, minHeight: 56, textDecoration: 'none' }}>
                  <span style={{ fontSize: 13, color: active === id ? T.accent : T.mut, flexShrink: 0, width: 12 }}>{active === id ? '▸' : S.bullet}</span>
                  <span style={{ flex: 1 }}>
                    <span style={{ display: 'block', fontSize: 17, fontWeight: 600, color: active === id ? T.accent : T.fg, letterSpacing: '-0.01em' }}>{label}</span>
                    <span style={{ display: 'block', fontSize: 12.5, color: 'var(--t-mut)', marginTop: 5 }}>{desc}</span>
                  </span>
                </a>
              ))}
              <div style={{ marginTop: 22, display: 'flex', border: '1px solid var(--t-line2)', borderRadius: 'var(--t-radius)', overflow: 'hidden', alignSelf: 'flex-start' }}>
                {['zsh', 'pwsh'].map((k) => (
                  <button key={k} type="button" onClick={() => { setShell(k); setMenu(false); }}
                    style={{ background: k === shell ? T.tint2 : 'transparent', border: 'none', color: k === shell ? T.accent : T.mut, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: '12px 18px', minHeight: 44, cursor: 'pointer' }}>
                    {THEMES[k].label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
