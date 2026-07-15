"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { FormEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { fujairahImages, projectLocations, stages, team, type Lang } from "./data";

const ProjectMap = dynamic(() => import("./ProjectMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading project map…</div>,
});

const ui = {
  ru: {
    nav: [
      ["Объекты", "#projects"],
      ["Карта", "#map"],
      ["Этапы", "#process"],
      ["Команда", "#team"],
      ["Контакты", "#contact"],
    ],
    heroKicker: "Ремонт · Fit-out · Мебель",
    heroTitle: "Строим интерьер как точную систему",
    heroText: "Одна команда отвечает за дизайн, согласования, ремонт и мебель на заказ в Дубае и по ОАЭ.",
    heroPrimary: "Посмотреть объекты",
    heroSecondary: "Обсудить проект",
    scroll: "Прокрутите — помещение будет построено",
    stats: [
      ["10+", "лет опыта команды"],
      ["330 м²", "площадь featured-проекта"],
      ["01", "ответственная команда"],
      ["UAE", "география объектов"],
    ],
    libraryKicker: "Библиотека объектов",
    libraryTitle: "Проекты с фактами, файлами и географией",
    libraryText: "Не просто красивые кадры: площадь, сроки, объём работ, команда, фотографии и публичные документы собраны в карточке каждого объекта.",
    filters: { all: "Все", fitout: "Fit-out", furniture: "Мебель", commercial: "Коммерческие" },
    featured: "Опубликованный case study",
    scope: "Инженерия · Отделка · Мебель",
    galleryHint: "Нажмите на фотографию, чтобы открыть крупнее",
    filesTitle: "Файлы объекта",
    filePublic: "Публичный PDF-паспорт",
    fileGallery: "Оптимизированная галерея",
    filePrivate: "Рабочие чертежи и сметы",
    download: "Скачать",
    ready: "4 WebP · 230 KB",
    locked: "Только сотрудникам",
    mapKicker: "География проектов",
    mapTitle: "Объекты на карте ОАЭ",
    mapText: "Выберите точку, чтобы увидеть тип проекта, статус и краткое описание. Точный номер квартиры или виллы публично не показывается.",
    completed: "Завершён",
    progress: "В работе",
    caseReady: "Case study опубликован",
    caseSoon: "Материалы готовятся",
    processKicker: "Этапы работы",
    processTitle: "Каждый этап заканчивается понятным результатом",
    processText: "Вы всегда знаете, что происходит сейчас, какой документ или работа должны быть готовы и что начинается дальше.",
    teamKicker: "Команда",
    teamTitle: "Люди и объекты, за которые они отвечают",
    teamText: "Карточка специалиста показывает роль, экспертизу и проекты, в которых он участвовал.",
    projectsLabel: "Участие в проектах",
    teamBannerTitle: "Архитекторы, инженеры и мастера работают как одна команда",
    teamBannerText: "Основные fit-out и мебельные работы выполняем своими силами, специализированные задачи ведём под единым контролем.",
    contactKicker: "Новый проект",
    contactTitle: "Расскажите, что нужно изменить",
    contactText: "Ответим на ключевые вопросы, предложим следующий шаг и подготовим список данных для расчёта.",
    name: "Ваше имя",
    phone: "Номер телефона",
    type: "Тип проекта",
    message: "Коротко о задаче",
    submit: "Обсудить в WhatsApp",
    projectTypes: ["Квартира", "Вилла", "Офис", "Ресторан / магазин", "Мебель на заказ", "Другое"],
  },
  en: {
    nav: [
      ["Projects", "#projects"],
      ["Map", "#map"],
      ["Process", "#process"],
      ["Team", "#team"],
      ["Contact", "#contact"],
    ],
    heroKicker: "Renovation · Fit-out · Furniture",
    heroTitle: "We build interiors as precise systems",
    heroText: "One team handles design, approvals, fit-out and bespoke furniture across Dubai and the UAE.",
    heroPrimary: "Explore projects",
    heroSecondary: "Discuss a project",
    scroll: "Scroll to build the interior",
    stats: [["10+", "years of team experience"], ["330 m²", "featured project area"], ["01", "accountable team"], ["UAE", "project geography"]],
    libraryKicker: "Project library",
    libraryTitle: "Projects with facts, files and geography",
    libraryText: "More than a gallery: area, timing, scope, team, photography and public documents are collected in each project card.",
    filters: { all: "All", fitout: "Fit-out", furniture: "Furniture", commercial: "Commercial" },
    featured: "Published case study",
    scope: "MEP · Finishes · Furniture",
    galleryHint: "Select an image to view it full screen",
    filesTitle: "Project files",
    filePublic: "Public PDF case study",
    fileGallery: "Optimised image gallery",
    filePrivate: "Technical drawings & estimates",
    download: "Download",
    ready: "4 WebP · 230 KB",
    locked: "Employees only",
    mapKicker: "Project geography",
    mapTitle: "Projects across the UAE",
    mapText: "Select a marker to see the project type, status and short description. Exact unit or villa numbers remain private.",
    completed: "Completed",
    progress: "In progress",
    caseReady: "Case study published",
    caseSoon: "Materials in preparation",
    processKicker: "Our process",
    processTitle: "Every stage ends with a clear deliverable",
    processText: "You always know what is happening, which document or work should be ready, and what starts next.",
    teamKicker: "Team",
    teamTitle: "The people accountable for each project",
    teamText: "Each specialist profile shows their role, expertise and project participation.",
    projectsLabel: "Project participation",
    teamBannerTitle: "Architects, engineers and craftsmen work as one team",
    teamBannerText: "Core fit-out and furniture works are delivered in-house, with specialist scopes under unified control.",
    contactKicker: "Start a project",
    contactTitle: "Tell us what you want to change",
    contactText: "We will answer the key questions, suggest the next step and prepare a checklist for your estimate.",
    name: "Your name",
    phone: "Phone number",
    type: "Project type",
    message: "Project summary",
    submit: "Discuss on WhatsApp",
    projectTypes: ["Apartment", "Villa", "Office", "Restaurant / retail", "Bespoke furniture", "Other"],
  },
} as const;

const heroStages = ["Empty shell", "Engineering", "Finishes", "Furniture", "Completed interior"];

export default function Home() {
  const [lang, setLang] = useState<Lang>("ru");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [filter, setFilter] = useState<"all" | "fitout" | "furniture" | "commercial">("all");
  const [selectedProject, setSelectedProject] = useState(projectLocations[0].id);
  const [activeStage, setActiveStage] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const t = ui[lang];

  useEffect(() => {
    const update = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const distance = Math.max(hero.offsetHeight - window.innerHeight, 1);
      setProgress(Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / distance)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.13 },
    );
    document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const filteredProjects = useMemo(
    () => projectLocations.filter((project) => filter === "all" || project.category === filter),
    [filter],
  );
  const selected = projectLocations.find((project) => project.id === selectedProject) ?? projectLocations[0];
  const reveal = Math.min(100, progress * 122);
  const heroStage = Math.min(heroStages.length - 1, Math.floor(progress * heroStages.length));

  function chooseFilter(value: typeof filter) {
    setFilter(value);
    const first = projectLocations.find((project) => value === "all" || project.category === value);
    if (first) setSelectedProject(first.id);
  }

  function handlePointer(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", String((event.clientX - rect.left) / rect.width - 0.5));
    event.currentTarget.style.setProperty("--my", String((event.clientY - rect.top) / rect.height - 0.5));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = lang === "ru"
      ? `Здравствуйте! Меня зовут ${data.get("name")}. Тип проекта: ${data.get("type")}. Телефон: ${data.get("phone")}. ${data.get("message") || ""}`
      : `Hello! My name is ${data.get("name")}. Project type: ${data.get("type")}. Phone: ${data.get("phone")}. ${data.get("message") || ""}`;
    window.open(`https://wa.me/971523569697?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main onPointerMove={handlePointer}>
      <section ref={heroRef} className="hero-scroll" aria-label={t.heroTitle}>
        <div className="hero-sticky">
          <div className="hero-wire" aria-hidden="true" style={{ opacity: 0.72 - progress * 0.62 }}>
            <span className="wire wall-a" /><span className="wire wall-b" /><span className="wire floor-a" />
            <span className="wire floor-b" /><span className="wire ceiling-a" /><span className="wire window-a" />
          </div>
          <div className="hero-room" aria-hidden="true" style={{ clipPath: `inset(0 0 0 ${100 - reveal}%)` }} />
          <div className="hero-shade" aria-hidden="true" />

          <header className="site-header">
            <a className="logo" href="#top" aria-label="Space Buro home"><span>SPACE</span><span>BURO</span></a>
            <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
              {t.nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
            </nav>
            <div className="header-actions">
              <button className="language" type="button" onClick={() => setLang(lang === "ru" ? "en" : "ru")} aria-label="Switch language">
                <span className={lang === "ru" ? "active" : ""}>RU</span><i>/</i><span className={lang === "en" ? "active" : ""}>EN</span>
              </button>
              <a className="header-contact" href="https://wa.me/971523569697" target="_blank" rel="noreferrer">WhatsApp ↗</a>
              <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu"><span /><span /></button>
            </div>
          </header>

          <div id="top" className="hero-copy">
            <p className="eyebrow">{t.heroKicker}</p>
            <h1>{t.heroTitle}</h1>
            <p className="hero-description">{t.heroText}</p>
            <div className="hero-ctas">
              <a className="button button-primary" href="#projects">{t.heroPrimary}<span>↘</span></a>
              <a className="button button-ghost" href="#contact">{t.heroSecondary}<span>↗</span></a>
            </div>
          </div>

          <div className="materials" aria-label="Material palette">
            <div className="material-token travertine"><span /><small>Travertine</small></div>
            <div className="material-token walnut"><span /><small>Walnut</small></div>
            <div className="material-token bronze"><span /><small>Bronze</small></div>
          </div>

          <div className="scroll-status">
            <div className="scroll-copy"><span className="mouse-shape" aria-hidden="true" /><p>{t.scroll}</p><strong>{heroStages[heroStage]}</strong></div>
            <div className="progress-track"><span style={{ width: `${progress * 100}%` }} /></div>
            <output>{String(Math.round(progress * 100)).padStart(2, "0")}%</output>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Space Buro facts">
        {t.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>

      <section id="projects" className="section library-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.libraryKicker}</p><h2>{t.libraryTitle}</h2></div>
          <p>{t.libraryText}</p>
        </div>

        <div className="library-toolbar" data-reveal>
          {(Object.keys(t.filters) as Array<keyof typeof t.filters>).map((key) => (
            <button key={key} type="button" className={filter === key ? "active" : ""} onClick={() => chooseFilter(key)}>
              {t.filters[key]}<sup>{projectLocations.filter((item) => key === "all" || item.category === key).length}</sup>
            </button>
          ))}
        </div>

        <article className="featured-case" data-reveal>
          <div className="case-gallery">
            <button className="case-main-image" type="button" onClick={() => setLightbox(true)} aria-label="Open project image">
              <Image src={fujairahImages[activeImage]} alt="Fujairah Trade Centre office fit-out" fill sizes="(max-width: 900px) 100vw, 62vw" priority={false} />
              <span>{String(activeImage + 1).padStart(2, "0")} / {String(fujairahImages.length).padStart(2, "0")}</span>
            </button>
            <div className="case-thumbs">
              {fujairahImages.map((image, index) => (
                <button key={image} type="button" className={index === activeImage ? "active" : ""} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`}>
                  <Image src={image} alt="" fill sizes="110px" />
                </button>
              ))}
            </div>
            <small>{t.galleryHint}</small>
          </div>
          <div className="case-copy">
            <span className="case-badge">{t.featured}</span>
            <h3>Office fit-out<br />Fujairah Trade Centre</h3>
            <p>{projectLocations[0].summary[lang]}</p>
            <dl><div><dt>Area</dt><dd>330 m²</dd></div><div><dt>Duration</dt><dd>3 months</dd></div><div><dt>Scope</dt><dd>{t.scope}</dd></div></dl>
            <a className="text-link" href="#map">View on map <span>↘</span></a>
          </div>
        </article>

        <div className="files-panel" data-reveal>
          <div><p className="eyebrow">{t.filesTitle}</p><h3>Project documentation</h3></div>
          <div className="file-row pending">
            <span className="file-icon">PDF</span><span><strong>{t.filePublic}</strong><small>2 pages · 134 KB</small></span><b>Ready to publish</b>
          </div>
          <div className="file-row"><span className="file-icon">IMG</span><span><strong>{t.fileGallery}</strong><small>{t.ready}</small></span><b className="ready-dot">Ready</b></div>
          <div className="file-row locked"><span className="file-icon">LOCK</span><span><strong>{t.filePrivate}</strong><small>{t.locked}</small></span><b>Private</b></div>
        </div>
      </section>

      <section id="map" className="section map-section">
        <div className="map-copy" data-reveal>
          <p className="eyebrow">{t.mapKicker}</p><h2>{t.mapTitle}</h2><p>{t.mapText}</p>
          <div className="map-project-list">
            {filteredProjects.map((project) => (
              <button key={project.id} type="button" className={selected.id === project.id ? "active" : ""} onClick={() => setSelectedProject(project.id)}>
                <span className={`status-dot ${project.status}`} /><span><strong>{project.district}</strong><small>{project.title[lang]}</small></span><b>↗</b>
              </button>
            ))}
          </div>
        </div>
        <div className="map-shell" data-reveal>
          <ProjectMap projects={filteredProjects} selectedId={selected.id} lang={lang} onSelect={setSelectedProject} />
          <article className="map-card">
            <span className={`project-status ${selected.status}`}>{selected.status === "completed" ? t.completed : t.progress}</span>
            <h3>{selected.title[lang]}</h3><p>{selected.summary[lang]}</p>
            <div><span>{selected.year}</span><span>{selected.published ? t.caseReady : t.caseSoon}</span></div>
          </article>
        </div>
      </section>

      <section id="process" className="section process-section">
        <div className="section-heading" data-reveal><div><p className="eyebrow">{t.processKicker}</p><h2>{t.processTitle}</h2></div><p>{t.processText}</p></div>
        <div className="process-workspace" data-reveal>
          <div className="process-nav">
            {stages.map((stage, index) => (
              <button key={stage.number} type="button" className={activeStage === index ? "active" : ""} onMouseEnter={() => setActiveStage(index)} onFocus={() => setActiveStage(index)} onClick={() => setActiveStage(index)}>
                <span>{stage.number}</span><strong>{stage.title[lang]}</strong><i>↗</i>
              </button>
            ))}
          </div>
          <article className="stage-detail" key={`${lang}-${activeStage}`}>
            <div className="stage-visual" aria-hidden="true"><span>{stages[activeStage].number}</span><i /><b /></div>
            <p className="eyebrow">Stage {stages[activeStage].number}</p>
            <h3>{stages[activeStage].title[lang]}</h3>
            <p>{stages[activeStage].text[lang]}</p>
            <strong>{stages[activeStage].result[lang]}</strong>
          </article>
        </div>
      </section>

      <section id="team" className="section team-section">
        <div className="section-heading" data-reveal><div><p className="eyebrow">{t.teamKicker}</p><h2>{t.teamTitle}</h2></div><p>{t.teamText}</p></div>
        <div className="team-grid">
          {team.map((member, index) => (
            <article className="team-card" key={member.id} data-reveal style={{ transitionDelay: `${index * 90}ms` }}>
              <div className="team-photo"><Image src={member.image} alt={member.name[lang]} fill sizes="(max-width: 800px) 100vw, 33vw" /><span>0{index + 1}</span></div>
              <div className="team-copy"><p>{member.role[lang]}</p><h3>{member.name[lang]}</h3><span>{member.experience[lang]}</span><small>{t.projectsLabel}</small><ul>{member.projects.map((project) => <li key={project}>{project}</li>)}</ul></div>
            </article>
          ))}
        </div>
        <div className="team-banner" data-reveal>
          <Image src="/media/team-group.webp" alt="Space Buro team in Dubai" fill sizes="100vw" />
          <div><p className="eyebrow">SPACE BURO · DUBAI</p><h3>{t.teamBannerTitle}</h3><p>{t.teamBannerText}</p></div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="contact-copy" data-reveal><p className="eyebrow">{t.contactKicker}</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p><div><a href="tel:+971523569697">+971 52 356 9697</a><a href="mailto:support@space-buro.ae">support@space-buro.ae</a></div></div>
        <form className="contact-form" onSubmit={handleSubmit} data-reveal>
          <label><span>{t.name}</span><input name="name" autoComplete="name" required /></label>
          <label><span>{t.phone}</span><input name="phone" type="tel" autoComplete="tel" required pattern="[+0-9 ()-]{7,}" /></label>
          <label><span>{t.type}</span><select name="type" required defaultValue=""><option value="" disabled>—</option>{t.projectTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="wide"><span>{t.message}</span><textarea name="message" rows={3} /></label>
          <button className="button button-primary form-submit" type="submit">{t.submit}<span>↗</span></button>
        </form>
      </section>

      <footer>
        <a className="logo footer-logo" href="#top" aria-label="Space Buro home"><span>SPACE</span><span>BURO</span></a>
        <p>SPACE BURO TECHNICAL SERVICES L.L.C-FZ · Dubai, UAE</p>
        <div><a href="https://www.instagram.com/space.buro" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://wa.me/971523569697" target="_blank" rel="noreferrer">WhatsApp ↗</a></div><small>© 2026 Space Buro</small>
      </footer>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Project gallery">
          <button type="button" className="lightbox-close" onClick={() => setLightbox(false)} aria-label="Close">×</button>
          <button type="button" className="lightbox-prev" onClick={() => setActiveImage((activeImage - 1 + fujairahImages.length) % fujairahImages.length)} aria-label="Previous">←</button>
          <Image src={fujairahImages[activeImage]} alt="Fujairah Trade Centre project" fill sizes="100vw" />
          <button type="button" className="lightbox-next" onClick={() => setActiveImage((activeImage + 1) % fujairahImages.length)} aria-label="Next">→</button>
        </div>
      )}
    </main>
  );
}
