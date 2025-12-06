// src/Portfolio/Portfolio.jsx
import React, { useEffect, useState } from "react";
import data from "../data";
import "./Portfolio.css";

/* --- small inline icons so no dependency is required --- */
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6C1.1 6 0 4.88 0 3.5C0 2.12 1.1 1 2.48 1C3.86 1 4.98 2.12 4.98 3.5Z" fill="currentColor"/>
    <path d="M.5 8.5H4.5V23.5H.5V8.5Z" fill="currentColor"/>
    <path d="M7.5 8.5H11.2V10.5H11.3C11.9 9.2 13.8 7.8 16.5 7.8C21.4 7.8 22 10.8 22 15.1V23.5H18V15.9C18 14 17.9 11.6 15 11.6C12 11.6 11.6 13.6 11.6 15.7V23.5H7.5V8.5Z" fill="currentColor"/>
  </svg>
);
const IconGithub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.4-1.2-1.8-1.2-1.8-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6.8 2 1.1.1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.4.1-2.9 0 0 1-.3 3.3 1.2.9-.2 1.8-.3 2.8-.3s1.9.1 2.8.3c2.3-1.6 3.3-1.2 3.3-1.2.6 1.5.2 2.6.1 2.9.8.8 1.2 1.8 1.2 3.1 0 4.6-2.7 5.6-5.3 5.9.4.3.7.9.7 1.9v2.8c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.6 18.4.5 12 .5z" fill="currentColor"/></svg>
);
const IconInsta = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm7 4.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="currentColor"/></svg>
);
const IconTwitter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M22 5.9c-.6.3-1.2.6-2 .7.7-.4 1.2-1 1.5-1.8-.6.4-1.3.7-2.1.9A3.6 3.6 0 0 0 12.3 9c0 .3 0 .6.1.9-3-.2-5.7-1.6-7.5-3.8-.3.5-.4 1-.4 1.6 0 1.2.6 2.2 1.6 2.8-.6 0-1.2-.2-1.7-.5v.1c0 1.8 1.3 3.4 3 3.8-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.2 1.5 2 2.8 2a7.3 7.3 0 0 1-4.6 1.6c-.3 0-.6 0-.9-.1a10.3 10.3 0 0 0 5.6 1.6c6.7 0 10.4-5.6 10.4-10.4v-.5c.7-.5 1.2-1.1 1.6-1.8-.6.3-1.3.6-2 .6z" fill="currentColor"/></svg>
);

/* small helper to prefix public path */
const src = (p) => (p ? (p.startsWith("/") ? p : `/${p}`) : "/project-placeholder.jpg");

export default function Portfolio() {
  const [theme, setTheme] = useState("light");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [visibleProjects, setVisibleProjects] = useState(data.projects || []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  }, [theme]);

  useEffect(() => {
    // intersection observer to add .inview for sections/cards (stagger from CSS)
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("inview");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".section, .exp-card, .project, .skill-card").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // build tag list from projects
  const allTags = Array.from(new Set((data.projects || []).flatMap((p) => p.tech || []))).slice(0, 40);
  const tags = ["All", ...allTags];

  useEffect(() => {
    // filter projects by search and activeTag
    let ps = data.projects || [];
    if (activeTag !== "All") ps = ps.filter((p) => (p.tech || []).includes(activeTag));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      ps = ps.filter((p) => (p.title + " " + (p.description || "") + " " + (p.tech || []).join(" ")).toLowerCase().includes(q));
    }
    setVisibleProjects(ps);
  }, [search, activeTag]);

  // skill proficiency map (simple)
  const proficiency = { HTML5: 88, CSS3: 82, JavaScript: 76, TypeScript: 68, React: 72, Tailwind: 60 };

  return (
    <div className="apple-portfolio">
      {/* NAV */}
      <div className="container top-nav">
        <div style={{ fontWeight: 700 }}>Taoseef</div>
        <div className="links" aria-hidden>
          <div>About</div>
          <div>Skills</div>
          <div>Experience</div>
          <div>Projects</div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <label style={{ color: "var(--muted)", display: "flex", gap: 8, alignItems: "center" }}>
            Light
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle dark"
            />
          </label>

          <a href="/resume.pdf" className="cta" style={{ textDecoration: "none" }} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </div>

      {/* HERO */}
      <div className="container hero" role="banner">
        <div className="hero-text-block">
          <div className="title-eyebrow">Full-Stack Developer &amp; UI/UX Enthusiast</div>
          <h1>{data.hero?.name || "Your Name"}</h1>
          <p className="lead">{data.hero?.description}</p>
          <div className="hero-location-small">{data.hero?.location}</div>

          {/* social icons (placed under hero text as requested) */}
          <div style={{ marginTop: 12 }}>
            <div className="hero-social-row">
              <a href={data.socialLinks?.[0]?.href || "#"} className="hero-social-link" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <IconLinkedIn />
              </a>
              <a href={data.socialLinks?.[1]?.href || "#"} className="hero-social-link" target="_blank" rel="noreferrer" aria-label="GitHub">
                <IconGithub />
              </a>
              <a href={data.socialLinks?.[2]?.href || "#"} className="hero-social-link" target="_blank" rel="noreferrer" aria-label="Instagram">
                <IconInsta />
              </a>
              <a href={data.socialLinks?.[3]?.href || "#"} className="hero-social-link" target="_blank" rel="noreferrer" aria-label="Twitter">
                <IconTwitter />
              </a>
            </div>
          </div>

          <div className="hero-cta-row" style={{ marginTop: 14 }}>
            <button className="cta" onClick={() => { document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}>
              View Projects
            </button>
            <button className="cta secondary" onClick={() => { document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }); }}>
              View Experience
            </button>
          </div>
        </div>

        <div className="hero-photo-wrap" aria-hidden>
          <img
            className="hero-photo"
            src={src(data.profileImage || data.profileImage)}
            alt="profile"
            onError={(e) => { e.target.onerror = null; e.target.src = "/profile-placeholder.png"; }}
          />
          <div className="hero-orb a" />
          <div className="hero-orb b" />
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="section about">
        <div className="container section-inner">
          <h2>About</h2>
          {data.about?.paragraphs?.map((p, i) => (
            <p key={i} style={{ color: "var(--muted)", lineHeight: 1.8 }}>{p}</p>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section">
        <div className="container section-inner">
          <h2>Skills &amp; Technologies</h2>
          <div className="skills-row" style={{ marginTop: 12 }}>
            {data.languages?.map((lang, idx) => {
              const img = lang.img ? (lang.img.startsWith("/") ? lang.img : `/${lang.img}`) : "/icon-placeholder.png";
              const pct = proficiency[lang.name] || 60;
              return (
                <article key={idx} className="skill-card skill-card--icon">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                    <div className="skill-icon-wrap">
                      <img
                        src={img}
                        alt={lang.name}
                        className="skill-icon"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/icon-placeholder.png"; }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{lang.name}</div>
                      <div className="skill-meter" aria-hidden>
                        <div className="skill-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section">
        <div className="container section-inner">
          <h2>Experience</h2>
          <p style={{ color: "var(--muted)", marginTop: 6 }}>A timeline of work and learning, shown as personalised cards.</p>

          <div className="experience-grid" style={{ marginTop: 16 }}>
            {data.experience?.map((exp, i) => (
              <article key={i} className="exp-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="exp-avatar" aria-hidden>
                      {(exp.company || "").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ margin: 0 }}>{exp.role}</h3>
                      <div className="exp-company" style={{ marginTop: 4 }}>{exp.company}</div>
                    </div>
                  </div>
                  <div className="exp-period" style={{ color: "var(--muted)", fontSize: 13 }}>{exp.period}</div>
                </div>

                <p className="exp-description" style={{ marginTop: 10, color: "var(--muted)" }}>{exp.description}</p>

                <div className="chips" style={{ marginTop: 12 }}>
                  {(exp.skills || []).map((s, j) => <div className="tag" key={j}>{s}</div>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <div className="container section-inner">
          <h2>Projects ({data.projects?.length || 0})</h2>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginTop: 12 }}>
            <input className="search" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div style={{ display: "flex", gap: 8, alignItems: "center", overflowX: "auto" }}>
              {tags.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTag(t)}
                  className="tag"
                  style={{
                    background: activeTag === t ? "var(--accent)" : "rgba(0,0,0,0.04)",
                    color: activeTag === t ? "#fff" : "var(--muted)",
                    cursor: "pointer",
                    border: "none",
                    padding: "8px 10px",
                    borderRadius: 999
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="projects-grid" style={{ marginTop: 16 }}>
            {visibleProjects.map((p, i) => (
              <article key={i} className="project">
                <div className="imgwrap">
                  <img src={src(p.image)} alt={p.title} onError={(e) => { e.target.onerror = null; e.target.src = "/project-placeholder.jpg"; }} />
                </div>
                <div className="content">
                  <h3 style={{ margin: 0 }}>{p.title}</h3>
                  <p style={{ marginTop: 8, color: "var(--muted)" }}>{p.description}</p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {(p.tech || []).slice(0, 6).map((t, idx) => <div className="tag" key={idx}>{t}</div>)}
                    </div>

                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>LIVE DEMO</div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>Made with ❤️ — Portfolio by Taoseef Raza</div>
          <div style={{ color: "var(--muted)" }}>Preview route: /preview</div>
        </div>
      </footer>
    </div>
  );
}






