import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { projects } from './projects';
import { profile } from './profile';
import { Terminal } from './Terminal';
import { ModeSwitch } from './ModeSwitch';
import './styles.css';
import './refinements.css';
import './motion.css';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '↗'}</span>;
}

function Professional({ onTerminal }: { onTerminal: () => void }) {
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    const elements = document.querySelectorAll('.section-heading, .project, .about-section, .background-grid, .contact-section');
    elements.forEach(element => {
      // Keep content already in view visible; animate only as new content enters.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add('reveal');
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach(element => element.classList.remove('reveal', 'is-visible'));
    };
  }, [showAllProjects]);

  function backToTop(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    window.history.replaceState(null, '', '#home');
    document.getElementById('intro-title')?.focus({ preventScroll: true });
  }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header wrap">
      <a className="wordmark" href="#home" aria-label="Joel Ojukwu home">joel<span>.</span></a>
      <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#background">Background</a><a href="#contact">Contact <Arrow /></a></nav>
      <ModeSwitch mode="professional" onChange={onTerminal} />
    </header>
    <main id="main">
      <section id="home" className="hero wrap" aria-labelledby="intro-title">
        <div className="eyebrow"><span className="tiny-line" /> SOFTWARE DEVELOPER · BACKEND & SYSTEMS</div>
        <h1 id="intro-title" tabIndex={-1}>Thoughtful software.<br />From the <em>inside out.</em></h1>
        <div className="hero-bottom"><div><p className="intro">Hi, I’m Joel Ojukwu. I build backend services and explore the systems behind them—from relational data to real-time communication.</p><a className="primary-link" href="#work">Explore my work <span aria-hidden="true">↓</span></a></div><div className="hero-aside"><span className="small-label">WHAT I CARE ABOUT</span><p>Clear decisions.<br />Dependable foundations.<br />Room to keep learning.</p></div></div>
        <div className="hero-rule"><span>SELECTED WORK & ENGINEERING NOTES</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section id="work" className="work-section wrap" aria-labelledby="work-title">
        <div className="section-heading"><div><span className="section-index">01 / THE WORK</span><h2 id="work-title">Behind the interface.</h2></div><p>A few things I’ve built and contributed to,<br className="desktop-break" /> and the thinking that went into them.</p></div>
        {projects.slice(0, showAllProjects ? projects.length : 3).map((project, index) => <article key={project.id} className={`project ${index === 0 ? 'featured' : ''}`}>
          <div className="project-top"><span className="project-category">{project.category}</span><div className="project-meta">{project.repository && <a className="repository-link" href={project.repository} target="_blank" rel="noreferrer">View source ↗</a>}<span className="project-number">/{project.number}</span></div></div>
          <div className="project-content"><div className="project-copy"><h3>{project.name}</h3><p>{project.summary}</p><ul className="tags" aria-label="Technologies">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
          {index === 0 ? <div className="architecture" role="img" aria-label="Clients connect to a Go API, which persists messages in PostgreSQL and distributes live events through Redis"><div className="diagram-caption"><span className="diagram-dot" /> A LOOK UNDER THE HOOD</div><div className="diagram-row"><span className="diagram-node">Clients</span><span className="connector">→</span><span className="diagram-node api-node">Go API</span></div><div className="diagram-branch">↓ <span>↓</span></div><div className="diagram-row stores"><span className="diagram-node">PostgreSQL<small>durable history</small></span><span className="diagram-node">Redis Pub/Sub<small>live events</small></span></div><span className="diagram-foot">Persist first. Then fan out.</span></div> : <span className="project-symbol" aria-hidden="true">{index === 1 ? '[ ✓ ]' : '{ … }'}</span>}</div>
          <button className="project-toggle" aria-expanded={openProject === project.id} aria-controls={`${project.id}-details`} onClick={() => setOpenProject(openProject === project.id ? null : project.id)}>{openProject === project.id ? 'Close engineering notes' : 'Read engineering notes'}<span aria-hidden="true">{openProject === project.id ? '−' : '+'}</span></button>
          <div id={`${project.id}-details`} className={`details-collapse ${openProject === project.id ? "is-open" : ""}`} inert={openProject !== project.id} aria-hidden={openProject !== project.id}><div className="details-clip"><div className="project-details"><div><h4>My contribution</h4><p>{project.contribution}</p><p className="boundary">{project.boundary}</p>{project.tutorial && <a className="repository-link" href={project.tutorial} target="_blank" rel="noreferrer">Original Go API tutorial ↗</a>}</div><div><h4>{project.repository ? "Engineering focus" : "Contribution areas"}</h4><ul>{project.decisions.map(decision => <li key={decision}>{decision}</li>)}</ul></div></div></div></div>
        </article>)}
        <div className="more-projects"><button className="more-button" aria-expanded={showAllProjects} onClick={() => { setShowAllProjects(!showAllProjects); if (showAllProjects) setOpenProject(null); }}>{showAllProjects ? 'Show selected projects' : `See more projects (${projects.length - 3})`} <span aria-hidden="true">{showAllProjects ? '−' : '+'}</span></button><span aria-live="polite">Showing {showAllProjects ? projects.length : 3} of {projects.length}</span></div>
        <p className="work-note"><span aria-hidden="true">↳</span> Professional work is anonymized to respect confidentiality. Descriptions focus on my contributions.</p>
      </section>

      <section id="about" className="about-section wrap" aria-labelledby="about-title"><div><span className="section-index">02 / A LITTLE ABOUT ME</span><h2 id="about-title">Curious about how<br />it all fits together.</h2><div className="initial-stamp" aria-hidden="true">JO<span>always learning</span></div></div><div className="about-copy"><p className="about-lead">I’m a software developer growing toward deeper backend and systems engineering work.</p><p>I’m drawn to the parts of software that make everything else possible: how data is modeled, how services communicate, and how an application behaves beyond a single request.</p><p>My work spans personal Go projects and professional contributions to authentication and case-management systems. I value clear tradeoffs, evidence over buzzwords, and understanding what I’m maintaining.</p><div className="focus-list"><span>CURRENT DIRECTION</span><p>Backend engineering <b>·</b> System design <b>·</b> Databases <b>·</b> Infrastructure</p></div></div></section>

      <section id="background" className="background-section wrap" aria-labelledby="background-title"><div className="section-heading"><div><span className="section-index">03 / BACKGROUND</span><h2 id="background-title">An engineering foundation.</h2></div><p>From electrical and computer engineering<br className="desktop-break" /> to building software systems.</p></div><div className="background-grid"><div><h3>Experience</h3><div className="timeline-entry"><span className="timeline-date">{profile.period}</span><h4>{profile.role}</h4><p>{profile.employer}</p></div></div><div><h3>Education</h3><div className="timeline-entry"><span className="timeline-date">{profile.educationPeriod}</span><h4>{profile.degree}</h4><p>B.Sc. · {profile.school}</p></div><div className="toolbox"><h3>Tools I work with</h3><p>{profile.tools.join(' / ')}</p></div></div></div></section>

      <section id="contact" className="contact-section wrap" aria-labelledby="contact-title"><span className="section-index">04 / LET’S CONNECT</span><div className="contact-row"><h2 id="contact-title">Good software starts<br />with a conversation.</h2><div className="contact-links"><a href={`mailto:${profile.email}`}>Say hello <Arrow /><small>{profile.email}</small></a><a href={profile.github} target="_blank" rel="noreferrer">Find me on GitHub <Arrow /></a></div></div></section>
    </main>
    <footer className="footer wrap"><span>© {new Date().getFullYear()} Joel Ojukwu</span><span>Built with care. Kept simple.</span><a className="back-top" href="#home" onClick={backToTop}>Back to top <span aria-hidden="true">↑</span></a></footer>
  </>;
}

function App() {
  const [mode, setMode] = useState<'professional' | 'terminal'>(() => new URLSearchParams(window.location.search).get('mode') === 'terminal' ? 'terminal' : 'professional');
  useEffect(() => {
    const readLocation = () => setMode(new URLSearchParams(window.location.search).get('mode') === 'terminal' ? 'terminal' : 'professional');
    window.addEventListener('popstate', readLocation);
    return () => window.removeEventListener('popstate', readLocation);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'terminal' ? '#080c0a' : '#fff8ed');
  }, [mode]);
  function switchMode(next: 'professional' | 'terminal') {
    const url = new URL(window.location.href);
    if (next === 'terminal') url.searchParams.set('mode', 'terminal');
    else url.searchParams.delete('mode');
    url.hash = '';
    window.history.pushState(null, '', url);
    setMode(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  return mode === 'terminal' ? <Terminal onExit={() => switchMode('professional')} /> : <Professional onTerminal={() => switchMode('terminal')} />;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
