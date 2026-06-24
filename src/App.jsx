import { useEffect, useRef, useState, useCallback } from 'react'
import './App.css'

/* ─── Data ─── */

const particles = [
  { t:'12%', l:'6%', w:80, h:80, n:'135+' },
  { t:'55%', l:'4%', w:60, h:60, n:'4' },
  { t:'22%', r:'8%', w:70, h:70, n:'2' },
  { t:'68%', r:'4%', w:55, h:55, n:'100%' },
  { t:'42%', l:'48%', w:90, h:90, n:'24' },
  { t:'8%', l:'38%', w:50, h:50, n:'12' },
]

const frameworks = [
  { icon:'🎭', name:'Playwright', tech:'TypeScript · SauceDemo', repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/playwright', tests:[{l:'Funcionales UI',c:12},{l:'Intercepción de red',c:8},{l:'Regresión visual',c:8},{l:'Seguridad (OWASP)',c:10},{l:'Multi-browser',c:7}] },
  { icon:'🥋', name:'Karate', tech:'Java · JSONPlaceholder', repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/karate', tests:[{l:'CRUD Posts',c:20},{l:'CRUD Users',c:12},{l:'Auth & autorización',c:6},{l:'OWASP Top 10',c:14},{l:'Contrato CSIRT',c:5},{l:'Carga (Gatling)',c:10}] },
  { icon:'🧪', name:'REST Assured', tech:'Java · JSONPlaceholder', repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/rest-assured', tests:[{l:'Validaciones GET',c:4},{l:'Validaciones POST',c:3},{l:'Validaciones PUT',c:3},{l:'Validaciones DELETE',c:3},{l:'JSON Schema',c:2},{l:'POJO + Hamcrest',c:3}] },
  { icon:'🥒', name:'Cucumber BDD', tech:'Java · Selenium · SauceDemo', repo:'https://github.com/Signaltree/qa-automation-portfolio/tree/main/bdd-cucumber', tests:[{l:'Features login',c:3},{l:'Features inventario',c:3},{l:'Features carro',c:3},{l:'Features checkout',c:3},{l:'Selenium Grid',c:2}] },
]

const skillCategories = [
  { t:'Automatización', i:['Playwright','Selenium','Karate','REST Assured','Cucumber','Appium'] },
  { t:'API y Rendimiento', i:['Postman','JMeter','Gatling','REST APIs','GraphQL'] },
  { t:'Lenguajes', i:['TypeScript','JavaScript','Java','Python','SQL','Bash'] },
  { t:'CI/CD y DevOps', i:['GitHub Actions','Docker','Ansible','Git','Linux','Selenium Grid'] },
  { t:'Seguridad', i:['OWASP Top 10','SonarQube','Kali Linux','Ley 21.663','SAST'] },
  { t:'Herramientas', i:['Jira','Agile/Scrum','Kanban','BDD','POM','Allure'] },
]

const experiences = [
  { co:'IT Conosur', role:'Operador Cloud / Soporte Funcional ERP', period:'2025 — Presente',
    d:['Administré infraestructura cloud y on-premise para 12 clientes empresariales sobre ERP QAD en RedHat y CentOS.','Automaticé tareas de 2+ horas diarias con scripts Python y Bash, usando Ansible para gestión de cron jobs.','Ejecuté validación y restauración de bases de datos en producción con controles de integridad.','Gestioné control de versiones Git en entornos multi-cliente.'] },
  { co:'Conectados', role:'Analista de Datos / Back Office (WOM)', period:'2019 — 2025',
    d:['Diseñé y ejecuté casos de prueba funcionales, de regresión e integración en sprints Agile Scrum.','Automaticé pruebas API REST con Karate/Gherkin (BDD) y flujos web con Selenium.','Validé APIs REST con Postman y manejé el ciclo de vida de defectos en Jira.','Lideré toma de requerimientos funcionales y entrené a 6 grupos en estándares de calidad.','Ejecuté pruebas de carga con JMeter y consultas SQL para validación de datos.'] },
]

const certifications = [
  { name:'Analista Programador', issuer:'INACAP, Santiago', st:'Obtenido', icon:'🎓' },
  { name:'Ingeniería en Informática', issuer:'INACAP, Santiago (cursando)', st:'En curso', icon:'📚' },
  { name:'ISTQB Foundation Level', issuer:'International Software Testing', st:'Preparación', icon:'📋' },
]

const BASE = import.meta.env.BASE_URL || '/'

const navLinks = [
  { label:'Sobre mí', id:'about' },
  { label:'Habilidades', id:'skills' },
  { label:'Proyectos', id:'frameworks' },
  { label:'Experiencia', id:'experience' },
  { label:'Certificaciones', id:'certs' },
  { label:'Contacto', id:'contact' },
]

/* ─── Hooks ─── */

function useReveal(threshold = .15) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.unobserve(el) } }, { threshold })
    o.observe(el)
    return () => o.disconnect()
  }, [threshold])
  return [ref, v]
}

function useScrollTop() {
  const [y, setY] = useState(0)
  useEffect(() => {
    const fn = () => setY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return y
}

function useCount(end, dur = 1500) {
  const [c, setC] = useState(0)
  const done = useRef(false)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const t0 = performance.now()
        const step = (now) => {
          const t = Math.min((now - t0) / dur, 1)
          setC(Math.floor(t * end))
          if (t < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        o.unobserve(el)
      }
    }, { threshold: .5 })
    o.observe(el)
    return () => o.disconnect()
  }, [end, dur])
  return [ref, c]
}

/* ─── Utils ─── */

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })
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
        <ul className="nav-items">
          {navLinks.map(l => (
            <li key={l.id}>
              <a href={`#${l.id}`}
                className={active === l.id ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); scrollTo(l.id) }}>
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

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="particles">
        {particles.map((p, i) => (
          <div key={i} className="particle"
            style={{ top:p.t, left:p.l, right:p.r, width:p.w, height:p.h }}>
            <span className="num">{p.n}</span>
          </div>
        ))}
      </div>
      <div className="hero-content">
        <div className="hero-photo">
            <img src={`${BASE}images/hero-icon.svg`} alt="Automation & Nature" />
        </div>
        <div className="hero-tag">QA Automation · Santiago, Chile</div>
        <h1 className="hero-title">
          <span className="line">Portafolio de</span>
          <span className="line"><span className="accent">Automatización QA</span></span>
        </h1>
        <p className="hero-sub">
          Analista Programador, construyendo un camino en automatización de pruebas
          con cuatro frameworks, dos lenguajes y un estándar: calidad sin compromiso.
        </p>
        <a href="#frameworks" className="hero-cta"
           onClick={(e) => { e.preventDefault(); scrollTo('frameworks') }}>
          Ver proyectos <span className="arrow">→</span>
        </a>
      </div>
    </section>
  )
}

function StatItem({ num, label }) {
  const val = parseInt(num) || 0
  const sfx = num.includes('+') ? '+' : num.includes('%') ? '%' : ''
  const [ref, c] = useCount(val)
  return (
    <div className="stat-item">
      <div ref={ref} className="stat-num">{c}{sfx}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

function Stats() {
  return (
    <Reveal>
      <div className="stats">
        <StatItem num="135+" label="Tests Automatizados" />
        <StatItem num="4" label="Frameworks" />
        <StatItem num="2" label="Lenguajes" />
        <StatItem num="100" label="Tests Exitosos" />
      </div>
    </Reveal>
  )
}

function About() {
  return (
    <section id="about">
      <Reveal d={1}><div className="section-tag">Sobre mí</div></Reveal>
      <Reveal d={2}><h2 className="section-title">¿Quién soy?</h2></Reveal>
      <Reveal d={3}>
        <div className="about-wrap">
          <div className="about-photo">
            <img src={`${BASE}images/profile.png`} alt="Alejandro Adriazola" loading="lazy" />
          </div>
          <h2>Alejandro Eduardo Adriazola Sorhaburu</h2>
          <div className="sub">Analista Programador · QA Automation</div>
          <p>
            <span className="hl">Analista Programador</span> titulado en INACAP, cursando Ingeniería
            en Informática. Mi interés por la calidad de software me llevó a especializarme en
            automatización de pruebas con Playwright, Karate, REST Assured y Cucumber BDD.
          </p>
          <p>
            Me motiva entender cada capa de una aplicación — de la interfaz a los contratos de API —
            y traducir eso en pruebas automatizadas, documentadas y mantenibles. Creo que un buen QA
            entiende el producto y anticipa riesgos, no solo encuentra bugs.
          </p>
          <p>
            También tengo experiencia en infraestructura Linux, ERP QAD y scripting Python/Bash.
            Mi objetivo es aportar desde la automatización y la calidad en proyectos desafiantes.
          </p>
          <div className="about-links">
            <a href="https://github.com/Signaltree" target="_blank" rel="noreferrer">🐙 GitHub</a>
            <a href="https://www.linkedin.com/in/aadriazola/" target="_blank" rel="noreferrer">💼 LinkedIn</a>
            <a href="mailto:ale.edu.adriazola@gmail.com">✉️ Email</a>
            <a href={`${BASE}cv.html`} target="_blank" rel="noreferrer">📄 Ver CV</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Skills() {
  return (
    <section id="skills">
      <Reveal d={1}><div className="section-tag">Stack técnico</div></Reveal>
      <Reveal d={2}><h2 className="section-title">Tecnologías y herramientas</h2></Reveal>
      <Reveal d={3}><p className="section-desc">Herramientas integradas en proyectos reales, de automatización a infraestructura y seguridad.</p></Reveal>
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

function FWCard({ fw, i }) {
  const mx = Math.max(...fw.tests.map(t => t.c))
  return (
    <Reveal d={Math.min(i + 1, 4)}>
      <div className="fw-card">
        <div className="fw-head">
          <div className="fw-icon">{fw.icon}</div>
          <h3>{fw.name}</h3>
        </div>
        <div className="fw-tech">{fw.tech}</div>
        <div className="fw-tests">
          {fw.tests.map((t, j) => (
            <div key={j} className="fw-row">
              <div className="lbl">
                <span>{t.l}</span>
                <span>{t.c} tests</span>
              </div>
              <div className="fw-bar">
                <div className="fw-fill" style={{ width: `${(t.c / mx) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <a href={fw.repo} target="_blank" rel="noreferrer" className="fw-repo">🐙 Ver en GitHub</a>
      </div>
    </Reveal>
  )
}

function Frameworks() {
  return (
    <section id="frameworks">
      <Reveal d={1}><div className="section-tag">Proyectos</div></Reveal>
      <Reveal d={2}><h2 className="section-title">Cuatro capas de calidad</h2></Reveal>
      <Reveal d={3}><p className="section-desc">135+ tests en cuatro frameworks. Cada suite cubre un aspecto distinto: interfaz, API, contratos y BDD.</p></Reveal>
      <div className="fw-grid">
        {frameworks.map((fw, i) => <FWCard key={i} fw={fw} i={i} />)}
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience">
      <Reveal d={1}><div className="section-tag">Trayectoria</div></Reveal>
      <Reveal d={2}><h2 className="section-title">Experiencia laboral</h2></Reveal>
      <Reveal d={3}><p className="section-desc">Infraestructura cloud, análisis de datos y automatización en entornos empresariales.</p></Reveal>
      <div className="exp-list">
        {experiences.map((ex, i) => (
          <Reveal key={i} d={Math.min(i + 1, 4)}>
            <div className="exp-item">
              <div className="exp-hdr">
                <div className="exp-co">
                  <h3>{ex.co}</h3>
                  <div className="role">{ex.role}</div>
                </div>
                <div className="exp-dt">{ex.period}</div>
              </div>
              <ul className="exp-dl">
                {ex.d.map((d, j) => <li key={j}>{d}</li>)}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Certifications() {
  return (
    <section id="certs">
      <Reveal d={1}><div className="section-tag">Credenciales</div></Reveal>
      <Reveal d={2}><h2 className="section-title">Formación y certificaciones</h2></Reveal>
      <Reveal d={3}><p className="section-desc">Respaldo académico y certificaciones en tecnología y calidad de software.</p></Reveal>
      <div className="certs-grid">
        {certifications.map((c, i) => (
          <Reveal key={i} d={Math.min(i + 1, 4)}>
            <div className="cert-item">
              <div className="cert-icon">{c.icon}</div>
              <h4>{c.name}</h4>
              <div className="iss">{c.issuer}</div>
              <div className={`st ${c.st === 'Obtenido' ? 'done' : 'go'}`}>{c.st}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact">
      <Reveal d={1}><div className="section-tag">Contacto</div></Reveal>
      <Reveal d={2}><h2 className="section-title">Hablemos</h2></Reveal>
      <Reveal d={3}>
        <div className="contact-wrap">
          <p className="contact-text">
            ¿Tienes un proyecto, una oportunidad laboral o quieres conversar sobre automatización
            y calidad de software? Estoy abierto a colaborar, aprender y aportar. Hablemos.
          </p>
          <div className="contact-links">
            <a href="mailto:ale.edu.adriazola@gmail.com">✉️ ale.edu.adriazola@gmail.com</a>
            <a href="tel:+56964362078">📞 +56 9 6436 2078</a>
            <a href="https://github.com/Signaltree" target="_blank" rel="noreferrer">🐙 GitHub</a>
            <a href="https://www.linkedin.com/in/aadriazola/" target="_blank" rel="noreferrer">💼 LinkedIn</a>
            <a href={`${BASE}cv.html`} target="_blank" rel="noreferrer">📄 Descargar CV</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer>
      <p>OpenCode · Vite + React · Rubik</p>
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
      <Stats />
      <About />
      <Skills />
      <Frameworks />
      <Experience />
      <Certifications />
      <Contact />
      <Footer />
    </>
  )
}
