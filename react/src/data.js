const THEMES = {
  zsh: {
    label: 'zsh', title: 'zsh — Geist Mono on warm black',
    bg: '#100E0C', fg: '#E8E4DE', accent: '#A3E635', mut: '#8B857C',
    dim: '#847D73', faint: '#6B6459',
    line: 'rgba(232,228,222,0.08)', line2: 'rgba(232,228,222,0.14)',
    tint: 'rgba(163,230,53,0.06)', tint2: 'rgba(163,230,53,0.10)',
    chrome: 'rgba(16,14,12,0.88)',
    font: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    radius: '4px', radiusLg: '6px', scan: '0.5'
  },
  pwsh: {
    label: 'pwsh', title: 'Windows PowerShell — Consolas on navy',
    bg: '#012456', fg: '#F2F2F2', accent: '#F3D371', mut: '#A8B4C8',
    dim: '#94A2B8', faint: '#6E7E96',
    line: 'rgba(242,242,242,0.12)', line2: 'rgba(242,242,242,0.20)',
    tint: 'rgba(243,211,113,0.06)', tint2: 'rgba(243,211,113,0.16)',
    chrome: 'rgba(1,36,86,0.92)',
    font: "Consolas, 'Inconsolata', 'Lucida Console', ui-monospace, monospace",
    radius: '0px', radiusLg: '0px', scan: '0.14'
  }
};

const SHELL = {
  zsh: {
    prompt: '%', caret: '_', arrow: '→', bullet: '·', sep: '/',
    whoami: 'whoami --verbose',
    ls: 'ls -l projects/',
    lsHeader: 'total 5 — select an entry to read its case file',
    cat: (f) => 'cat projects/' + f + '.md',
    catBare: (f) => 'cat ' + f + '.md',
    trace: (s) => 'trace --stage ' + s,
    approach: 'cat philosophy.md',
    tree: 'tree stack/',
    log: 'git log --oneline --author=arvind',
    readme: 'cat about.md',
    mail: 'mail arvind',
    help: 'help',
    resume: 'open resume.pdf',
    back: 'back to ls',
    deps: '# dependencies',
    marker: '##',
    navGlyph: '›',
    branch: '├─', last: '└─',
    dirLabel: (n) => n + '/',
    fileLabel: (f) => f + '.md',
    exit: (cwd) => 'arvind@portfolio ' + cwd + ' % exit',
    exitNote: 'Session ended. Figures are from my résumé — happy to walk through any of them.',
    hint: 'scroll or select a command'
  },
  pwsh: {
    prompt: 'PS C:\\portfolio>', caret: '_', arrow: '→', bullet: '-', sep: '\\',
    whoami: 'Get-LocalUser arvind | Format-List *',
    ls: 'Get-ChildItem .\\projects\\',
    lsHeader: 'Directory: C:\\portfolio — Mode  LastWriteTime  Name',
    cat: (f) => 'Get-Content .\\projects\\' + f + '.md',
    catBare: (f) => 'Get-Content ' + f + '.md',
    trace: (s) => 'Get-Trace -Stage ' + s,
    approach: 'Get-Content .\\philosophy.md',
    tree: 'Get-ChildItem .\\stack\\ -Recurse',
    log: 'git log --oneline --author=arvind',
    readme: 'Get-Content .\\about.md',
    mail: 'Send-MailMessage -To arvind',
    help: 'Get-Help *',
    resume: 'Invoke-Item .\\resume.pdf',
    back: 'back to Get-ChildItem',
    deps: '# dependencies',
    marker: '#>',
    navGlyph: '›',
    branch: '├─', last: '└─',
    dirLabel: (n) => n.charAt(0).toUpperCase() + n.slice(1),
    fileLabel: (f) => f + '.md',
    exit: () => 'PS C:\\portfolio> exit',
    exitNote: 'Session ended. Figures are from my résumé — happy to walk through any of them.',
    hint: 'scroll or select a command'
  }
};

const PROJECTS = [
  {
    file: 'aria', name: 'ARIA', year: '2026', domain: 'enterprise ai agent',
    perm: '-rw-r--r--', dirmeta: '-a---  03/18/2026  9:14 AM',
    one: 'reimbursement approvals from ten days to one',
    lede: 'Employee reimbursements at GSK moved through inboxes, attachments and policy documents across four countries. ARIA reads the receipt, applies the policy, and files the request through Workday — approval time fell from ten days to one.',
    metrics: [{ v: '10d → 1d', l: 'approval time, 90% faster' }, { v: '1,000+', l: 'requests processed monthly' }, { v: '4', l: 'countries in production' }],
    stack: ['Python', 'C3.AI', 'Workday API', 'OCR', 'Copilot Studio', 'Azure', 'Docker'],
    chapters: [
      { head: 'the problem', body: 'Reimbursement is a policy question disguised as paperwork: someone has to read the request, apply the rules, and file it. Across four countries that took ten days per approval, and almost none of it was processing time.' },
      { head: 'the decision', body: 'Separate reading from deciding. OCR extracts the request, a policy-reasoning layer reaches the decision, and Workday integration executes it — so the agent completes the process rather than recommending an outcome to someone else.' },
      { head: 'shipped alone', body: 'I took ARIA from architecture to production as the sole engineer, including the country rollout and the integration surface. It now runs on GSK\'s internal AI platform at over a thousand requests a month, which is the number that matters — a pilot that survives four countries is a different artifact from a demo.' }
    ],
    stages: [
      { label: 'intake', slug: 'intake', role: 'claim capture', detail: 'Reimbursement requests arrive as documents. OCR turns them into structured fields so the policy layer works on data rather than an image.', flow: ['request intake', 'ocr', 'structured fields'] },
      { label: 'policy', slug: 'policy', role: 'policy-based reasoning', detail: 'The agent reasons over reimbursement policy to reach a decision, applied across four countries.', flow: ['policy reasoning', 'four countries', 'decision'] },
      { label: 'workday', slug: 'workday', role: 'system of record', detail: 'Requests are filed through Workday integration, which is what makes the agent an end-to-end process rather than a recommendation.', flow: ['workday integration', 'request filed'] },
      { label: 'approval', slug: 'approval', role: 'ten days to one', detail: 'Approval time fell from ten days to one — a 90% reduction — with more than a thousand requests processed each month.', flow: ['10 days → 1 day', '1,000+ / month', '90% faster'] },
      { label: 'platform', slug: 'platform', role: 'where it runs', detail: 'Scaled to production on GSK\'s internal AI platform. I maintain the C3.ai agentic AI infrastructure it sits on and containerised the development workflow with Docker and CI/CD.', flow: ['gsk internal ai platform', 'c3.ai infrastructure', 'docker, ci/cd'] }
    ]
  },
  {
    file: 'sentinel', name: 'Clinical PII Classifier', year: '2025', domain: 'llm data pipeline',
    perm: '-rw-r--r--', dirmeta: '-a---  11/04/2025  4:48 PM',
    one: 'PII and PHI classified across clinical datasets in seconds',
    lede: 'Clinical datasets ran roughly seventy-five columns wide, and deciding which of them held personal or health information was a manual read. The pipeline classifies them and emits three role-based variants automatically.',
    metrics: [{ v: '15m → <10s', l: 'per-file processing time' }, { v: '65% → 98%', l: 'classification accuracy' }, { v: '3', l: 'role-based variants generated' }],
    stack: ['Python', 'Databricks', 'LLM classification', 'Delta Lake', 'Azure', 'SQL'],
    chapters: [
      { head: 'the problem', body: 'Every clinical dataset handed onward needed a judgement call across roughly seventy-five columns: which of these hold personal or health information, and who is allowed to see them. By hand that ran about fifteen minutes a file.' },
      { head: 'the decision', body: 'Classify with an LLM pipeline in Databricks, then generate the three role-based variants as an output of the classification rather than a separate manual step. Accuracy went from 65% to 98% and processing from roughly fifteen minutes to under ten seconds per file.' },
      { head: 'why variants matter', body: 'The valuable output is not the label — it is the three ready-to-use datasets. Producing them automatically removed a manual step from every file that passed through.' }
    ],
    stages: [
      { label: 'ingest', slug: 'ingest', role: 'clinical datasets', detail: 'Clinical datasets of roughly seventy-five columns processed in Databricks.', flow: ['databricks', '~75 columns'] },
      { label: 'classify', slug: 'classify', role: 'the llm pass', detail: 'An LLM-powered pipeline identifies PII and PHI across the dataset.', flow: ['llm pipeline', 'pii', 'phi'] },
      { label: 'variants', slug: 'variants', role: 'role-based outputs', detail: 'Three role-based dataset variants generated automatically from the classification result.', flow: ['3 variants', 'generated automatically'] },
      { label: 'accuracy', slug: 'accuracy', role: 'the measured outcome', detail: 'Classification accuracy improved from 65% to 98%.', flow: ['65% → 98%'] },
      { label: 'speed', slug: 'speed', role: 'fifteen minutes to ten seconds', detail: 'Processing time per file fell from roughly fifteen minutes to under ten seconds.', flow: ['~15 min → <10s', 'per file'] }
    ]
  },
  {
    file: 'rag-docs-assistant', name: 'RAG-DOCS-ASSISTANT', year: '2026', domain: 'retrieval + evaluation + agentic routing',
    perm: '-rw-r--r--', dirmeta: '-a---  08/24/2026  2:06 PM',
    one: 'built and measured whether retrieval actually fixes hallucination',
    lede: 'LLMs answer from frozen training data — confidently wrong or outdated, with no way to tell from the outside. This is a funded bet, not a hunch: Decagon ($4.5B) and Sierra ($15.8B) exist to fix it via grounding, and Quantstruct exists because retrieval alone still isn\'t enough. I built that grounding architecture end-to-end — router, retrieval, evals, tracing — and measured whether it actually works instead of assuming it.',
    metrics: [{ v: '95.6%', l: 'faithfulness, RAGAS on the golden set' }, { v: '100%', l: 'routing accuracy, incl. framework-ambiguous questions' }, { v: '905MB → 0MB', l: 'memory reclaimed fixing one import on deploy' }],
    stack: ['Python', 'LangGraph router', 'ChromaDB', 'sentence-transformers / ONNX', 'cross-encoder reranking', 'Claude Sonnet 5', 'Haiku 4.5 (judge)', 'RAGAS', 'Langfuse', 'Streamlit', 'FastAPI', 'Render'],
    chapters: [
      { head: 'the premise', body: 'Grounding a model in retrieved documents is supposed to solve hallucination on precise facts — companies raising billions are betting on it, and companies like Quantstruct exist because retrieval alone doesn\'t fully close the gap. Whether it works is an empirical question, so this project is built around measurement rather than around the chat interface — the assistant is the test rig, the evaluation is the result.' },
      { head: 'what the corpus was hiding', body: 'One changelog file was silently 45.7% of the entire vector store, crowding out the documentation it was meant to support. Nothing in the interface would ever have shown that — it only appears if you measure what retrieval is actually returning.' },
      { head: 'built to fail honestly', body: 'Cross-encoder reranking was a net positive but not a uniform win — faithfulness moved 0.963→0.932 while context precision moved 0.696→0.751 — and that\'s reported as-is rather than rounded up. Five real bugs in ragas, Langfuse and the Anthropic API only surfaced under live calls. On deployment, four genuine memory bugs got fixed on a free-tier host before I ran out of easy explanations, ruled out five more hypotheses one by one, and concluded a real capacity limit — a finding, not a failure to hide.' }
    ],
    stages: [
      { label: 'retrieval', slug: 'retrieval', role: 'local, no api cost', detail: 'ChromaDB as a local vector store with switchable sentence-transformer or ONNX embeddings, a markdown-aware chunker that respects document structure, and cross-encoder reranking on top of the initial results.', flow: ['chromadb', 'sentence-transformers / onnx', 'markdown-aware chunker', 'cross-encoder reranking'] },
      { label: 'routing', slug: 'routing', role: 'agent decides where to look', detail: 'A LangGraph router sends each question to FastAPI docs, Node.js docs, live web search, or a hard decline — reaching 100% routing accuracy, including deliberately ambiguous questions that name no framework at all.', flow: ['langgraph router', 'fastapi / node.js / web search', '100% accuracy incl. ambiguous qs'] },
      { label: 'interfaces', slug: 'interfaces', role: 'two front doors, one backend', detail: 'A Streamlit chat UI and a FastAPI JSON API share one backend, deployed on Render\'s free tier — which took four real memory fixes, including a lazy import that reclaimed 905MB and a corpus fetch trimmed from 3,137 files to 454, before hitting a genuine capacity limit.', flow: ['streamlit x2 + fastapi', 'render free tier', '905mb → 0mb import fix', '3,137 → 454 files'] },
      { label: 'evals', slug: 'evals', role: 'the actual product', detail: 'RAGAS faithfulness and context precision over the golden set, a custom retrieval hit-rate check, and a baseline-versus-RAG comparison script. Haiku 4.5 judges so the generator never grades its own work.', flow: ['ragas: faithfulness, precision', '85% retrieval hit-rate', 'baseline vs rag', 'haiku 4.5 as judge'] },
      { label: 'tracing', slug: 'tracing', role: 'why it answered that', detail: 'Langfuse traces every request with eval scores and real user feedback attached, plus custom dashboards tracking quality and cost over time — which is how the corpus, chunking and reranking findings surfaced at all.', flow: ['langfuse tracing + dashboards', 'user feedback → scores', '5+ library bugs fixed', 'read the source, not the guess'] }
    ]
  },
  {
    file: 'combat24', name: 'Combat24', year: '2026', domain: 'full-stack product',
    perm: '-rwxr-xr-x', dirmeta: '-a---  06/19/2026 11:02 AM',
    one: 'co-founded; built its site, member app and access systems',
    lede: 'I co-founded Combat24 and own everything digital and technical in it. The website was not generating leads and the third-party membership software did not fit operations — one problem in two places: losing members at the top of the funnel and time at the bottom.',
    metrics: [{ v: '1–2 → ~10', l: 'organic enquiries per week, 5x' }, { v: '200+', l: 'members on daily operations' }, { v: '3', l: 'surfaces: member app, admin, access' }],
    stack: ['React', 'JavaScript', 'Claude Code', 'SEO', 'QR access', 'Full-stack'],
    chapters: [
      { head: 'the problem', body: 'The brief could have been "redesign the website". The actual problem was lead generation, so I rebuilt it with an SEO-first approach — organic enquiries went from one or two a week to about ten.' },
      { head: 'the decision', body: 'Replace the third-party membership software rather than integrate with it. A member app, an admin portal and QR-based access, built to the way the gym actually runs its day, now support over two hundred members.' },
      { head: 'end to end', body: 'As co-founder I own the whole digital surface — marketing, the site, the member app, the admin systems — so the problem framing, the build and the outcome all sit with me. Success is measured in enquiries and daily operations, not launches.' }
    ],
    stages: [
      { label: 'diagnosis', slug: 'diagnosis', role: 'find the real problem', detail: 'I identified poor lead generation as the core business problem before touching the build.', flow: ['problem identified', 'lead generation'] },
      { label: 'site', slug: 'site', role: 'seo-first rebuild', detail: 'Rebuilt the website with an SEO-first approach using Claude Design and Claude Code. Organic enquiries went from one or two a week to about ten.', flow: ['seo-first', 'claude design + code', '1–2 → ~10 / week'] },
      { label: 'member app', slug: 'member', role: 'the member surface', detail: 'A member app as one of three surfaces in the membership management platform.', flow: ['member app', 'full-stack'] },
      { label: 'admin', slug: 'admin', role: 'the operator surface', detail: 'An admin portal supporting daily operations for more than two hundred members, replacing the third-party software it ran on before.', flow: ['admin portal', '200+ members', 'daily operations'] },
      { label: 'access', slug: 'access', role: 'qr entry', detail: 'A QR-based access system, built as part of the same platform rather than bolted on.', flow: ['qr access', 'part of platform'] }
    ]
  },
  {
    file: 'conduit', name: 'Conduit', year: '2025', domain: 'data platform',
    perm: '-rw-r--r--', dirmeta: '-a---  09/27/2025  8:31 AM',
    one: 'two million vendor records, four teams, one standard',
    lede: 'Vendor and event data lived in the wrong places for the people who needed it. Conduit is the pipeline work that moved it, standardised it, and made it fast enough to trust.',
    metrics: [{ v: '2M+', l: 'vendor records migrated' }, { v: '200K+', l: 'daily events into Snowflake' }, { v: '30% / 50%', l: 'runtime cut / faster anomaly detection' }],
    stack: ['Databricks', 'Denodo', 'Snowflake', 'Python', 'SQL', 'Delta Lake'],
    chapters: [
      { head: 'the problem', body: 'Four business teams needed the same vendor data, held in Databricks rather than anywhere they could consume it. Separately, a high-throughput event stream needed to land in Snowflake reliably enough to trust.' },
      { head: 'the decision', body: 'A multi-layer pipeline from Databricks into Denodo producing standardised datasets for all four teams, and automated distribution monitoring on the event path — which halved anomaly detection time and improved reliability.' },
      { head: 'making it fast', body: 'Runtime came down thirty percent through Delta optimisation and partition pruning. Cheaper and faster is not a bonus in pipeline work — it is what makes the data current enough to use.' }
    ],
    stages: [
      { label: 'sources', slug: 'sources', role: 'where it starts', detail: 'Two paths: vendor records held in Databricks, and a high-throughput event stream.', flow: ['vendor records', 'event stream'] },
      { label: 'layers', slug: 'layers', role: 'multi-layer pipeline', detail: 'A multi-layer pipeline producing standardised datasets for four business teams.', flow: ['multi-layer', 'standardised datasets', '4 teams'] },
      { label: 'denodo', slug: 'denodo', role: 'the serving layer', detail: 'More than two million vendor records moved from Databricks into Denodo.', flow: ['databricks → denodo', '2M+ records'] },
      { label: 'snowflake', slug: 'snowflake', role: 'high-throughput etl', detail: 'More than two hundred thousand events a day into Snowflake, with automated distribution monitoring that cut anomaly detection time by half and improved reliability.', flow: ['200k+ daily events', 'distribution monitoring', '−50% detection time'] },
      { label: 'tuning', slug: 'tuning', role: 'thirty percent faster', detail: 'Pipeline runtime reduced 30% through Delta optimisation and partition pruning.', flow: ['delta optimisation', 'partition pruning', '−30% runtime'] }
    ]
  }
];

const BELIEFS = [
  { head: 'The demo is not the system.', body: 'Anything can look intelligent for ninety seconds. What matters is the behaviour on the malformed receipt, the third retry, and the day a policy changes in one country and not the others. ARIA reaching over a thousand requests a month across four countries is a different artifact from ARIA working once.' },
  { head: 'Find the problem behind the request.', body: 'Combat24 asked for a website. The problem was lead generation, so that is what I built against — organic enquiries went up fivefold. The first job is almost always reframing the ask, not answering it.' },
  { head: 'Measure it, do not assume it.', body: 'Retrieval is supposed to stop a model inventing details. Measuring it turned up a changelog quietly occupying 45.7% of my vector store and a chunker slicing sentences in half — neither visible from the interface. The eval harness is not paperwork around the build; it is the part that tells you whether the build works.' }
];

const STACK = [
  { name: 'intelligence', items: ['agentic ai on c3.ai', 'langchain, langgraph', 'rag and retrieval', 'llm classification pipelines', 'copilot studio, mcp', 'policy-based reasoning', 'sentence-transformer embeddings', 'ocr and extraction'] },
  { name: 'evaluation', items: ['ragas: faithfulness, precision', 'langfuse tracing', 'golden-set evaluation', 'retrieval hit-rate', 'baseline vs rag comparison', 'llm-as-judge'] },
  { name: 'engineering', items: ['python, sql, javascript', 'c++, java', 'fastapi, streamlit', 'react', 'docker, ci/cd', 'git'] },
  { name: 'data', items: ['azure', 'databricks', 'snowflake', 'postgresql', 'denodo', 'chromadb', 'etl pipelines'] },
  { name: 'delivery', items: ['power bi, power automate', 'powerapps', 'aha! product management', 'problem framing', 'stakeholder translation', 'sole-engineer ownership'] }
];

const ROLES = [
  { hash: 'a71c4e9', title: 'AI Engineer', org: 'GSK', years: '2026 — now',
    brief: 'Building and running enterprise AI agents on GSK\'s internal platform, from architecture through production support. Scope covers the agent itself, the integrations it depends on, and the platform infrastructure underneath it.',
    shipped: ['ARIA reimbursement agent — 10 days to 1 day, 4 countries, 1,000+ requests a month, shipped as sole engineer', '15+ full-stack features across two production apps via Copilot Studio and C3 MCP — a 10-week roadmap in 3 weeks', '12 C3.ai platform upgrades across cluster, environment and application layers with zero unplanned downtime', 'Containerised the C3.ai development workflow with Docker and CI/CD — onboarding time down ~75% for 10+ engineers', 'Diagnosed and fixed a defect on a live demand forecasting app now used 300+ times a month by a 12-person planning team'] },
  { hash: '5f2b8d1', title: 'Data Engineer', org: 'GSK', years: '2023 — 2025',
    brief: 'Data engineering for R&D: classification pipelines over clinical data, migrations into the serving layer, high-throughput ETL, and the reporting automation that removed recurring manual work across the department.',
    shipped: ['LLM PII/PHI classification pipeline — 15 minutes to under 10 seconds per file, accuracy 65% to 98%', 'Moved 2M+ vendor records from Databricks to Denodo for 4 business teams; runtime down 30%', 'ETL pipeline processing 200K+ daily events into Snowflake, anomaly detection time halved', 'Portfolio health dashboard adopted by every product owner and director — 1 day to under 30 seconds', 'Automated R&D investment allocation to zero data quality issues; embedding similarity analysis drove 4 proposal restructures'] },
  { hash: 'c93a067', title: 'Co-founder', org: 'Combat24', years: '2024 — now',
    brief: 'Co-founder at combat24.in, responsible for everything digital and technical — marketing, website, the member app, the admin systems and the infrastructure under them. Diagnosed lead generation as the business problem, rebuilt the site around it, then replaced the third-party membership software with a platform built for how the business actually operates.',
    shipped: ['Organic enquiries from 1–2 to ~10 per week through an SEO-first rebuild', 'Membership platform with member app, admin portal and QR access for 200+ members', 'Retired third-party software and its recurring cost'] },
  { hash: '0d4e1f8', title: 'B.Tech, Computer Science and Engineering', org: 'Ramaiah University of Applied Sciences', years: '2019 — 2023',
    brief: 'Computer science and engineering at Ramaiah University of Applied Sciences, Bengaluru. Graduated with a CGPA of 8.7.',
    shipped: ['CGPA 8.7', 'Bengaluru, India'] }
];

const NAVITEMS = [
  ['whoami', 'whoami', 'who I am and what I build'],
  ['projects', 'projects', 'five projects, with case files'],
  ['stack', 'stack', 'tools and capabilities'],
  ['experience', 'log', 'roles, as commits'],
  ['philosophy', 'philosophy', 'how I work'],
  ['contact', 'mail', 'get in touch']
];

export { THEMES, SHELL, PROJECTS, BELIEFS, STACK, ROLES, NAVITEMS };
