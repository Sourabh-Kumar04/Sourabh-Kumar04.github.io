import {
  ArrowDown,
  ArrowUpRight,
  Atom,
  BrainCircuit,
  Github,
  Linkedin,
  Mail,
  Network,
  Sparkles,
  Workflow,
} from "lucide-react";

const projects = [
  {
    number: "01",
    name: "RasoSynthTune",
    type: "LLM DATA & FINE-TUNING",
    description:
      "An experimental workflow for preparing domain datasets, adding quality checks, and exploring parameter-efficient model adaptation.",
    stack: ["Python", "LangGraph", "PEFT / LoRA"],
    href: "https://github.com/Sourabh-Kumar04/RasoSynth_CUTC",
    accent: "violet",
  },
  {
    number: "02",
    name: "LangGraph Lab",
    type: "AGENT WORKFLOWS",
    description:
      "A hands-on collection exploring stateful LLM workflows, tool use, persistence, and human-in-the-loop patterns.",
    stack: ["Python", "LangGraph", "LLMs"],
    href: "https://github.com/Sourabh-Kumar04/LangGraph",
    accent: "blue",
  },
  {
    number: "03",
    name: "Raso Medical Chatbot",
    type: "RETRIEVAL-AUGMENTED AI",
    description:
      "A learning project exploring retrieval-grounded answers over a medical knowledge base. Not a substitute for professional medical advice.",
    stack: ["Python", "RAG", "Llama 2"],
    href: "https://github.com/Sourabh-Kumar04/Raso-Medical-Chatbot",
    accent: "mint",
  },
  {
    number: "04",
    name: "Movie Recommender",
    type: "APPLIED MACHINE LEARNING",
    description:
      "A content-based recommendation project that uses movie metadata and similarity to surface relevant films.",
    stack: ["Python", "pandas", "scikit-learn"],
    href: "https://github.com/Sourabh-Kumar04/Raso-movie-recommendation",
    accent: "pink",
  },
];

const capabilities = [
  {
    icon: BrainCircuit,
    label: "MODEL SYSTEMS",
    title: "Applied ML & LLMs",
    detail: "Deep learning, model experiments, and LLM application patterns.",
  },
  {
    icon: Network,
    label: "RETRIEVAL",
    title: "Grounded AI",
    detail: "RAG concepts and knowledge-connected conversational systems.",
  },
  {
    icon: Workflow,
    label: "ORCHESTRATION",
    title: "Agent workflows",
    detail: "Stateful flows, tools, routing, and human review checkpoints.",
  },
];

const labStyles = `
  .lab-page { --lab-bg:#090811; --lab-panel:rgba(20,18,34,.68); --lab-line:rgba(199,180,255,.15); --lab-muted:#aaa5bd; --lab-text:#f5f2ff; --lab-violet:#c4a8ff; --lab-blue:#95b9ff; --lab-mint:#8be3d3; --lab-pink:#f2a6d8; color:var(--lab-text); background:var(--lab-bg); min-height:100vh; overflow:hidden; font-family:Inter,ui-sans-serif,system-ui,sans-serif; }
  .lab-page *, .lab-page *::before, .lab-page *::after { box-sizing:border-box; }
  .lab-page a { color:inherit; text-decoration:none; }
  .lab-wrap { width:min(1120px,calc(100% - 44px)); margin-inline:auto; }
  .lab-noise { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.14; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E"); }
  .lab-glow { position:absolute; width:440px; height:440px; border-radius:50%; filter:blur(100px); opacity:.19; pointer-events:none; }
  .lab-glow-one { top:40px; right:-130px; background:#7952d4; animation:lab-drift 14s ease-in-out infinite alternate; }
  .lab-glow-two { top:520px; left:-240px; width:400px; height:400px; background:#2b66a8; animation:lab-drift 18s ease-in-out infinite alternate-reverse; }
  .lab-nav { position:relative; z-index:2; height:76px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(199,180,255,.1); }
  .lab-brand { display:flex; align-items:center; gap:11px; font-size:14px; letter-spacing:.02em; font-weight:650; }
  .lab-brand-mark { display:grid; place-items:center; width:34px; height:34px; border:1px solid rgba(196,168,255,.33); border-radius:11px; color:var(--lab-violet); background:linear-gradient(145deg,rgba(168,133,255,.16),rgba(83,68,132,.08)); box-shadow:inset 0 1px rgba(255,255,255,.08),0 0 24px rgba(155,113,255,.1); }
  .lab-nav-links { display:flex; align-items:center; gap:26px; color:#bdb8cb; font-size:12px; }
  .lab-nav-links a { transition:color .2s ease; }
  .lab-nav-links a:hover { color:white; }
  .lab-contact { display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border:1px solid rgba(196,168,255,.28); border-radius:999px; background:rgba(165,132,255,.09); color:#e7dcff !important; font-size:12px; transition:transform .2s,background .2s,border-color .2s; }
  .lab-contact:hover { transform:translateY(-2px); background:rgba(165,132,255,.17); border-color:rgba(196,168,255,.5); }
  .lab-hero { position:relative; z-index:1; min-height:660px; display:grid; grid-template-columns:1.04fr .96fr; align-items:center; gap:32px; padding-block:70px 96px; }
  .lab-kicker { display:inline-flex; align-items:center; gap:9px; color:#c6bbdc; font:600 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.16em; text-transform:uppercase; }
  .lab-kicker::before { content:""; width:7px; height:7px; border-radius:50%; background:#8be3d3; box-shadow:0 0 14px #8be3d3; }
  .lab-hero h1 { max-width:650px; margin:23px 0 18px; font-size:clamp(54px,7vw,88px); line-height:.99; letter-spacing:-.075em; font-weight:650; }
  .lab-gradient-text { color:transparent; background:linear-gradient(105deg,#f8f5ff 6%,#d1baff 53%,#92b9ff 94%); background-clip:text; -webkit-background-clip:text; }
  .lab-hero-copy { max-width:550px; margin:0; color:#b4afc2; font-size:16px; line-height:1.8; }
  .lab-hero-copy strong { color:#eee9fb; font-weight:550; }
  .lab-hero-actions { display:flex; flex-wrap:wrap; gap:12px; margin-top:30px; }
  .lab-button { display:inline-flex; align-items:center; justify-content:center; gap:9px; min-height:46px; padding:0 17px; border:1px solid rgba(199,180,255,.2); border-radius:12px; background:rgba(255,255,255,.035); color:#eee9fb; font-size:12px; font-weight:600; transition:transform .2s,border-color .2s,background .2s,box-shadow .2s; }
  .lab-button:hover { transform:translateY(-3px); border-color:rgba(196,168,255,.55); background:rgba(196,168,255,.09); box-shadow:0 12px 30px rgba(0,0,0,.2); }
  .lab-button-primary { border-color:transparent; color:#151120; background:linear-gradient(110deg,#d0b8ff,#a7c3ff); box-shadow:0 8px 26px rgba(156,126,235,.2); }
  .lab-button-primary:hover { background:linear-gradient(110deg,#e1d2ff,#bed2ff); }
  .lab-socials { display:flex; gap:16px; margin-top:28px; color:#9d97ad; }
  .lab-socials a { display:inline-flex; align-items:center; gap:7px; font-size:11px; transition:color .2s; }
  .lab-socials a:hover { color:#e7dcff; }
  .lab-visual { position:relative; display:grid; min-height:420px; place-items:center; perspective:1000px; }
  .lab-orbit { position:absolute; width:min(390px,85vw); aspect-ratio:1; border:1px solid rgba(199,180,255,.14); border-radius:50%; transform:rotateX(67deg) rotateZ(-20deg); animation:lab-orbit 26s linear infinite; }
  .lab-orbit::before,.lab-orbit::after { content:""; position:absolute; width:8px; height:8px; border-radius:50%; background:#c5a5ff; box-shadow:0 0 18px 4px rgba(192,157,255,.8); }
  .lab-orbit::before { top:16%; left:18%; }.lab-orbit::after { bottom:16%; right:16%; width:5px; height:5px; background:#91baff; box-shadow:0 0 16px 3px rgba(145,186,255,.75); }
  .lab-orbit-two { width:min(310px,72vw); border-color:rgba(145,186,255,.12); transform:rotateX(67deg) rotateZ(42deg); animation-direction:reverse; animation-duration:34s; }
  .lab-core { position:relative; z-index:1; display:grid; place-items:center; width:174px; height:174px; border-radius:50%; color:#e8dcff; background:radial-gradient(circle at 35% 25%,rgba(211,190,255,.27),rgba(83,62,137,.12) 48%,rgba(13,13,24,.92) 73%); border:1px solid rgba(205,183,255,.34); box-shadow:0 0 55px rgba(142,104,230,.2),inset 0 0 38px rgba(176,143,255,.13),0 25px 85px rgba(0,0,0,.42); transform:rotateY(-12deg) rotateX(7deg); animation:lab-float 5s ease-in-out infinite; }
  .lab-core::before { content:""; position:absolute; inset:-13px; border:1px solid rgba(179,156,255,.1); border-radius:50%; }
  .lab-core svg { filter:drop-shadow(0 0 15px rgba(198,171,255,.75)); }
  .lab-core-label { position:absolute; bottom:-48px; color:#aaa2bd; font:10px ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.18em; white-space:nowrap; }
  .lab-float-card { position:absolute; z-index:2; padding:13px 15px; border:1px solid rgba(199,180,255,.19); border-radius:14px; background:rgba(19,18,31,.74); backdrop-filter:blur(16px); box-shadow:0 18px 50px rgba(0,0,0,.28),inset 0 1px rgba(255,255,255,.05); animation:lab-float 6s ease-in-out infinite; }
  .lab-float-card small { display:block; margin-bottom:5px; color:#8f899f; font:9px ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.12em; }
  .lab-float-card span { display:flex; align-items:center; gap:8px; color:#e7e2f1; font-size:11px; font-weight:550; }
  .lab-float-card-one { top:60px; right:0; }.lab-float-card-two { bottom:68px; left:0; animation-delay:-2.3s; }
  .lab-mini-dot { width:7px; height:7px; border-radius:50%; background:#8be3d3; box-shadow:0 0 12px rgba(139,227,211,.7); }
  .lab-mini-dot-violet { background:#c4a8ff; box-shadow:0 0 12px rgba(196,168,255,.8); }
  .lab-scroll-cue { position:absolute; bottom:34px; left:0; display:flex; align-items:center; gap:10px; color:#817b90; font:9px ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.14em; }
  .lab-scroll-cue svg { color:#c4a8ff; animation:lab-bob 1.8s ease-in-out infinite; }
  .lab-section { position:relative; z-index:1; padding-block:72px; border-top:1px solid rgba(199,180,255,.09); }
  .lab-section-head { display:flex; justify-content:space-between; align-items:end; gap:22px; margin-bottom:28px; }
  .lab-eyebrow { color:#a99ac9; font:600 10px ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.17em; text-transform:uppercase; }
  .lab-section h2 { margin:10px 0 0; color:#f4f1fb; font-size:clamp(28px,4vw,42px); letter-spacing:-.055em; font-weight:600; }
  .lab-section-intro { max-width:410px; margin:0; color:#a6a0b5; font-size:13px; line-height:1.7; }
  .lab-capabilities { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; }
  .lab-glass { border:1px solid rgba(199,180,255,.13); border-radius:18px; background:linear-gradient(145deg,rgba(25,23,40,.72),rgba(14,14,24,.76)); box-shadow:inset 0 1px rgba(255,255,255,.035),0 16px 42px rgba(0,0,0,.18); backdrop-filter:blur(16px); }
  .lab-capability { padding:22px; transition:transform .3s,border-color .3s,box-shadow .3s; }
  .lab-capability:hover { transform:translateY(-5px); border-color:rgba(196,168,255,.33); box-shadow:0 22px 50px rgba(0,0,0,.28); }
  .lab-icon { display:grid; place-items:center; width:42px; height:42px; margin-bottom:24px; border:1px solid rgba(196,168,255,.19); border-radius:13px; color:#cbb6ff; background:rgba(164,132,255,.09); }
  .lab-capability:nth-child(2) .lab-icon { color:#a8c6ff; background:rgba(128,168,255,.09); border-color:rgba(145,186,255,.2); }
  .lab-capability:nth-child(3) .lab-icon { color:#9be6d6; background:rgba(117,220,198,.08); border-color:rgba(139,227,211,.2); }
  .lab-capability small { color:#8e879e; font:9px ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.13em; }
  .lab-capability h3 { margin:10px 0 8px; font-size:17px; font-weight:550; letter-spacing:-.03em; }
  .lab-capability p { margin:0; color:#a7a1b5; font-size:12px; line-height:1.7; }
  .lab-project-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
  .lab-project { position:relative; min-height:260px; padding:23px; overflow:hidden; transform-style:preserve-3d; transition:transform .35s cubic-bezier(.2,.8,.2,1),border-color .3s,box-shadow .3s; }
  .lab-project:hover { transform:translateY(-6px) rotateX(1deg) rotateY(-1deg); border-color:rgba(196,168,255,.34); box-shadow:0 30px 60px rgba(0,0,0,.3),0 0 32px rgba(157,126,226,.06); }
  .lab-project::after { position:absolute; top:-80px; right:-70px; width:210px; height:210px; border-radius:50%; content:""; background:var(--project-accent); opacity:.095; filter:blur(50px); transition:opacity .3s; }
  .lab-project:hover::after { opacity:.2; }
  .lab-project.violet { --project-accent:#a77aff; }.lab-project.blue { --project-accent:#74a5ff; }.lab-project.mint { --project-accent:#75d9c7; }.lab-project.pink { --project-accent:#e995d2; }
  .lab-project-top { position:relative; z-index:1; display:flex; justify-content:space-between; align-items:center; color:#8e879e; font:9px ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.12em; }
  .lab-project-top span:first-child { color:var(--project-accent); }
  .lab-project h3 { position:relative; z-index:1; margin:27px 0 9px; font-size:24px; font-weight:580; letter-spacing:-.045em; }
  .lab-project p { position:relative; z-index:1; max-width:470px; margin:0; color:#aaa5b8; font-size:12px; line-height:1.75; }
  .lab-tags { position:relative; z-index:1; display:flex; flex-wrap:wrap; gap:7px; margin-top:18px; }
  .lab-tags span { padding:6px 9px; border:1px solid rgba(199,180,255,.12); border-radius:999px; color:#bbb5c9; background:rgba(255,255,255,.025); font:9px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .lab-project-link { position:absolute; right:20px; bottom:20px; z-index:2; display:grid; place-items:center; width:34px; height:34px; border:1px solid rgba(199,180,255,.17); border-radius:50%; color:#d5c9ee; background:rgba(255,255,255,.035); transition:transform .2s,background .2s; }
  .lab-project-link:hover { transform:translate(2px,-2px); background:rgba(196,168,255,.12); }
  .lab-about-grid { display:grid; grid-template-columns:1.1fr .9fr; gap:18px; }
  .lab-about-card { padding:25px; }
  .lab-about-card p { margin:0 0 13px; color:#b2adbf; font-size:13px; line-height:1.85; }
  .lab-about-card p:last-child { margin-bottom:0; }
  .lab-facts { display:grid; gap:0; }
  .lab-fact { display:flex; justify-content:space-between; gap:12px; padding:15px 0; border-bottom:1px solid rgba(199,180,255,.1); font-size:11px; }
  .lab-fact:first-child { padding-top:2px; }.lab-fact:last-child { padding-bottom:2px; border:0; }
  .lab-fact span:first-child { color:#827c91; font:9px ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.08em; }
  .lab-fact span:last-child { color:#e1dceb; text-align:right; }
  .lab-cta { position:relative; display:flex; align-items:center; justify-content:space-between; gap:24px; padding:32px; overflow:hidden; }
  .lab-cta::before { position:absolute; inset:-100px auto auto 40%; width:340px; height:240px; content:""; border-radius:50%; background:#835de0; opacity:.18; filter:blur(85px); pointer-events:none; }
  .lab-cta h2 { position:relative; margin:9px 0; font-size:clamp(26px,4vw,38px); letter-spacing:-.05em; }
  .lab-cta p { position:relative; max-width:530px; margin:0; color:#aaa5b8; font-size:12px; line-height:1.7; }
  .lab-footer { position:relative; z-index:1; display:flex; align-items:center; justify-content:space-between; gap:16px; padding-block:25px 36px; border-top:1px solid rgba(199,180,255,.09); color:#827c91; font:9px ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.06em; }
  .lab-footer-links { display:flex; gap:16px; }.lab-footer a:hover { color:#d5c9ee; }
  @keyframes lab-orbit { to { transform:rotateX(67deg) rotateZ(340deg); } }
  @keyframes lab-float { 0%,100% { transform:translateY(0) rotateY(-12deg) rotateX(7deg); } 50% { transform:translateY(-11px) rotateY(-8deg) rotateX(4deg); } }
  @keyframes lab-drift { to { transform:translate3d(-35px,24px,0) scale(1.08); } }
  @keyframes lab-bob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(4px); } }
  @media (max-width:760px) {
    .lab-wrap { width:min(100% - 32px,560px); }.lab-nav { height:66px; }.lab-nav-links { gap:14px; }.lab-nav-links > a:not(.lab-contact) { display:none; }
    .lab-hero { grid-template-columns:1fr; min-height:auto; padding-block:78px 70px; gap:20px; }.lab-hero h1 { font-size:clamp(52px,13vw,78px); }.lab-hero-copy { font-size:14px; }
    .lab-visual { min-height:330px; }.lab-orbit { width:min(310px,78vw); }.lab-orbit-two { width:min(245px,65vw); }.lab-core { width:142px; height:142px; }.lab-float-card-one { top:36px; right:2%; }.lab-float-card-two { bottom:42px; left:2%; }
    .lab-section { padding-block:54px; }.lab-section-head { display:block; }.lab-section-intro { margin-top:14px; }.lab-capabilities { grid-template-columns:1fr; }.lab-capability { padding:19px; }.lab-icon { margin-bottom:17px; }.lab-project-grid,.lab-about-grid { grid-template-columns:1fr; }.lab-project { min-height:250px; }.lab-cta { align-items:flex-start; flex-direction:column; padding:24px; }.lab-footer { align-items:flex-start; flex-direction:column; }
  }
  @media (prefers-reduced-motion:reduce) { .lab-page *, .lab-page *::before, .lab-page *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; transition-duration:.01ms !important; } }
`;

export function AILabPortfolio() {
  return (
    <div className="lab-page">
      <style>{labStyles}</style>
      <div className="lab-noise" aria-hidden="true" />
      <div className="lab-glow lab-glow-one" aria-hidden="true" />
      <div className="lab-glow lab-glow-two" aria-hidden="true" />

      <nav className="lab-nav lab-wrap" aria-label="Main navigation">
        <a className="lab-brand" href="#home" aria-label="Sourabh Kumar home">
          <span className="lab-brand-mark"><Atom size={17} /></span>
          <span>SOURABH KUMAR</span>
        </a>
        <div className="lab-nav-links">
          <a href="#focus">Focus</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a className="lab-contact" href="#contact">Let’s talk <ArrowUpRight size={14} /></a>
        </div>
      </nav>

      <main id="home" className="lab-wrap">
        <section className="lab-hero" aria-labelledby="hero-title">
          <div>
            <div className="lab-kicker">AI / ML · LLM systems · New Delhi, India</div>
            <h1 id="hero-title">Building at the <span className="lab-gradient-text">frontier of AI.</span></h1>
            <p className="lab-hero-copy">
              I’m <strong>Sourabh Kumar</strong> — a Computer Science student at the University of Delhi, exploring how machine learning ideas become thoughtful, useful software. I work across LLM applications, retrieval, and agent workflows.
            </p>
            <div className="lab-hero-actions">
              <a className="lab-button lab-button-primary" href="#projects">Explore selected work <ArrowUpRight size={15} /></a>
              <a className="lab-button" href="mailto:sourabhkumar01010101@gmail.com"><Mail size={14} /> Get in touch</a>
            </div>
            <div className="lab-socials">
              <a href="https://github.com/Sourabh-Kumar04" target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a>
              <a href="https://www.linkedin.com/in/sourabh-kumar04/" target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a>
            </div>
          </div>
          <div className="lab-visual" aria-label="Abstract animated AI core illustration">
            <div className="lab-orbit" aria-hidden="true" />
            <div className="lab-orbit lab-orbit-two" aria-hidden="true" />
            <div className="lab-core"><Sparkles size={42} strokeWidth={1.2} /><span className="lab-core-label">INTELLIGENCE IN MOTION</span></div>
            <div className="lab-float-card lab-float-card-one"><small>EXPLORING</small><span><i className="lab-mini-dot" /> LLM systems</span></div>
            <div className="lab-float-card lab-float-card-two"><small>BUILDING WITH</small><span><i className="lab-mini-dot lab-mini-dot-violet" /> Python · PyTorch</span></div>
          </div>
          <a className="lab-scroll-cue" href="#focus"><ArrowDown size={14} /> SCROLL TO EXPLORE</a>
        </section>

        <section className="lab-section" id="focus">
          <div className="lab-section-head">
            <div><div className="lab-eyebrow">01 / Research directions</div><h2>Curiosity, made tangible.</h2></div>
            <p className="lab-section-intro">A growing practice at the intersection of machine learning, system design, and human-centered applications.</p>
          </div>
          <div className="lab-capabilities">
            {capabilities.map(({ icon: Icon, label, title, detail }) => (
              <article className="lab-glass lab-capability" key={title}>
                <div className="lab-icon"><Icon size={20} strokeWidth={1.6} /></div>
                <small>{label}</small><h3>{title}</h3><p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lab-section" id="projects">
          <div className="lab-section-head">
            <div><div className="lab-eyebrow">02 / Selected experiments</div><h2>Work from the lab.</h2></div>
            <p className="lab-section-intro">A selection of projects and learning work. Each repository includes its own scope and implementation details.</p>
          </div>
          <div className="lab-project-grid">
            {projects.map((project) => (
              <article className={`lab-glass lab-project ${project.accent}`} key={project.number}>
                <div className="lab-project-top"><span>{project.number} / {project.type}</span><span>OPEN PROJECT</span></div>
                <h3>{project.name}</h3><p>{project.description}</p>
                <div className="lab-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                <a className="lab-project-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} repository`}><ArrowUpRight size={16} /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="lab-section" id="about">
          <div className="lab-section-head">
            <div><div className="lab-eyebrow">03 / The person behind the projects</div><h2>Engineering with curiosity.</h2></div>
          </div>
          <div className="lab-about-grid">
            <article className="lab-glass lab-about-card">
              <p>I’m pursuing a B.Sc. (Hons) in Computer Science at the University of Delhi. I like understanding how systems work under the hood, then applying that understanding through experiments and software.</p>
              <p>My current learning spans generative AI, retrieval-augmented generation, agent workflows, deep learning, and backend development. I value clear documentation, honest project scope, and building a strong foundation alongside trying new ideas.</p>
            </article>
            <article className="lab-glass lab-about-card lab-facts">
              <div className="lab-fact"><span>EDUCATION</span><span>University of Delhi · CS</span></div>
              <div className="lab-fact"><span>RECOGNITION</span><span>AWS AI/ML Scholar ’24</span></div>
              <div className="lab-fact"><span>FOCUS</span><span>ML · LLMs · RAG</span></div>
              <div className="lab-fact"><span>BASED IN</span><span>New Delhi, India</span></div>
            </article>
          </div>
        </section>

        <section className="lab-section" id="contact">
          <div className="lab-glass lab-cta">
            <div><div className="lab-eyebrow">04 / Open channel</div><h2>Have an interesting problem?</h2><p>I’m open to AI/ML internships, research conversations, and thoughtful collaborations. Let’s connect.</p></div>
            <a className="lab-button lab-button-primary" href="mailto:sourabhkumar01010101@gmail.com">Start a conversation <ArrowUpRight size={15} /></a>
          </div>
        </section>
      </main>

      <footer className="lab-footer lab-wrap">
        <span>© {new Date().getFullYear()} SOURABH KUMAR · BUILT WITH CURIOSITY</span>
        <div className="lab-footer-links"><a href="https://github.com/Sourabh-Kumar04" target="_blank" rel="noreferrer">GITHUB</a><a href="https://www.linkedin.com/in/sourabh-kumar04/" target="_blank" rel="noreferrer">LINKEDIN</a><a href="mailto:sourabhkumar01010101@gmail.com">EMAIL</a></div>
      </footer>
    </div>
  );
}

export default AILabPortfolio;
