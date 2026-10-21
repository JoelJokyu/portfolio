export type Project = {
  id: string; number: string; category: string; name: string; summary: string;
  tags: string[]; contribution: string; decisions: string[]; boundary: string; repository?: string; tutorial?: string;
};

export const projects: Project[] = [
  {
    id: 'rt-chat', number: '01', category: 'Independent project · Featured', name: 'RT Chat',
    repository: 'https://github.com/JoelJokyu/rt-chat',
    summary: 'A community messaging backend. Persistent conversations, membership-based permissions, and live events across API instances.',
    tags: ['Go', 'PostgreSQL', 'WebSockets', 'Redis', 'Docker'],
    contribution: 'Designed and implemented a community messaging backend in Go, covering HTTP APIs, relational data modeling, session authentication, role-based access, and WebSocket messaging. I chose this domain to examine how persistence, authorization, and real-time delivery fit together in a substantial application.',
    decisions: ['Keep HTTP handlers, application rules, and database queries in explicit layers.', 'Persist messages in PostgreSQL before distributing live events through Redis Pub/Sub.', 'Use timestamp-and-ID cursors and a partial index for predictable message-history reads.', 'Give each connection a bounded outbound queue so slow clients do not stall a channel.'],
    boundary: 'V1 scope: PostgreSQL provides durable history; Redis Pub/Sub provides transient live events. Clients can retrieve history after missed events. Production capacity and guaranteed event delivery have not been established.',
  },
  {
    id: 'authentication', number: '02', category: 'Professional work · Anonymized', name: 'Authentication & approval platform',
    summary: 'Developed the v2 backend for a customer authentication and approval platform, alongside app/SDK integration and client-environment deployments.',
    tags: ['Node.js', 'MariaDB', 'API design', 'Docker', 'Linux'],
    contribution: 'Built the v2 backend within a team product, developing enrollment and authentication APIs, integrating native face processing, and working on the app and SDKs. I was also responsible for server setup and deployment into client environments.',
    decisions: ['Implemented device-key-signed approval flows and server-controlled step-up verification.', 'Developed SDK/backend contracts, enrollment workflows, and status APIs.', 'Integrated C++ face inference with backend verification workflows.', 'Handled container packaging, database migrations, Linux server configuration, and HTTPS deployment.'],
    boundary: 'Professional work, anonymized under NDA. Internal architecture, security parameters, customer configurations, and proprietary implementation details are omitted.',
  },
  {
    id: 'case-management', number: '03', category: 'Professional work · Anonymized', name: 'Fraud case management',
    summary: 'Extended a Laravel case-management application with relational reporting, administrative approval workflows, and document generation.',
    tags: ['Laravel', 'PHP', 'SQL', 'React', 'TypeScript'],
    contribution: 'Implemented and extended reporting queries, blacklist request and approval features, police-report PDFs, and persistent notification features across the backend and React interface.',
    decisions: ['Updated relational queries and recovery aggregation to reflect institution-to-case relationships.', 'Extended approval workflows and audit recording.', 'Connected database-backed report fields to PDF output.', 'Implemented notification starring across persistence, API responses, and interface state.'],
    boundary: 'Team project presented in anonymized form under NDA. No real case information, internal interfaces, or proprietary source is shown.',
  },
  {
    id: 'face-processing', number: '04', category: 'Professional component · Anonymized', name: 'Native face processing',
    summary: 'Developed and extended a C++ face-processing application integrating ArcFace embeddings, presentation-attack detection models, and image-quality checks.',
    tags: ['C++', 'ArcFace', 'ONNX Runtime', 'PAD', 'OpenCV', 'dlib'],
    contribution: 'Worked on the native processing application and its backend integration, building on an existing processor and pretrained models. My changes covered quality checks, model-aware descriptor comparison, spoof-result handling, structured JSON output, and evaluation tooling.',
    decisions: ['Integrated ArcFace embeddings through ONNX Runtime alongside dlib descriptors for face comparison.', 'Refined PAD model preprocessing and spoof-result metadata for the calling backend.', 'Added blur, brightness, face-size, and pose checks with actionable rejection results.', 'Built repeatable comparison scenarios for identity matching and spoof-related signals.'],
    boundary: 'An anonymized component of the authentication platform. Existing libraries and pretrained models underpin the inference; model integration and smoke tests do not establish biometric accuracy or certified liveness. Internal processing structure and configuration are withheld.',
  },
  {
    id: 'eventapp', number: '05', category: 'Independent extension · Tutorial foundation', name: 'EventApp',
    repository: 'https://github.com/JoelJokyu/EventTracker',
    tutorial: 'https://youtu.be/ERZadn9artM',
    summary: 'An event management application with a React and TypeScript interface, a Go REST API, relational persistence, and Redis-backed caching and request limiting.',
    tags: ['Go', 'Gin', 'SQLite', 'React', 'TypeScript', 'Redis'],
    contribution: 'Developed the React and TypeScript frontend and integrated event, attendance, authentication, and profile workflows with a tutorial-based Go API. Extended middleware and application behavior; my repository changes also include Redis caching and request limiting.',
    decisions: ['Connect event and attendance screens to a shared API client.', 'Model users, events, and attendance in a relational database.', 'Explore cache-aside event reads and Redis request counters.'],
    boundary: 'The base Go API follows the credited tutorial. Frontend development and integration are my extensions; the precise tutorial-versus-extension boundary for Redis and middleware changes remains to be documented.',
  },
];
