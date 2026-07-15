"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Lang = "ru" | "en";

const copy = {
  ru: {
    nav: ["Услуги", "Проекты", "Этапы", "О компании", "Контакты"],
    heroEyebrow: "Ремонт · Fit-out · Мебель",
    heroTitle: "Пространство, которое создаётся у вас на глазах",
    heroText: "Ремонт и мебель на заказ в Дубае — от чертежей и согласований до полностью готового интерьера.",
    heroPrimary: "Запустить трансформацию",
    heroSecondary: "Обсудить проект",
    scroll: "Прокрутите, чтобы построить интерьер",
    stages: ["Пустое помещение", "Инженерные работы", "Отделка", "Мебель", "Готовый интерьер"],
    servicesKicker: "Единый процесс",
    servicesTitle: "Берём ответственность за весь интерьер",
    servicesText: "Одна команда ведёт проект от первого замера до финальной приёмки — без разрыва между ремонтом и мебелью.",
    services: [
      ["Ремонт и fit-out", "Квартиры, виллы, офисы, рестораны и коммерческие пространства под ключ."],
      ["Мебель на заказ", "Кухни, гардеробные, стеновые панели и встроенная мебель на собственном производстве."],
      ["Дизайн и чертежи", "Планировки, рабочая документация, мебельные чертежи и подбор материалов."],
      ["Согласования", "Координация с building management, NOC, permits и технической документацией."],
    ],
    workKicker: "Избранный проект",
    workTitle: "Office fit-out — Fujairah Trade Centre",
    workText: "Полный цикл работ для офиса площадью 330 м²: инженерия, потолки, отделка, встроенная мебель и финальная комплектация.",
    workMeta: ["Fujairah", "330 м²", "3 месяца"],
    workCta: "Смотреть проект",
    processKicker: "Как мы работаем",
    processTitle: "Понятный маршрут от идеи до сдачи",
    process: [
      ["01", "Консультация", "Обсуждаем задачи, стиль, бюджет и сроки."],
      ["02", "Замеры", "Фиксируем особенности объекта и инженерных систем."],
      ["03", "Смета и договор", "Согласовываем объём, материалы, стоимость и график."],
      ["04", "Реализация", "Организуем работы и производство мебели параллельно."],
      ["05", "Контроль", "Проверяем качество и показываем прогресс на каждом этапе."],
      ["06", "Передача", "Финальная приёмка, документы и гарантия по договору."],
    ],
    aboutKicker: "Space Buro",
    aboutTitle: "Люди, которые отвечают за результат",
    aboutText: "Архитекторы, инженеры, мебельщики и мастера работают как одна команда в Дубае. Основные работы выполняем сами, специализированные задачи ведём под нашим контролем.",
    principles: ["Собственное мебельное производство", "Одна команда для ремонта и мебели", "Прозрачная смета и график", "Гарантия фиксируется в договоре"],
    contactKicker: "Начать проект",
    contactTitle: "Расскажите, что вы хотите изменить",
    contactText: "Оставьте короткую информацию — мы подготовим вопросы и свяжемся с вами в WhatsApp.",
    name: "Ваше имя",
    phone: "Номер телефона",
    type: "Тип проекта",
    types: ["Квартира", "Вилла", "Офис", "Ресторан / магазин", "Мебель на заказ", "Другое"],
    message: "Коротко о задаче",
    send: "Обсудить в WhatsApp",
    direct: "Или свяжитесь напрямую",
    legal: "SPACE BURO TECHNICAL SERVICES L.L.C-FZ · Dubai, UAE",
  },
  en: {
    nav: ["Services", "Projects", "Process", "About", "Contacts"],
    heroEyebrow: "Renovation · Fit-out · Furniture",
    heroTitle: "A space that takes shape before your eyes",
    heroText: "Interior renovation and custom furniture in Dubai — from drawings and approvals to a fully finished space.",
    heroPrimary: "Start the transformation",
    heroSecondary: "Discuss your project",
    scroll: "Scroll to build the interior",
    stages: ["Empty space", "Engineering", "Finishes", "Furniture", "Completed interior"],
    servicesKicker: "One seamless process",
    servicesTitle: "One team responsible for the entire interior",
    servicesText: "We guide every project from the first site measurement to final handover — connecting fit-out and furniture in one workflow.",
    services: [
      ["Renovation & fit-out", "Turnkey apartments, villas, offices, restaurants and commercial interiors."],
      ["Custom furniture", "Kitchens, wardrobes, wall panels and built-in furniture made in-house."],
      ["Design & drawings", "Layouts, working documentation, joinery drawings and material selection."],
      ["Approvals", "Coordination with building management, NOCs, permits and technical documents."],
    ],
    workKicker: "Featured project",
    workTitle: "Office fit-out — Fujairah Trade Centre",
    workText: "A complete 330 m² office delivery: MEP, ceilings, finishes, custom joinery and final completion.",
    workMeta: ["Fujairah", "330 m²", "3 months"],
    workCta: "View project",
    processKicker: "Our process",
    processTitle: "A clear route from idea to handover",
    process: [
      ["01", "Consultation", "We align on goals, style, budget and timeline."],
      ["02", "Site survey", "We document the space and existing engineering systems."],
      ["03", "Quote & contract", "Scope, materials, cost and schedule are agreed in advance."],
      ["04", "Delivery", "Site works and furniture production move forward together."],
      ["05", "Quality control", "We inspect the work and share progress at each stage."],
      ["06", "Handover", "Final inspection, documentation and contractual warranty."],
    ],
    aboutKicker: "Space Buro",
    aboutTitle: "The people responsible for the result",
    aboutText: "Architects, engineers, joiners and craftsmen work as one Dubai-based team. Core work is delivered in-house, with specialist packages managed under our control.",
    principles: ["In-house furniture production", "One team for fit-out and furniture", "Transparent quote and schedule", "Warranty set out in the contract"],
    contactKicker: "Start a project",
    contactTitle: "Tell us what you want to transform",
    contactText: "Share a few details and we will follow up with the right questions on WhatsApp.",
    name: "Your name",
    phone: "Phone number",
    type: "Project type",
    types: ["Apartment", "Villa", "Office", "Restaurant / retail", "Custom furniture", "Other"],
    message: "A short project note",
    send: "Discuss on WhatsApp",
    direct: "Or contact us directly",
    legal: "SPACE BURO TECHNICAL SERVICES L.L.C-FZ · Dubai, UAE",
  },
} as const;

const projectImages = [
  "https://www.space-buro.ae/wp-content/uploads/2026/04/DSC_9123-5-3.png",
  "https://www.space-buro.ae/wp-content/uploads/2026/04/DSC_9123-5-2.png",
  "https://www.space-buro.ae/wp-content/uploads/2026/04/DSC_9123-5-1.png",
  "https://www.space-buro.ae/wp-content/uploads/2026/04/DSC_9123-5.png",
];

export default function Home() {
  const [lang, setLang] = useState<Lang>("ru");
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const t = copy[lang];

  useEffect(() => {
    const update = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, -rect.top / distance)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const stageIndex = Math.min(t.stages.length - 1, Math.floor(progress * t.stages.length));
  const reveal = Math.min(100, Math.max(0, (progress - 0.06) * 112));

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "HomeAndConstructionBusiness",
      name: "Space Buro Technical Services L.L.C-FZ",
      url: "https://www.space-buro.ae/",
      telephone: "+971523569697",
      email: "support@space-buro.ae",
      areaServed: "Dubai, UAE",
      sameAs: ["https://www.instagram.com/space.buro"],
    }),
    [],
  );

  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--mx", x.toFixed(3));
    event.currentTarget.style.setProperty("--my", y.toFixed(3));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = lang === "ru"
      ? `Здравствуйте! Меня зовут ${data.get("name")}. Телефон: ${data.get("phone")}. Тип проекта: ${data.get("type")}. ${data.get("message") || ""}`
      : `Hello! My name is ${data.get("name")}. Phone: ${data.get("phone")}. Project type: ${data.get("type")}. ${data.get("message") || ""}`;
    window.open(`https://wa.me/971523569697?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section ref={heroRef} className="hero-scroll" aria-label={t.heroTitle}>
        <div className="hero-sticky" onPointerMove={handlePointer}>
          <div
            className="hero-wire"
            aria-hidden="true"
            style={{ opacity: 0.72 - progress * 0.62 }}
          >
            <span className="wire wall-a" />
            <span className="wire wall-b" />
            <span className="wire floor-a" />
            <span className="wire floor-b" />
            <span className="wire ceiling-a" />
            <span className="wire window-a" />
          </div>
          <div
            className="hero-room"
            aria-hidden="true"
            style={{ clipPath: `inset(0 0 0 ${100 - reveal}%)` }}
          />
          <div className="hero-shade" aria-hidden="true" />

          <header className="site-header">
            <a className="logo" href="#top" aria-label="Space Buro — home">
              <span>SPACE</span><span>BURO</span>
            </a>
            <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label={lang === "ru" ? "Основная навигация" : "Main navigation"}>
              {t.nav.map((item, index) => (
                <a key={item} href={`#${["services", "projects", "process", "about", "contact"][index]}`} onClick={() => setMenuOpen(false)}>{item}</a>
              ))}
            </nav>
            <div className="header-actions">
              <button className="language" type="button" onClick={() => setLang(lang === "ru" ? "en" : "ru")} aria-label="Switch language">
                <span className={lang === "ru" ? "active" : ""}>RU</span><i>/</i><span className={lang === "en" ? "active" : ""}>EN</span>
              </button>
              <a className="header-contact" href="https://wa.me/971523569697" target="_blank" rel="noreferrer">WhatsApp ↗</a>
              <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
                <span /><span />
              </button>
            </div>
          </header>

          <div id="top" className="hero-copy">
            <p className="eyebrow">{t.heroEyebrow}</p>
            <h1>{t.heroTitle}</h1>
            <p className="hero-description">{t.heroText}</p>
            <div className="hero-ctas">
              <a className="button button-primary" href="#transformation">{t.heroPrimary}<span>↘</span></a>
              <a className="button button-ghost" href="#contact">{t.heroSecondary}<span>↗</span></a>
            </div>
          </div>

          <div className="materials" aria-label={lang === "ru" ? "Материалы проекта" : "Project materials"}>
            <div className="material-token travertine"><span /><small>{lang === "ru" ? "Травертин" : "Travertine"}</small></div>
            <div className="material-token walnut"><span /><small>{lang === "ru" ? "Орех" : "Walnut"}</small></div>
            <div className="material-token bronze"><span /><small>{lang === "ru" ? "Бронза" : "Bronze"}</small></div>
          </div>

          <div id="transformation" className="scroll-status">
            <div className="scroll-copy"><span className="mouse-shape" aria-hidden="true" /><p>{t.scroll}</p><strong>{t.stages[stageIndex]}</strong></div>
            <div className="progress-track"><span style={{ width: `${progress * 100}%` }} /></div>
            <output aria-live="polite">{String(Math.round(progress * 100)).padStart(2, "0")}%</output>
          </div>
        </div>
      </section>

      <section id="services" className="section services-section">
        <div className="section-intro">
          <p className="eyebrow">{t.servicesKicker}</p>
          <h2>{t.servicesTitle}</h2>
          <p>{t.servicesText}</p>
        </div>
        <div className="services-grid">
          {t.services.map(([title, text], index) => (
            <article key={title} className="service-card">
              <span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><i>↗</i>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section project-section">
        <div className="project-gallery">
          <img src={projectImages[activeImage]} alt="Office fit-out at Fujairah Trade Centre by Space Buro" loading="lazy" width="2049" height="1365" />
          <div className="project-thumbs" aria-label="Project gallery">
            {projectImages.map((src, index) => (
              <button key={src} type="button" className={activeImage === index ? "active" : ""} onClick={() => setActiveImage(index)} aria-label={`Show project image ${index + 1}`}>
                <img src={src} alt="" loading="lazy" width="204" height="136" />
              </button>
            ))}
          </div>
        </div>
        <div className="project-copy">
          <p className="eyebrow">{t.workKicker}</p><h2>{t.workTitle}</h2><p>{t.workText}</p>
          <ul>{t.workMeta.map((item) => <li key={item}>{item}</li>)}</ul>
          <a className="text-link" href="#contact">{t.workCta}<span>↗</span></a>
        </div>
      </section>

      <section id="process" className="section process-section">
        <div className="section-intro compact"><p className="eyebrow">{t.processKicker}</p><h2>{t.processTitle}</h2></div>
        <div className="process-list">
          {t.process.map(([number, title, text]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="about-image">
          <img src="https://www.space-buro.ae/wp-content/uploads/2026/04/IMG_5204-1.png" alt="Space Buro team in Dubai" loading="lazy" width="2238" height="1332" />
          <span>Dubai · UAE</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow">{t.aboutKicker}</p><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p>
          <ul>{t.principles.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="contact-copy"><p className="eyebrow">{t.contactKicker}</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p>
          <div className="direct-contact"><span>{t.direct}</span><a href="tel:+971523569697">+971 52 356 9697</a><a href="mailto:support@space-buro.ae">support@space-buro.ae</a></div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label><span>{t.name}</span><input name="name" autoComplete="name" required /></label>
          <label><span>{t.phone}</span><input name="phone" type="tel" autoComplete="tel" required pattern="[+0-9 ()-]{7,}" /></label>
          <label><span>{t.type}</span><select name="type" required defaultValue=""><option value="" disabled>—</option>{t.types.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="wide"><span>{t.message}</span><textarea name="message" rows={3} /></label>
          <button className="button button-primary form-submit" type="submit">{t.send}<span>↗</span></button>
        </form>
      </section>

      <footer>
        <a className="logo footer-logo" href="#top" aria-label="Space Buro — home"><span>SPACE</span><span>BURO</span></a>
        <p>{t.legal}</p>
        <div><a href="https://www.instagram.com/space.buro" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://wa.me/971523569697" target="_blank" rel="noreferrer">WhatsApp ↗</a></div>
        <small>© 2026 Space Buro</small>
      </footer>
    </main>
  );
}
