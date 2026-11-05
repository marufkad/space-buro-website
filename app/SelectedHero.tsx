"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { projectLocations, type Lang } from "./data";
import { pathFor, projectPath } from "./site";
import "./selected-hero.css";

const project = projectLocations.find(item => item.id === "al-furjan-villa")!;

export default function SelectedHero({ lang }: { lang: Lang }) {
  const heroRef = useRef<HTMLElement>(null);
  const ru = lang === "ru";

  useEffect(() => {
    const hero = heroRef.current;
    const header = hero?.closest("main")?.querySelector<HTMLElement>(".lab-header");
    if (!hero || !header) return;
    let observer: IntersectionObserver | undefined;
    let height = -1;
    const observe = () => {
      const nextHeight = header.offsetHeight;
      if (nextHeight === height) return;
      height = nextHeight;
      observer?.disconnect();
      observer = new IntersectionObserver(([entry]) => {
        header.classList.toggle("is-past-selected-hero", !entry.isIntersecting);
      }, { rootMargin: `-${height}px 0px 0px 0px`, threshold: 0 });
      observer.observe(hero);
    };
    const resize = new ResizeObserver(observe);
    resize.observe(header);
    observe();
    return () => {
      observer?.disconnect();
      resize.disconnect();
      header.classList.remove("is-past-selected-hero");
    };
  }, []);

  return <section className="selected-hero" ref={heroRef} aria-labelledby="selected-hero-heading">
    <Image
      className="selected-hero-image"
      src="/media/projects/al-furjan-villa/gallery/07.webp"
      alt={ru ? "Обеденный стол у панорамных окон с видом на гостиную." : "Dining table beside floor-to-ceiling windows, looking towards the living room."}
      fill sizes="100vw" preload
    />
    <div className="selected-hero-content">
      <div>
        <p className="selected-hero-eyebrow">SPACE BURO · DUBAI, UAE</p>
        <h1 id="selected-hero-heading">{ru ? "Создайте ваше пространство вместе с нами." : "Create your space together with us."}</h1>
      </div>
      <div className="selected-hero-bottom">
        <div className="selected-hero-actions">
          <a className="selected-hero-cta" href="#projects">{ru ? "Смотреть объекты" : "View projects"}<span aria-hidden="true">→</span></a>
          <Link className="selected-hero-link" href={pathFor(lang, "/calculator")}>{ru ? "Рассчитать проект" : "Estimate your project"}<span aria-hidden="true">→</span></Link>
        </div>
        <Link className="selected-hero-project" href={projectPath(lang, project)}>
          <strong>{project.shortTitle[lang]}</strong>
          <span>{project.area[lang]} · {ru ? "Завершён" : "Completed"}</span>
        </Link>
      </div>
    </div>
  </section>;
}
