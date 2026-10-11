"use client";

import ResponsiveArrow from "./ResponsiveArrow";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projectLocations, stages, team, type Lang, type ProjectLocation } from "./data";
import { pathFor, projectPath } from "./site";
import "./lab-header.css";

type MenuCard = { title: string; tag: string; image: string; href: string; portrait?: boolean };
type HeaderProps = { lang: Lang; items: readonly (readonly string[])[] };

const previewProjects = ["al-furjan-villa", "al-bateen-residences-jbr", "office-vostok-real-estate"]
  .map((id) => projectLocations.find((project) => project.id === id))
  .filter((project): project is ProjectLocation => project !== undefined && project.published && project.images.length > 0);

function cardsFor(href: string, lang: Lang): MenuCard[] {
  const ru = lang === "ru";
  const projectCards = previewProjects.map((project) => ({
    title: project.shortTitle[lang], tag: project.district,
    image: project.cover ?? project.images[0], href: projectPath(lang, project),
  }));
  switch (href) {
    case "#why": return [
      { title: ru ? "Одна команда" : "One team", tag: ru ? "Люди и ответственность" : "People & responsibility", image: "/media/team-group.webp", href: "#team" },
      { title: ru ? "Понятные этапы" : "A clear process", tag: ru ? "От идеи до передачи" : "From idea to handover", image: stages[3].image, href: "#process" },
      { title: ru ? "Прозрачный расчёт" : "Transparent estimates", tag: ru ? "Планирование бюджета" : "Budget planning", image: stages[0].image, href: "#calculator" },
    ];
    case "#projects": return projectCards;
    case "#map": return projectCards.map((card) => ({ ...card, href: "#map", tag: ru ? "Посмотреть географию" : "Explore locations" }));
    case "#china": return [
      { title: ru ? "Мебель из Китая" : "Furniture from China", tag: ru ? "Как устроена услуга" : "How it works", image: "/media/china-furniture-concept.webp", href: pathFor(lang, "/china-furniture") },
      { title: ru ? "Фабрики и материалы" : "Factories & materials", tag: ru ? "Подбор и комплектация" : "Sourcing & specifications", image: "/media/china-furniture-photo.webp", href: "#china" },
      { title: ru ? "Обсудить комплектацию" : "Discuss your furniture", tag: ru ? "Начать с вашей задачи" : "Start with your brief", image: "/media/projects/al-bateen-residence/gallery/01.webp", href: "#contact" },
    ];
    case "#process": return [stages[0], stages[3], stages[6]].map((stage) => ({
      title: stage.title[lang], tag: `${ru ? "Этап" : "Stage"} ${stage.number}`, image: stage.image, href: `#process-stage-${stage.number}`,
    }));
    case "#calculator": return [
      { title: ru ? "Ремонт" : "Renovation", tag: ru ? "Предварительный бюджет" : "Initial budget", image: stages[5].image, href: "#calculator" },
      { title: ru ? "Мебель на заказ" : "Bespoke furniture", tag: ru ? "Материалы и объём" : "Materials & scope", image: stages[6].image, href: "#calculator" },
      { title: ru ? "Индивидуальная смета" : "A project estimate", tag: ru ? "Обсудим детали" : "Let’s discuss the details", image: stages[3].image, href: "#contact" },
    ];
    case "#team": return team.map((person) => ({
      title: person.name[lang], tag: person.role[lang], image: person.image, href: `#team-${person.id}`, portrait: true,
    }));
    case "#contact": return [
      { title: "WhatsApp", tag: "+971 52 356 9697", image: "/media/team-maruf-lab.webp", href: "https://wa.me/971523569697", portrait: true },
      { title: "Telegram", tag: "@marufkad", image: "/media/team-group.webp", href: "https://t.me/marufkad" },
      { title: ru ? "Расскажите о проекте" : "Tell us about your project", tag: ru ? "План · фотографии · задача" : "Plans · photos · brief", image: stages[0].image, href: "#contact" },
    ];
    default: return [];
  }
}

function ContactIcon({ name }: { name: "whatsapp" | "telegram" }) {
  return name === "telegram" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 3-18 7 5 2 2 7 4-4 5 4 2-16ZM8 12 18 6l-8 9v4" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 11.6a8.4 8.4 0 0 1-12.5 7.3L3 20.2l1.3-4.7a8.4 8.4 0 1 1 16.1-3.9Z" /><path d="m8 8 1-1 2 3-1 1c1 2 2 3 3 3l1-1 3 2-1 1c-3 2-10-5-8-8Z" /></svg>
  );
}

export default function LabHeader({ lang, items }: HeaderProps) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visitedMenus, setVisitedMenus] = useState<string[]>([]);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const ru = lang === "ru";
  const isDesktopLayout = () => window.matchMedia("(min-width: 1151px)").matches;
  const isDesktop = () => window.matchMedia("(min-width: 1151px) and (hover: hover)").matches;

  function closeMenu() { setOpen(null); setMobileOpen(false); }
  function showMenu(href: string) {
    setVisitedMenus(previous => previous.includes(href) ? previous : [...previous, href]);
    setOpen(href);
  }

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1151px)");
    const resetNavigation = () => {
      const activeElement = document.activeElement;
      const navigation = headerRef.current?.querySelector("nav");
      setOpen(null);
      setMobileOpen(false);
      if (!desktop.matches && navigation?.contains(activeElement)) {
        toggleRef.current?.focus();
      } else if (desktop.matches && (navigation?.contains(activeElement) || activeElement === toggleRef.current)) {
        headerRef.current?.querySelector<HTMLAnchorElement>(".lab-header-logo")?.focus();
      }
    };
    desktop.addEventListener("change", resetNavigation);
    return () => desktop.removeEventListener("change", resetNavigation);
  }, []);

  useEffect(() => {
    if (!open && !mobileOpen) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setOpen(null); setMobileOpen(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || (!open && !mobileOpen)) return;
      event.preventDefault();
      if (mobileOpen) { setMobileOpen(false); toggleRef.current?.focus(); }
      else if (open) triggerRefs.current[open]?.focus();
      setOpen(null);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, mobileOpen]);

  return (
    <header className="lab-header" ref={headerRef}
      onPointerLeave={() => {
        if (isDesktop() && !headerRef.current?.querySelector("nav")?.contains(document.activeElement)) setOpen(null);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMenu();
      }}>
      <a className="lab-header-logo" href="#top" aria-label={ru ? "Space Buro — главная" : "Space Buro home"} onClick={closeMenu}>
        <Image src="/space-buro-logo.png" alt="Space Buro" width={104} height={65} priority />
      </a>
      <nav className={`lab-header-nav${mobileOpen ? " is-mobile-open" : ""}`} id="lab-navigation" aria-label={ru ? "Главное меню" : "Main navigation"}>
        <ul className="lab-header-items">
          {items.map(([label, href]) => {
            const key = href.replace("#", "");
            const expanded = open === href;
            const panelId = `lab-menu-${key}`;
            return (
              <li className={`lab-header-item${expanded ? " is-open" : ""}`} key={href}
                onPointerEnter={(event) => { if (event.pointerType === "mouse" && isDesktop()) showMenu(href); }}>
                <a className="lab-header-mobile-link" href={href} onClick={closeMenu}>
                  {label}<ResponsiveArrow />
                </a>
                <button type="button" className="lab-header-trigger" ref={(node) => { triggerRefs.current[href] = node; }}
                  aria-expanded={expanded} aria-controls={panelId}
                  onFocus={event => { if (isDesktopLayout() && event.currentTarget.matches(":focus-visible")) showMenu(href); }}
                  onClick={() => { if (isDesktopLayout()) { if (!isDesktop() && expanded) setOpen(null); else showMenu(href); } }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" && isDesktopLayout()) {
                      event.preventDefault(); showMenu(href);
                      requestAnimationFrame(() => document.getElementById(panelId)?.querySelector<HTMLAnchorElement>("a")?.focus());
                    }
                  }}>
                  {label}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4 3 3 3-3" /></svg>
                </button>
                <div className="lab-header-panel" id={panelId} aria-hidden={!expanded} inert={!expanded}>
                  <div className="lab-header-panel-clip">
                    <div className="lab-header-panel-inner">
                      <div className="lab-header-panel-heading">
                        <span>{label}</span>
                        <a href={href} onClick={closeMenu}>{ru ? "Открыть раздел" : "Explore section"}<ResponsiveArrow /></a>
                      </div>
                      <div className="lab-header-cards">
                        {cardsFor(href, lang).map((card, index) => (
                          <Link className={`lab-header-card${card.portrait ? " is-portrait" : ""}`} href={card.href} key={`${card.href}-${index}`}
                            style={{ "--card-order": index } as CSSProperties} onClick={closeMenu}
                            {...(card.href.startsWith("https:") ? { target: "_blank", rel: "noreferrer" } : {})}>
                            {(expanded || visitedMenus.includes(href)) && <Image src={card.image} alt="" fill sizes="(max-width: 600px) 90vw, (max-width: 1150px) 45vw, 30vw" />}
                            <ResponsiveArrow className="lab-header-card-arrow" />
                            <span className="lab-header-card-caption"><small>{card.tag}</small><strong>{card.title}</strong></span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="lab-header-actions" onFocus={() => setOpen(null)}>
        <Link className="lab-header-language" href={pathFor(ru ? "en" : "ru")} hrefLang={ru ? "en" : "ru"} aria-label={ru ? "Switch to English" : "Перейти на русский"} onClick={closeMenu}>{ru ? "EN" : "RU"}</Link>
        <a className="lab-header-social" href="https://wa.me/971523569697" target="_blank" rel="noreferrer" aria-label="WhatsApp" onClick={closeMenu}><ContactIcon name="whatsapp" /></a>
        <a className="lab-header-social" href="https://t.me/marufkad" target="_blank" rel="noreferrer" aria-label="Telegram" onClick={closeMenu}><ContactIcon name="telegram" /></a>
        <button className="lab-header-toggle" type="button" ref={toggleRef} aria-controls="lab-navigation" aria-expanded={mobileOpen} aria-label={mobileOpen ? (ru ? "Закрыть меню" : "Close menu") : (ru ? "Открыть меню" : "Open menu")}
          onClick={() => { setMobileOpen(!mobileOpen); setOpen(null); }}><span /><span /></button>
      </div>
    </header>
  );
}
