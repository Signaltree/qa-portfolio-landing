import { useState, useEffect, useRef } from 'react'
import './App.css'

/* ─── Data ─── */

const terminalLines = [
  { text: '$ npm run test:portfolio', type: 'pr' },
  { text: '', type: '' },
  { text: '> Playwright .................. 38/38 passed  \u2713', type: 'ps' },
  { text: '> Karate ..................... 82/82 passed  \u2713', type: 'ps' },
  { text: '> REST Assured ............... 18/18 passed  \u2713', type: 'ps' },
  { text: '> BDD-Cucumber ............... 12/12 passed  \u2713', type: 'ps' },
  { text: '> Appium ..................... 7/7 passed    \u2713', type: 'ps' },
  { text: '> Selenium WebDriver ......... 22/22 passed  \u2713', type: 'ps' },
  { text: '> Flutter / iOS .............. 7/7 passed    \u2713', type: 'ps' },
  { text: '', type: '' },
  { text: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500', type: 'dv' },
  { text: '  Result: 186 tests passed  \u2713', type: 'sm' },
  { text: '  Duration: 22s', type: 'mt' },
  { text: '  Coverage: 92%', type: 'mt' },
]

const frameworks = [
  { name:'Playwright', tech:'TypeScript / SauceDemo', pass:38, tests:[{l:'Funcionales UI',c:12},{l:'Intercepci\u00f3n de red',c:8},{l:'Regresi\u00f3n visual',c:8},{l:'Seguridad OWASP',c:10}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/playwright', back:'La l\u00ednea entre testing funcional y visual es falsa. Playwright controla navegadores reales, no los simula. Por eso captura problemas que un test de l\u00f3gica pura nunca ver\u00eda.' },
  { name:'Karate', tech:'Java / JSONPlaceholder + GraphQL', pass:82, tests:[{l:'CRUD Posts',c:20},{l:'CRUD Users',c:12},{l:'Auth y autorizaci\u00f3n',c:6},{l:'OWASP Top 10',c:14},{l:'Contrato CSIRT',c:5},{l:'GraphQL',c:7}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/karate', back:'OWASP Top 10, GraphQL, contratos CSIRT en un solo archivo. Karate demuestra que la divisi\u00f3n entre tipos de prueba suele ser administrativa, no t\u00e9cnica.' },
  { name:'REST Assured', tech:'Java / JSONPlaceholder', pass:18, tests:[{l:'Validaciones GET',c:4},{l:'Validaciones POST',c:3},{l:'Validaciones PUT',c:3},{l:'Validaciones DELETE',c:3},{l:'JSON Schema',c:2},{l:'POJO + Hamcrest',c:3}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/rest-assured', back:'Java no es elegante para APIs, pero con los matchers correctos cierra esa brecha. No necesit\u00e1s Postman ni curl cuando tu producto ya vive en Java.' },
  { name:'Cucumber BDD', tech:'Java / Selenium / SauceDemo', pass:12, tests:[{l:'Features login',c:3},{l:'Features inventario',c:3},{l:'Features carro',c:3},{l:'Features checkout',c:3}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/bdd-cucumber', back:'Gherkin obliga a preguntar qu\u00e9 deber\u00eda pasar antes de escribir c\u00f3digo. El valor no est\u00e1 en los tests sino en la conversaci\u00f3n que generan antes de existir.' },
  { name:'Appium', tech:'Java / Wikipedia (Android)', pass:7, tests:[{l:'B\u00fasqueda b\u00e1sica',c:1},{l:'Validaci\u00f3n resultados',c:2},{l:'Navegaci\u00f3n art\u00edculos',c:2},{l:'Interfaz m\u00f3vil',c:2}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/appium', back:'Un solo API para Android y iOS. Appium demuestra que el testing mobile no deber\u00eda requerir dos frameworks, dos equipos ni dos formas de pensar.' },
  { name:'Selenium WebDriver', tech:'Java / SauceDemo + the-internet', pass:22, tests:[{l:'Navegaci\u00f3n y waits',c:4},{l:'Multi-browser',c:3},{l:'Interacci\u00f3n avanzada',c:4},{l:'Ventanas y frames',c:4},{l:'JavaScript',c:4},{l:'Page Object Model',c:3}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/selenium-webdriver', back:'No innova, pero corre donde otros fallan. Es la navaja suiza del testing web: no la m\u00e1s filosa, pero la que siempre funciona.' },
  { name:'Flutter / iOS', tech:'Dart / Flutter (integration_test)', pass:7, tests:[{l:'Renderizado inicial',c:1},{l:'Contador',c:2},{l:'Incrementos m\u00faltiples',c:1},{l:'CRUD todos',c:3}], repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/flutter_app', back:'El widget tree elimina la capa m\u00e1s fr\u00e1gil del testing UI: los selectores. Cuando el framework entiende tu app al mismo nivel que vos, los tests se vuelven obvios.' },
]

const processSteps = [
  { cmd:'plan', label:'Cobertura', desc:'Define qué cubrimos, qué omitimos y por qué. Sin plan, los tests corren pero no tienen dirección: pasan o fallan sin contar nada sobre el sistema.', tools:['Jira','Gherkin','POM','Casos de prueba'] },
  { cmd:'test', label:'Hipótesis', desc:'Cada test pregunta algo al sistema: dado un estado y una acción, el resultado debe coincidir con lo esperado. Si no puede fallar de forma reveladora, no aporta.', tools:['Playwright','Selenium','Karate','Appium','GitHub Actions'] },
  { cmd:'report', label:'Cierre', desc:'Responde tres preguntas: qué pasó, qué riesgo queda, qué se hace ahora. Sin reporte los tests son ruido. El reporte convierte ejecución en información.', tools:['Allure','GitHub Pages','README'] },
]

const skillCategories = [
  { t:'Automatizaci\u00f3n', i:['Playwright','Selenium','Karate','REST Assured','Cucumber','Appium','Flutter'] },
  { t:'API y Rendimiento', i:['Postman','JMeter','k6','REST APIs','GraphQL'] },
  { t:'Lenguajes', i:['TypeScript','JavaScript','Java','Dart','Python','SQL','Bash'] },
  { t:'CI/CD y DevOps', i:['GitHub Actions','Docker','Ansible','Git','Linux','Selenium Grid'] },
  { t:'Herramientas', i:['Jira','Agile/Scrum','Kanban','BDD','POM','Allure'] },
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

const stats = [
  { num:'186', label:'tests automatizados', cls:'green' },
  { num:'7', label:'frameworks', cls:'accent' },
  { num:'3', label:'lenguajes', cls:'' },
  { num:'100%', label:'pass rate', cls:'green' },
]

const navLinks = [
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

function useCountUp(end) {
  const [c, setC] = useState(0)
  const ref = useRef(null)
  const done = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const t0 = performance.now()
        const step = (now) => {
          const t = Math.min((now - t0) / 1200, 1)
          setC(Math.floor(t * end))
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        o.unobserve(el)
      }
    }, { threshold: .5 })
    o.observe(el)
    return () => o.disconnect()
  }, [end])
  return [ref, c]
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

function useTilt(max = 6) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia('(pointer: fine)').matches) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      el.style.transform = `rotateX(${(y - .5) * -max}deg) rotateY(${(x - .5) * max}deg)`
    }
    const leave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', move, { passive: true })
    el.addEventListener('mouseleave', leave, { passive: true })
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [max])
  return ref
}

/* ─── Utils ─── */

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/* ─── Components ─── */

function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !matchMedia('(pointer: fine)').matches) return
    const move = (e) => {
      el.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <div ref={ref} className="cursor-glow" />
}

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

function Parallax({ speed = .3, className = '', children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = null
    const update = () => { el.style.transform = `translateY(${window.scrollY * speed}px)` }
    const onScroll = () => {
      if (!raf) { raf = requestAnimationFrame(() => { update(); raf = null }) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])
  return <div ref={ref} className={className}>{children}</div>
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
    else if (t === 'about') setHistory(p => [...p, { text: 'Analista Programador INACAP. Automatizo 5 frameworks: interfaz web, API REST, mobile y contratos. Todo corre en CI/CD.', type: 'mt' }])
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
      <Parallax className="hero-bg" />
      <div className="noise" />
      <div className="hero-content">
        <div className="terminal">
          <div className="terminal-bar">
            <span className="terminal-dot r" /><span className="terminal-dot y" /><span className="terminal-dot g" />
            <span className="terminal-title">bash — npm run test:portfolio</span>
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

function StatsSection() {
  return (
    <Reveal>
      <div className="stats-wrap">
        {stats.map((s, i) => <StatItem key={i} {...s} />)}
      </div>
    </Reveal>
  )
}

function StatItem({ num, label, cls }) {
  const val = parseInt(num) || 0
  const sfx = num.includes('+') ? '+' : num.includes('%') ? '%' : ''
  const [ref, c] = useCountUp(val)
  return (
    <div className="stat-item">
      <div ref={ref} className={`stat-num ${cls}`}>{c}{sfx}</div>
      <div className="stat-label">{label}</div>
    </div>
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
              Analista Programador titulado en INACAP. Automatizo pruebas funcionales,
              de API, mobile y regresión visual en cinco frameworks. Trabajo con
              TypeScript, Java, Python y Bash en pipelines CI/CD con GitHub Actions.
              Mi experiencia combina infraestructura cloud, administración de bases
              de datos y testing en entornos Agile. Inglés avanzado C1.
            </p>
            <div className="about-links">
              <a href="https://github.com/Signaltree" target="_blank" rel="noreferrer noopener">🐙 GitHub</a>
              <a href="https://www.linkedin.com/in/aadriazola/" target="_blank" rel="noreferrer noopener">💼 LinkedIn</a>
              <a href={`${BASE}cv.html`} target="_blank" rel="noreferrer noopener">📄 Ver CV</a>
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
      <Reveal d={1}><div className="section-header"><h2>Tests — 7 frameworks</h2><p>186 tests automatizados. Ninguno falla.</p></div></Reveal>
      <Stagger className="fw-grid">
        {frameworks.map((fw, i) => <FWCard key={i} fw={fw} />)}
      </Stagger>
    </section>
  )
}

function FWCard({ fw }) {
  const tiltRef = useTilt()
  const repoRef = useMagnetic()
  return (
    <div ref={tiltRef} className="fw-card">
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
          <div className="fw-head">
            <div className="fw-name">
              <h3>{fw.name}</h3>
              <div className="fw-tech">{fw.tech}</div>
            </div>
            <span className="fw-badge pass">{fw.pass}/{fw.pass} passed</span>
          </div>
          <p className="fw-desc">{fw.back}</p>
          <div className="fw-tag-row">
            <span className="fw-tag">CI/CD</span>
            <span className="fw-tag">POM</span>
            <span className="fw-tag">Allure</span>
          </div>
        </div>
      </div>
      <a href={fw.repo} ref={repoRef} target="_blank" rel="noreferrer noopener" className="fw-repo magnetic">
        🐙 repositorio
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
  const tiltRef = useTilt(4)
  return (
    <div ref={tiltRef} className={`process-cmd${expanded === i ? ' expanded' : ''}`}
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
      <Reveal d={1}><div className="section-header"><h2>Stack técnico</h2><p>Herramientas que uso en proyectos reales.</p></div></Reveal>
      <div className="skills-grid">
        {skillCategories.map((cat, i) => (
          <Reveal key={i} d={Math.min(i + 1, 4)}>
            <div className="skill-cat">
              <h4>{cat.t}</h4>
              <div className="skill-badges">{cat.i.map((x, j) => <span key={j}>{x}</span>)}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience">
      <Reveal d={1}><div className="section-header"><h2>Trayectoria</h2><p>Infraestructura, datos y automatización en entornos empresariales.</p></div></Reveal>
      <Stagger className="exp-list">
        {experiences.map((ex, i) => <ExpItem key={i} {...ex} />)}
      </Stagger>
    </section>
  )
}

function ExpItem({ co, role, period, d }) {
  const tiltRef = useTilt(3)
  return (
    <div ref={tiltRef} className="exp-item">
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
            <a href="mailto:ale.edu.adriazola@gmail.com">✉ ale.edu.adriazola@gmail.com</a>
            <a href="https://wa.me/56964362078" target="_blank" rel="noreferrer noopener">☎ +56 9 6436 2078</a>
            <a href="https://github.com/Signaltree" target="_blank" rel="noreferrer noopener">🐙 GitHub</a>
            <a href="https://www.linkedin.com/in/aadriazola/" target="_blank" rel="noreferrer noopener">💼 LinkedIn</a>
            <a href={`${import.meta.env.BASE_URL || '/'}cv.html`} target="_blank" rel="noreferrer noopener">📄 CV</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <p>OpenCode · Vite + React · JetBrains Mono + Inter</p>
    </footer>
  )
}

/* ─── App ─── */

export default function App() {
  return (
    <>
      <CursorGlow />
      <ScrollBar />
      <Nav />
      <Hero />
      <StatsSection />
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
