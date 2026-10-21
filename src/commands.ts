type Entry = { id: string; name: string; repository?: string; tutorial?: string };
export type CommandResult =
  | { type: 'view'; view: 'home' | 'projects' | 'about' | 'background' | 'contact' | 'help'; projectId?: string }
  | { type: 'link'; url: string; label: string }
  | { type: 'message'; message: string }
  | { type: 'clock' } | { type: 'game'; guess?: number; stop?: boolean }
  | { type: 'clear' } | { type: 'exit' } | { type: 'history' };

export function resolveCommand(raw: string, entries: Entry[]): CommandResult {
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  const [action, ...args] = normalized.split(' ');
  const routes = { home: 'home', whoami: 'home', projects: 'projects', ls: 'projects', about: 'about', skills: 'about', background: 'background', contact: 'contact', help: 'help' } as const;
  if (Object.hasOwn(routes, normalized)) return { type: 'view', view: routes[normalized as keyof typeof routes] };
  if (normalized === 'ls projects' || normalized === 'ls -la') return { type: 'view', view: 'projects' };
  if (normalized === 'pwd') return { type: 'message', message: '/home/joel/portfolio' };
  if (normalized === 'hello' || normalized === 'hi') return { type: 'message', message: 'Hello, visitor! Welcome to my corner of the web. Make yourself at home. Type projects to explore, or game for a quick detour.' };
  if (['bye', 'goodbye', 'good bye'].includes(normalized)) return { type: 'message', message: 'Thanks for stopping by! May your builds be green and your bugs reproducible. You’re welcome back anytime.' };
  if (normalized === 'ping') return { type: 'message', message: 'pong 🏓 — local response, no network packets sent.' };
  if (normalized === 'time' || normalized === 'date') return { type: 'clock' };
  if (normalized === 'ip') return { type: 'message', message: 'No IP lookup here. This portfolio does not request your public IP from an external service.' };
  if (normalized === 'sudo') return { type: 'message', message: 'Nice try. You already have full access to the portfolio. No root required.' };
  if (normalized === 'coffee') return { type: 'message', message: '☕ One virtual coffee, freshly compiled. No dependencies added.' };
  if (normalized === 'fortune') return { type: 'message', message: 'Your next breakthrough is hiding in a well-placed log statement.' };
  if (normalized === 'game' || normalized === 'game start') return { type: 'game' };
  if (normalized === 'game stop') return { type: 'game', stop: true };
  if (action === 'guess') {
    if (args.length !== 1 || !/^\d+$/.test(args[0]) || Number(args[0]) < 1 || Number(args[0]) > 100) return { type: 'message', message: 'Usage: guess <1–100>. Start a round with game.' };
    return { type: 'game', guess: Number(args[0]) };
  }
  if (normalized === 'clear' || normalized === 'history') return { type: normalized };
  if (normalized === 'exit' || normalized === 'professional') return { type: 'exit' };
  if (action === 'cat') {
    const files = { 'about.md': 'about', 'skills.txt': 'about', 'experience.md': 'background', 'contact.txt': 'contact', 'readme.md': 'home' } as const;
    if (args.length === 1 && Object.hasOwn(files, args[0])) return { type: 'view', view: files[args[0] as keyof typeof files] };
    return { type: 'message', message: 'Available files: README.md, about.md, skills.txt, experience.md, contact.txt' };
  }
  if (action === 'open') {
    const [query, flag, ...extra] = args;
    if (!query || extra.length || (flag && !['--source', '-source', '--tutorial', '-tutorial'].includes(flag))) return { type: 'message', message: 'Usage: open <number|project-id> [--source|--tutorial]. Try open 1 --source.' };
    const entry = entries.find((p, index) => String(index + 1) === query || p.id === query);
    if (!entry) return { type: 'message', message: `Project not found. Type projects to see numbers and IDs.` };
    if (flag) {
      const tutorial = flag.endsWith('tutorial');
      const url = tutorial ? entry.tutorial : entry.repository;
      if (!url) return { type: 'message', message: tutorial ? 'No tutorial link for this project.' : 'Source is not public for this professional project. Read its anonymized contribution notes with open ' + query + '.' };
      return { type: 'link', url, label: tutorial ? 'Original tutorial' : `${entry.name} source` };
    }
    return { type: 'view', view: 'projects', projectId: entry.id };
  }
  return { type: 'message', message: `Unknown command: ${raw}. Type help for available commands.` };
}
