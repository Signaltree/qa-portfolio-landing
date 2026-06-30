import { useState, useEffect, useRef } from 'react'
import './App.css'

/* ─── Data ─── */

const terminalLines = [
  { text: '$ ./portfolio --whoami', type: 'pr' },
  { text: '  Alejandro Adriazola', type: 'mt' },
  { text: '  Analista Programador / QA Automation', type: 'mt' },
  { text: '  TypeScript · Java · Python · Bash', type: 'ps' },
  { text: '', type: '' },
  { text: '$ npm run test:portfolio', type: 'pr' },
  { text: '', type: '' },
  { text: '> Selenium WebDriver ......... 22/22 passed  \u2713', type: 'ps' },
  { text: '> Playwright .................. 38/38 passed  \u2713', type: 'ps' },
  { text: '> Cypress ..................... 19/19 passed  \u2713', type: 'ps' },
  { text: '> Flutter / iOS .............. 7/7 passed    \u2713', type: 'ps' },
  { text: '', type: '' },
  { text: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500', type: 'dv' },
  { text: '  Result: 86 tests passed  \u2713', type: 'sm' },
  { text: '  Selenium + Playwright + Cypress + Flutter', type: 'mt' },
  { text: '  CI/CD con GitHub Actions', type: 'mt' },
]

const frameworks = [
  { name:'Selenium WebDriver', tech:'Java / SauceDemo + the-internet', pass:22, tests:[{l:'Navegaci\u00f3n y waits',c:4},{l:'Multi-browser',c:3},{l:'Interacci\u00f3n avanzada',c:4},{l:'Ventanas y frames',c:4},{l:'JavaScript',c:4},{l:'Page Object Model',c:3}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/selenium-webdriver', back:'Problema: necesitaba demostrar automatizaci\u00f3n cl\u00e1sica sin depender de Playwright. \u2192 22 tests en 6 categor\u00edas (waits, multi-browser, drag-drop, frames, JavaScript, POM) contra dos apps reales. Chrome/Firefox/Edge con detecci\u00f3n autom\u00e1tica de binarios.' },
  { name:'Playwright', tech:'TypeScript / SauceDemo', pass:38, tests:[{l:'Funcionales UI',c:12},{l:'Intercepci\u00f3n de red',c:8},{l:'Regresi\u00f3n visual',c:8},{l:'Seguridad OWASP',c:10}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/playwright', back:'Problema: bugs visuales y de seguridad llegaban a producci\u00f3n con tests funcionales tradicionales. \u2192 Implement\u00e9 38 tests con 6 tipos de usuario, intercepci\u00f3n de red, regresi\u00f3n visual (5% umbral), accesibilidad axe-core WCAG AA y OWASP Top 10 mapeado a la Ley 21.663. Cobertura total en un solo framework.' },
  { name:'Cypress', tech:'JavaScript / SauceDemo', pass:19, tests:[{l:'Login',c:3},{l:'Inventario',c:4},{l:'Carro de compras',c:4},{l:'Checkout',c:4},{l:'Men\u00fa lateral',c:2},{l:'Estados de error',c:2}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/cypress', back:'Problema: tests E2E fr\u00e1giles en CI con timeouts y selectores din\u00e1micos. \u2192 Cypress con retry-ability, custom commands y espera autom\u00e1tica. 19 tests sobre SauceDemo: login, inventario, carro, checkout, men\u00fa lateral y estados de error.' },
  { name:'Flutter / iOS', tech:'Dart / Flutter (integration_test)', pass:7, tests:[{l:'Renderizado inicial',c:1},{l:'Contador',c:2},{l:'Incrementos m\u00faltiples',c:1},{l:'CRUD todos',c:3}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/flutter_app', back:'Problema: selectores XPath/CSS no funcionan en el widget tree de Flutter. \u2192 7 tests con integration_test para contador (state) y CRUD de todos. Sin selectores fr\u00e1giles \u2014 el framework entiende tu UI al mismo nivel que t\u00fa.' },
]

const processSteps = [
  { cmd:'plan', label:'Planificación', desc:'Analizo la base de pruebas para identificar condiciones y criterios de entrada/salida. Priorizo según riesgo y defino alcance: qué probar, con qué nivel y cuándo detenerse.', tools:['ISTQB','Jira','Gherkin','Análisis de riesgo','Criterios de salida'] },
  { cmd:'test', label:'Ejecución', desc:'Diseño casos con partición de equivalencias y valores límite. Ejecuto procedimientos, comparo real contra esperado y registro desviaciones con trazabilidad al requisito.', tools:['Playwright','Selenium','Cypress','Flutter','GitHub Actions'] },
  { cmd:'report', label:'Reporte', desc:'Consolido resultados contra criterios de salida, evalúo riesgo residual y genero recomendaciones. El informe documenta qué se probó, qué defectos quedan y qué riesgo asume el negocio.', tools:['Allure','GitHub Pages','Informe de cierre','Lecciones aprendidas'] },
]

const skillCategories = [
  { t:'Testing', i:['Selenium','Playwright','Cypress','Flutter','Postman','JMeter','k6','Allure'] },
  { t:'Lenguajes', i:['TypeScript','JavaScript','Java','Dart','Python','SQL','Bash'] },
  { t:'Infra', i:['GitHub Actions','Docker','Git','Linux','Jira','BDD','POM'] },
]

const experiences = [
  { co:'IT Conosur', role:'Operador Cloud / Soporte Funcional ERP', period:'2025 \u2014 Presente',
    d:['Administr\u00e9 infraestructura cloud y on-premise para 12 clientes empresariales sobre ERP QAD en RedHat y CentOS.','Automatic\u00e9 tareas de 2+ horas diarias con scripts Python y Bash, usando Ansible para gesti\u00f3n de cron jobs.','Ejecut\u00e9 validaci\u00f3n y restauraci\u00f3n de bases de datos en producci\u00f3n con controles de integridad.','Gestion\u00e9 control de versiones Git en entornos multi-cliente.'] },
  { co:'Conectados', role:'Analista de Datos / Back Office (WOM)', period:'2019 \u2014 2025',
    d:['Dise\u00f1\u00e9 y ejecut\u00e9 casos de prueba funcionales, de regresi\u00f3n e integraci\u00f3n en sprints Agile Scrum.','Automatic\u00e9 pruebas API REST con Karate/Gherkin (BDD) y flujos web con Selenium.','Valid\u00e9 APIs REST con Postman y manej\u00e9 el ciclo de vida de defectos en Jira.','Lider\u00e9 toma de requerimientos funcionales y entren\u00e9 a 6 grupos en est\u00e1ndares de calidad.','Ejecut\u00e9 pruebas de carga con JMeter y consultas SQL para validaci\u00f3n de datos.'] },
]

const certifications = [
  { name:'Analista Programador', issuer:'INACAP, Santiago', st:'Obtenido' },
  { name:'Ingenier\u00eda en Inform\u00e1tica', issuer:'INACAP, Santiago (cursando)', st:'En curso' },
  { name:'ISTQB Foundation Level', issuer:'International Software Testing', st:'Preparaci\u00f3n' },
]

const navLinks = [
  { label:'Sobre m\u00ed', id:'about' },
  { label:'Tests', id:'frameworks' },
  { label:'Proceso', id:'process' },
  { label:'Stack', id:'skills' },
  { label:'Trayectoria', id:'experience' },
  { label:'Contacto', id:'contact' },
]

/* ─── Hooks ─── */

function useScrollTop() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const fn = () => setY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return y
}

function useReveal(threshold = .15) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); o.unobserve(el) }
    }, { threshold })
    o.observe(el)
    return () => o.disconnect()
  }, [threshold])
  return [ref, v]
}

function useTypewriter() {
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const li = useRef(0)
  const ch = useRef(0)

  useEffect(() => {
    let timer
    const type = () => {
      if (li.current >= terminalLines.length) { setDone(true); return }
      const line = terminalLines[li.current].text
      if (ch.current < line.length) {
        ch.current++
        const prefix = terminalLines.slice(0, li.current).map(l => l.text).join('\n')
        setText(prefix ? prefix + '\n' + line.slice(0, ch.current) : line.slice(0, ch.current))
        timer = setTimeout(type, 14 + Math.random() * 10)
      } else {
        li.current++
        ch.current = 0
        timer = setTimeout(type, 80)
      }
    }
    timer = setTimeout(type, 400)
    return () => clearTimeout(timer)
  }, [])

  return [text, done]
}

/* ─── Interaction Hooks ─── */

function useMagnetic(strength = .25) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia('(pointer: fine)').matches) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      el.style.transform = `translate(${(e.clientX - r.left - r.width/2) * strength}px, ${(e.clientY - r.top - r.height/2) * strength}px)`
    }
    const leave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', move, { passive: true })
    el.addEventListener('mouseleave', leave, { passive: true })
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [strength])
  return ref
}

/* ─── Utils ─── */

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/* ─── Components ─── */

function ScrollBar() {
  const y = useScrollTop()
  const pct = typeof document !== 'undefined'
    ? (y / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    : 0
  return <div className="scroll-bar" style={{ width: Math.min(pct, 100) + '%' }} />
}

function Nav() {
  const y = useScrollTop()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved !== 'light'
    return !matchMedia('(prefers-color-scheme:light)').matches
  })

  useEffect(() => {
    document.body.classList.toggle('light', !dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const sections = navLinks.map(l => document.getElementById(l.id)).filter(Boolean)
    let current = ''
    for (const s of sections) {
      if (s.offsetTop - 120 <= y) current = s.id
    }
    setActive(current)
  }, [y])

  return (
    <nav className={`nav${y > 40 ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-logo">Alejandro <span>Adriazola</span></a>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <button className="theme-btn" onClick={() => setDark(!dark)} aria-label="Cambiar tema">
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="nav-toggle" onClick={() => setOpen(!open)}>
            {open ? '[x]' : '[=]'}
          </button>
        </div>
        <ul className={`nav-items${open ? ' open' : ''}`}>
          {navLinks.map(l => (
            <li key={l.id}>
              <a href={`#${l.id}`}
                className={active === l.id ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollTo(l.id); setOpen(false) }}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

function Reveal({ children, d = 0, className = '' }) {
  const [ref, v] = useReveal()
  const cls = `reveal${d ? ` reveal-d${d}` : ''}${v ? ' visible' : ''} ${className}`
  return <div ref={ref} className={cls}>{children}</div>
}

function Stagger({ children, className = '' }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setV(true)
        Array.from(el.children).forEach((child, i) => { child.style.setProperty('--i', i) })
        o.unobserve(el)
      }
    }, { threshold: .15 })
    o.observe(el)
    return () => o.disconnect()
  }, [])
  return <div ref={ref} className={`stagger${v ? ' in' : ''} ${className}`}>{children}</div>
}

function Hero() {
  const [text, done] = useTypewriter()
  const bootLines = text.split('\n')
  const [cmd, setCmd] = useState('')
  const [history, setHistory] = useState([])
  const [cleared, setCleared] = useState(false)
  const inputRef = useRef(null)
  const bodyRef = useRef(null)
  const ctaRef = useMagnetic()
  const replayRef = useMagnetic()

  useEffect(() => {
    if (done && inputRef.current) inputRef.current.focus()
  }, [done])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [history, cmd])

  const respond = (input) => {
    const t = input.trim().toLowerCase()
    if (!t) return
    setHistory(p => [...p, { text: `$ ${input}`, type: 'pr' }])
    if (t === 'help') setHistory(p => [...p,
      { text: 'Comandos:', type: 'mt' },
      { text: '  about     — Sobre m\u00ed', type: 'mt' },
      { text: '  projects  — Frameworks y tests', type: 'mt' },
      { text: '  skills    — Stack t\u00e9cnico', type: 'mt' },
      { text: '  contact   — Contacto', type: 'mt' },
      { text: '  cv        — Ver CV', type: 'mt' },
      { text: '  clear     — Limpiar terminal', type: 'mt' },
    ])
    else if (t === 'about') setHistory(p => [...p, { text: 'Llegué al testing desde los datos. Analista Programador INACAP · Selenium, Playwright, Cypress, Flutter · TypeScript, Java, Python · Cloud, datos, Agile · Inglés C1.', type: 'mt' }])
    else if (t === 'projects' || t === 'tests') setHistory(p => [...p, ...frameworks.map(f => ({ text: `  ${f.name.padEnd(14)} ${f.pass}/${f.pass} passed`, type: 'ps' }))])
    else if (t === 'skills') setHistory(p => [...p, ...skillCategories.map(c => ({ text: `  ${c.t}: ${c.i.join(', ')}`, type: 'mt' }))])
    else if (t === 'contact') setHistory(p => [...p,
      { text: '  ale.edu.adriazola@gmail.com', type: 'mt' },
      { text: '  wa.me/56964362078', url: 'https://wa.me/56964362078' },
      { text: '  github.com/Signaltree', type: 'mt' },
      { text: '  linkedin.com/in/aadriazola/', type: 'mt' },
    ])
    else if (t === 'cv') setHistory(p => [...p, { text: `${import.meta.env.BASE_URL || '/'}cv.html`, type: 'mt' }])
    else if (t === 'clear') { setHistory([]); setCleared(true) }
    else setHistory(p => [...p, { text: `Comando no encontrado: "${input}". Escribe "help".`, type: 'er' }])
  }

  const display = cleared ? history : [...bootLines.map((l, i) => ({ text: l, type: terminalLines[i]?.type || '' })), ...history]

  return (
    <section className="hero" id="top" onClick={() => inputRef.current?.focus()}>
      <div className="noise" />
      <div className="hero-content">
        <div className="terminal">
          <div className="terminal-bar">
            <span className="terminal-dot r" /><span className="terminal-dot y" /><span className="terminal-dot g" />
            <span className="terminal-title">bash — ./portfolio --run</span>
          </div>
          <div className="terminal-body" ref={bodyRef}>
            {display.map((line, i) => (
              <div key={i} className={`terminal-line ${line.type}`}>
                {line.url ? <a href={line.url} target="_blank" rel="noreferrer noopener">{line.text}</a> : line.text || '\u00A0'}
              </div>
            ))}
            {!done && <span className="cursor" />}
            {done && (
              <div className="terminal-line pr" style={{ display: 'flex', alignItems: 'center' }}>
                <span>$ </span>
                <input ref={inputRef} type="text" value={cmd}
                  onChange={e => setCmd(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { respond(cmd); setCmd('') } }}
                  className="terminal-input" autoComplete="off" spellCheck="false" aria-label="Comando" />
              </div>
            )}
          </div>
        </div>
        <div className="hero-footer">
          <a href="#frameworks" ref={ctaRef} className="hero-cta magnetic" onClick={(e) => { e.preventDefault(); scrollTo('frameworks') }}>
            Ver tests →
          </a>
          <button ref={replayRef} className="hero-replay magnetic" onClick={() => window.location.reload()}>
            ▶ Replay
          </button>
        </div>
      </div>
    </section>
  )
}

function About() {
  const BASE = import.meta.env.BASE_URL || '/'
  return (
    <section id="about">
      <Reveal d={1}><div className="section-header"><h2>Alejandro Adriazola</h2></div></Reveal>
      <Reveal d={2}>
        <div className="about-wrap">
          <div className="about-photo">
            <img src={`${BASE}images/profile.png`} alt="Alejandro Adriazola" loading="lazy" />
          </div>
          <div className="about-info">
            <h2>Alejandro Eduardo Adriazola Sorhaburu</h2>
            <div className="tag">Analista Programador / QA Automation</div>
            <p>
              Llegué al testing desde los datos. Trabajé como analista en
              Conectados (WOM), donde empecé a automatizar procesos repetitivos
              con scripts y me di cuenta de que me gustaba más encontrar bugs
              que reportarlos. Eso me llevó a titularme de Analista Programador
              en INACAP, y hoy sigo especializándome con la Ingeniería en
              Informática.
            </p>
            <p style={{marginTop:'.5rem',fontSize:'.8125rem',color:'var(--text-secondary)',fontWeight:300,lineHeight:1.7}}>
              Trabajo con Selenium, Playwright, Cypress y Flutter. Programo en
              TypeScript, Java y Python. También hago infraestructura cloud,
              bases de datos y equipos Agile. Inglés C1.
            </p>
            <p style={{marginTop:'.4rem',fontSize:'.75rem',color:'var(--text-secondary)',fontWeight:300,lineHeight:1.7,fontStyle:'italic'}}>
              — entender cómo funcionan los sistemas para encontrar lo que no
              funciona antes de que llegue a producción.
            </p>
            <div className="about-links">
              <a href="https://github.com/Signaltree" target="_blank" rel="noreferrer noopener">GitHub</a>
              <a href="https://www.linkedin.com/in/aadriazola/" target="_blank" rel="noreferrer noopener">LinkedIn</a>
              <a href={`${BASE}cv.html`} target="_blank" rel="noreferrer noopener">CV</a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Frameworks() {
  return (
    <section id="frameworks">
      <Reveal d={1}><div className="section-header"><h2>Tests</h2><p>Selenium + Playwright + Cypress + Flutter · 86 tests automatizados</p></div></Reveal>
      <Stagger className="fw-grid">
        {frameworks.map((fw, i) => <FWCard key={i} fw={fw} />)}
      </Stagger>
    </section>
  )
}

function FWCard({ fw }) {
  const repoRef = useMagnetic()
  return (
    <div className="fw-card">
      <div className="fw-flip-area">
        <div className="fw-front">
          <div className="fw-head">
            <div className="fw-name">
              <h3>{fw.name}</h3>
              <div className="fw-tech">{fw.tech}</div>
            </div>
            <span className="fw-badge pass">{fw.pass}/{fw.pass} passed</span>
          </div>
          <div className="fw-tests">
            {fw.tests.map((t, j) => (
              <div key={j} className="fw-row">
                <span className="fw-row-label">{t.l}</span>
                <span className="fw-row-count">{t.c}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="fw-back">
          <p className="fw-desc">{fw.back}</p>
        </div>
      </div>
      <a href={fw.repo} ref={repoRef} target="_blank" rel="noreferrer noopener" className="fw-repo magnetic">
        repositorio
      </a>
    </div>
  )
}

function Process() {
  const [expanded, setExpanded] = useState(null)

  return (
    <section id="process">
      <Reveal d={1}><div className="section-header"><h2>Proceso</h2><p>Tres comandos. Misma estructura en cada proyecto.</p></div></Reveal>
      <Stagger className="process-list">
        {processSteps.map((s, i) => <ProcessCmd key={i} {...s} i={i} expanded={expanded} setExpanded={setExpanded} />)}
      </Stagger>
    </section>
  )
}

function ProcessCmd({ cmd, label, desc, tools, i, expanded, setExpanded }) {
  return (
    <div className={`process-cmd${expanded === i ? ' expanded' : ''}`}
         onClick={() => setExpanded(expanded === i ? null : i)}
         role="button" tabIndex={0}
         onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(expanded === i ? null : i) }}>
      <div className="process-cmd-prompt">
        <span className="dollar">$</span>
        <span className="cmd">{cmd}</span>
        <span className="arrow">▸</span>
      </div>
      <div className="process-cmd-output">
        <span className="hl">{label}:</span> {desc}
        <div className="process-tools">{tools.map((t, j) => <span key={j} className="process-tag">{t}</span>)}</div>
      </div>
    </div>
  )
}

function Skills() {
  return (
    <section id="skills">
      <Reveal d={1}><div className="section-header"><h2>Stack técnico</h2></div></Reveal>
      <Stagger className="fw-grid">
        {skillCategories.map((cat, i) => (
          <div key={i} className="fw-card skill-card">
            <div className="skill-card-inner">
              <h3>{cat.t}</h3>
              <div className="skill-badges">{cat.i.map((x, j) => <span key={j}>{x}</span>)}</div>
            </div>
          </div>
        ))}
      </Stagger>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience">
      <Reveal d={1}><div className="section-header"><h2>Trayectoria</h2><p>Soporte cloud, análisis de datos y automation en producción.</p></div></Reveal>
      <Stagger className="exp-list">
        {experiences.map((ex, i) => <ExpItem key={i} {...ex} />)}
      </Stagger>
    </section>
  )
}

function ExpItem({ co, role, period, d }) {
  return (
    <div className="exp-item">
      <div className="exp-hdr">
        <div className="exp-co">
          <h3>{co}</h3>
          <div className="role">{role}</div>
        </div>
        <div className="exp-dt">{period}</div>
      </div>
      <ul className="exp-dl">
        {d.map((desc, j) => <li key={j}>{desc}</li>)}
      </ul>
    </div>
  )
}

function Certifications() {
  return (
    <section id="certs">
      <Reveal d={1}><div className="section-header"><h2>Formación</h2></div></Reveal>
      <Stagger className="certs-grid">
        {certifications.map((c, i) => (
          <div key={i} className="cert-item">
            <h4>{c.name}</h4>
            <div className="iss">{c.issuer}</div>
            <div className={`st ${c.st === 'Obtenido' ? 'done' : 'go'}`}>{c.st}</div>
          </div>
        ))}
      </Stagger>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact">
      <Reveal d={1}><div className="section-header"><h2>Contacto</h2></div></Reveal>
      <Reveal d={2}>
        <div className="contact-wrap">
          <div className="contact-links">
            <a href="mailto:ale.edu.adriazola@gmail.com">ale.edu.adriazola@gmail.com</a>
            <a href="https://wa.me/56964362078" target="_blank" rel="noreferrer noopener">+56 9 6436 2078</a>
            <a href="https://github.com/Signaltree" target="_blank" rel="noreferrer noopener">GitHub</a>
            <a href="https://www.linkedin.com/in/aadriazola/" target="_blank" rel="noreferrer noopener">LinkedIn</a>
            <a href={`${import.meta.env.BASE_URL || '/'}cv.html`} target="_blank" rel="noreferrer noopener">CV</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <p>Portfolio QA Automation · Chile · 2026</p>
    </footer>
  )
}

/* ─── App ─── */

export default function App() {
  return (
    <>
      <ScrollBar />
      <Nav />
      <Hero />
      <About />
      <Frameworks />
      <Process />
      <Skills />
      <Experience />
      <Certifications />
      <Contact />
      <Footer />
    </>
  )
}
