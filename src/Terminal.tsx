import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { projects } from './projects';
import { profile } from './profile';
import { ModeSwitch } from './ModeSwitch';
import { resolveCommand } from './commands';
import './terminal.css';
import './terminal-polish.css';
import './terminal-dock.css';

const views = ['home', 'projects', 'about', 'background', 'contact', 'help'] as const;
type View = typeof views[number];
const help = [
  ['help', 'Show this command reference'], ['home / whoami', 'Return to the introduction'],
  ['projects', 'List all projects'], ['open <number>', 'Read a project, e.g. open 1'],
  ['open 1 --source', 'Open a public repository (-source also works)'],
  ['open 5 --tutorial', 'Open the credited EventApp tutorial'],
  ['ls / ls -la', 'Browse the project directory'], ['cat about.md', 'Read a file: skills.txt, experience.md, contact.txt'],
  ['pwd', 'Print the portfolio path'], ['history', 'List recent commands'],
  ['hello / bye', 'A greeting or a farewell'], ['ping', 'An entirely local pong'],
  ['time / date', 'Your device’s current local time'], ['coffee / fortune', 'A small break from the code'],
  ['game', 'Start a number-guessing game (1–100)'], ['guess <number>', 'Make a guess; get higher/lower hints'], ['game stop', 'End the current round'],
  ['about', 'Read about my engineering focus'], ['skills', 'Show the tools I work with'],
  ['background', 'Experience and education'], ['contact', 'Email and GitHub'],
  ['clear', 'Clear command output'], ['exit', 'Switch to Professional mode'],
];

export function Terminal({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<View>('home');
  const [selected, setSelected] = useState<string | null>(null);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyPosition, setHistoryPosition] = useState(-1);
  const [output, setOutput] = useState<{ command: string; message: string; link?: { url: string; label: string } }[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [consoleExpanded, setConsoleExpanded] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const contentPanel = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const outputPanel = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const game = useRef<{ target: number; attempts: number } | null>(null);
  const [gameStatus, setGameStatus] = useState('');
  const [gameGuess, setGameGuess] = useState('');

  useEffect(() => {
    if (!output.length) return;
    const panel = outputPanel.current;
    if (panel) panel.scrollTop = panel.scrollHeight;
    // Keep consecutive commands usable without moving the whole page.
    input.current?.focus({ preventScroll: true });
  }, [output, consoleExpanded]);

  function playGame(guess?: number, stop?: boolean): string {
    if (stop) { game.current = null; setGameStatus(''); return 'Round ended. Type game whenever you want to play again.'; }
    if (guess === undefined) {
      const random = new Uint32Array(1);
      window.crypto.getRandomValues(random);
      game.current = { target: (random[0] % 100) + 1, attempts: 0 };
      const message = 'I picked a number from 1 to 100. Type guess 50 or use the game controls. Can you find it in 7 guesses?';
      setGameStatus(message); return message;
    }
    if (!game.current) return 'No active round. Type game to start.';
    const round = game.current;
    round.attempts += 1;
    let message: string;
    if (guess === round.target) {
      message = `You found it: ${guess}! ${round.attempts} ${round.attempts === 1 ? 'guess' : 'guesses'}. ${round.attempts <= 7 ? 'Binary-search instincts. Nicely done.' : 'Persistence pays off.'} Type game for another round.`;
      game.current = null;
    } else message = `${guess} is too ${guess < round.target ? 'low' : 'high'}. Try ${guess < round.target ? 'higher' : 'lower'}. Guesses: ${round.attempts}.`;
    setGameStatus(message); return message;
  }

  useEffect(() => {
    if (started.current) heading.current?.focus({ preventScroll: true });
    started.current = true;
  }, [view, selected]);

  function navigate(next: View, projectId: string | null = null) {
    setView(next); setSelected(projectId);
    setConsoleExpanded(false);
    contentPanel.current?.scrollTo({ top: 0, behavior: 'instant' });
    setAnnouncement(projectId ? `Opened ${projects.find(p => p.id === projectId)?.name}` : `${next} selected`);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const raw = command.trim();
    if (!raw) return;
    setHistory(previous => [...previous, raw].slice(-50)); setHistoryPosition(-1); setCommand('');
    const result = resolveCommand(raw, projects);
    if (result.type === 'clear') { setOutput([]); setAnnouncement('Command output cleared'); return; }
    if (result.type === 'exit') { onExit(); return; }
    let message: string;
    let link: { url: string; label: string } | undefined;
    if (result.type === 'view') {
      navigate(result.view, result.projectId ?? null);
      message = result.projectId ? `Opened ${projects.find(p => p.id === result.projectId)?.name}.` : `Showing ${result.view}.`;
    } else if (result.type === 'link') {
      // The URL comes only from our curated project data, never command input.
      window.open(result.url, '_blank', 'noopener,noreferrer');
      message = 'Opening link in a new tab. If your browser blocked it, use the link below.';
      link = { url: result.url, label: result.label };
    } else if (result.type === 'history') message = [...history, raw].slice(-15).map((item, index) => `${index + 1}  ${item}`).join('\n');
    else if (result.type === 'clock') message = `Local device time: ${new Date().toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' })}`;
    else if (result.type === 'game') message = playGame(result.guess, result.stop);
    else message = result.message;
    if (result.type !== 'view') setConsoleExpanded(true);
    setOutput(previous => [...previous, { command: raw, message, link }].slice(-5));
    setAnnouncement(message);
  }

  function recall(event: KeyboardEvent<HTMLInputElement>) {
    if (event.ctrlKey && event.key.toLowerCase() === 'l') { event.preventDefault(); setOutput([]); return; }
    if (event.key === 'Tab' && command && !command.includes(' ')) {
      const matches = ['help', 'home', 'whoami', 'projects', 'open', 'about', 'skills', 'background', 'contact', 'clear', 'exit', 'history', 'cat', 'pwd', 'ls', 'hello', 'bye', 'ping', 'time', 'date', 'coffee', 'fortune', 'game', 'guess'].filter(item => item.startsWith(command.toLowerCase()));
      if (matches.length === 1) { event.preventDefault(); setCommand(matches[0]); }
    }
    if ((event.key !== 'ArrowUp' && event.key !== 'ArrowDown') || !history.length) return;
    event.preventDefault();
    const next = event.key === 'ArrowUp' ? Math.min(historyPosition + 1, history.length - 1) : Math.max(historyPosition - 1, -1);
    setHistoryPosition(next); setCommand(next === -1 ? '' : history[history.length - 1 - next]);
  }

  const project = projects.find(p => p.id === selected);
  const title = project ? project.name : ({ home: 'Hello, I’m Joel.', projects: 'Selected work. Full directory.', about: 'How I think. What I build.', background: 'Experience & education.', contact: 'Open a conversation.', help: 'A few commands. No prerequisites.' })[view];

  return <div className="terminal-shell">
    <a className="skip-link" href="#terminal-content">Skip to content</a>
    <header className="terminal-header"><a className="terminal-brand" href="?mode=terminal" onClick={event => { event.preventDefault(); navigate('home'); }}><span aria-hidden="true">[j.o]</span> portfolio<span className="terminal-header-path"> / interactive</span></a><ModeSwitch mode="terminal" onChange={onExit} /></header>
    <div className="terminal-workspace">
      <aside className="terminal-sidebar"><div className="terminal-sidebar-label">EXPLORER</div><nav aria-label="Terminal sections">{views.map((item, index) => <button key={item} aria-current={view === item ? 'page' : undefined} onClick={() => navigate(item)}><span className="terminal-nav-number">0{index + 1}</span><span>{item === 'home' ? 'whoami' : item}</span><span className="terminal-nav-marker" aria-hidden="true">{view === item ? '↵' : ''}</span></button>)}</nav><div className="terminal-sidebar-note"><span aria-hidden="true">//</span> Click to explore.<br />Type if you prefer.</div><div className="terminal-sidebar-bottom"><span className="terminal-status-dot" /> backend & systems</div></aside>
      <div className="terminal-main"><div className="terminal-tabbar"><span><span aria-hidden="true">⌘</span> {project ? `${project.id}.md` : `${view}.md`}</span><span>UTF-8 <span aria-hidden="true">·</span> READ ONLY</span></div>

        <main id="terminal-content" className="terminal-content" ref={contentPanel}><div className="terminal-breadcrumb">joel <span>/</span> portfolio <span>/</span> {view}{project && <> <span>/</span> {project.id}</>}</div><div className="terminal-content-heading"><span className="terminal-comment">// {view === 'home' ? 'a different interface. the same engineer.' : 'explore the work behind the interface'}</span><h1 ref={heading} tabIndex={-1}>{title}</h1></div>
          <div key={`${view}-${selected}`} className="terminal-view">
          {view === 'home' && <><p className="terminal-lead">Software developer.<br /><span>Backend-minded. Architecture-curious.</span></p><p className="terminal-prose">{profile.introduction}</p><div className="terminal-welcome"><span className="terminal-comment">$ cat focus.txt</span><div><span>01</span> Relational data & application design</div><div><span>02</span> HTTP, WebSockets & real-time delivery</div><div><span>03</span> Infrastructure & deployment</div></div><div className="terminal-home-actions"><button onClick={() => navigate('projects')}>Explore projects <span aria-hidden="true">→</span></button><button onClick={() => { navigate('help'); input.current?.focus(); }}>Show commands <span aria-hidden="true">↗</span></button></div><p className="terminal-hint">Try <button onClick={() => navigate('help')}>help</button> in the docked prompt below. Everything is also clickable.</p></>}
          {view === 'projects' && !project && <><p className="terminal-prose">Independent engineering and professional contributions. Select an entry to read its scope and technical focus.</p><div className="terminal-projects">{projects.map((entry, index) => <button key={entry.id} onClick={() => navigate('projects', entry.id)}><span className="terminal-project-index">{String(index + 1).padStart(2, '0')}</span><div><span className="terminal-comment">{entry.category}</span><h2>{entry.name}</h2><p>{entry.summary}</p><span className="terminal-project-id">{entry.id}</span><span className="terminal-tech">{entry.tags.join(' · ')}</span></div><span aria-hidden="true">↗</span></button>)}</div><p className="terminal-hint">Or type <code>open 1</code> · Professional entries are anonymized under NDA.</p></>}
          {view === 'projects' && project && <><button className="terminal-back" onClick={() => navigate('projects')}>← All projects</button><span className="terminal-comment">{project.category}</span><p className="terminal-lead project-lead">{project.summary}</p><div className="terminal-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><h2 className="terminal-subheading">01 / My contribution</h2><p className="terminal-prose">{project.contribution}</p><h2 className="terminal-subheading">02 / {project.repository ? 'Engineering focus' : 'Contribution areas'}</h2><ul className="terminal-decisions">{project.decisions.map(decision => <li key={decision}>{decision}</li>)}</ul><div className="terminal-boundary"><span>// scope & attribution</span><p>{project.boundary}</p></div><div className="terminal-external-links">{project.repository && <a href={project.repository} target="_blank" rel="noreferrer">View source ↗</a>}{project.tutorial && <a href={project.tutorial} target="_blank" rel="noreferrer">Original Go API tutorial ↗</a>}</div></>}
          {view === 'about' && <><p className="terminal-lead">I’m drawn to the systems<br /><span>that make everything else possible.</span></p><p className="terminal-prose">How data is modeled. How services communicate. How an application behaves beyond a single request.</p><p className="terminal-prose">{profile.about}</p><h2 className="terminal-subheading">Tools I work with</h2><div className="terminal-tags">{profile.tools.map(tool => <span key={tool}>{tool}</span>)}</div><p className="terminal-hint">Current direction: backend engineering / system design / databases / infrastructure.</p></>}
          {view === 'background' && <><p className="terminal-prose">An engineering foundation, with a focus on software systems.</p><div className="terminal-record"><span className="terminal-comment">experience / {profile.period}</span><h2>{profile.role}</h2><p>{profile.employer}</p></div><div className="terminal-record"><span className="terminal-comment">education / {profile.educationPeriod}</span><h2>{profile.degree}</h2><p>B.Sc. · {profile.school}</p></div></>}
          {view === 'contact' && <><p className="terminal-lead">Good software starts<br /><span>with a conversation.</span></p><p className="terminal-prose">For opportunities, engineering conversations, or a closer look at my work:</p><div className="terminal-contact"><a href={`mailto:${profile.email}`}><span>email</span>{profile.email} ↗</a><a href={profile.github} target="_blank" rel="noreferrer"><span>github</span>github.com/JoelJokyu ↗</a></div></>}
          {view === 'help' && <><p className="terminal-prose">This is a portfolio interface, not a real shell. Use these commands or the section navigation. No setup needed.</p><dl className="terminal-help">{help.map(([name, description]) => <div key={name}><dt>{name}</dt><dd>{description}</dd></div>)}</dl><p className="terminal-hint">↑ / ↓ recalls history. Tab completes a unique command. Ctrl+L clears output. Commands are case-insensitive.</p></>}
          </div>
        </main>
        <section className="terminal-console" aria-label="Portfolio command console"><div className="terminal-console-title"><span>COMMAND LINE</span><button type="button" className="console-toggle" aria-expanded={consoleExpanded} aria-controls="console-results" onClick={() => setConsoleExpanded(!consoleExpanded)}>{consoleExpanded ? "Hide output ↓" : `Show output${output.length ? ` (${output.length})` : ""} ↑`}</button></div><div id="console-results" hidden={!consoleExpanded}>{output.length > 0 && <div className="terminal-output" ref={outputPanel} role="region" aria-label="Recent command output" tabIndex={0}>{output.map((entry, index) => <div key={index}><p><span>❯</span> {entry.command}</p><p>{entry.message}</p>{entry.link && <a href={entry.link.url} target="_blank" rel="noreferrer">{entry.link.label} ↗</a>}</div>)}</div>}</div><form onSubmit={submit} className="terminal-prompt"><label htmlFor="terminal-command"><span className="terminal-prompt-user">visitor</span><span className="terminal-prompt-path"> ~/joel</span><span aria-hidden="true"> ❯</span><span className="sr-only"> Portfolio command</span></label><div className="terminal-input-wrap"><input id="terminal-command" ref={input} value={command} onChange={event => { setCommand(event.target.value); setHistoryPosition(-1); }} onKeyDown={recall} autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder="help" aria-describedby="terminal-input-help" maxLength={200} /><span className={`terminal-underscore ${command ? "has-command" : ""}`} aria-hidden="true">_</span></div><button type="submit" aria-label="Run command">↵</button></form><div className="terminal-toys"><button type="button" onClick={() => { const message = playGame(); setConsoleExpanded(true); setAnnouncement(message); }}>Play a quick game ↗</button><span>Try hello, ping, time, coffee</span></div>{gameStatus && consoleExpanded && <div className="terminal-game"><div className="terminal-game-title">NUMBER HUNT <button type="button" aria-label="Close number game" onClick={() => { playGame(undefined, true); }}>×</button></div><p role="status">{gameStatus}</p>{game.current ? <form onSubmit={event => { event.preventDefault(); const value = Number(gameGuess); if (!Number.isInteger(value) || value < 1 || value > 100) return; setAnnouncement(playGame(value)); setGameGuess(""); }}><label htmlFor="game-guess">Your guess</label><input id="game-guess" type="number" min="1" max="100" required value={gameGuess} onChange={event => setGameGuess(event.target.value)} /><button type="submit">Guess ↵</button></form> : <button type="button" onClick={() => setAnnouncement(playGame())}>Play again</button>}</div>}<span id="terminal-input-help" className="sr-only">Type help for commands. Use up and down arrow keys to recall command history.</span></section>

      </div>
    </div><footer className="terminal-statusbar"><span><span aria-hidden="true">⑂</span> main <span className="terminal-status-separator">/</span> Joel Ojukwu</span><span>React + TypeScript <span className="terminal-status-separator">·</span> No shell access required</span></footer><div className="sr-only" role="status" aria-live="polite">{announcement}</div>
  </div>;
}
