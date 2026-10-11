"use client";

import ResponsiveArrow from "./ResponsiveArrow";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { stages, type Lang } from "./data";
import "./lab-people-process.css";

export default function LabProcess({ lang }: { lang: Lang }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const text = lang === "ru" ? {
    label: "Этапы работы",
    title: "От первого разговора до готового интерьера.",
    intro: "Восемь этапов. На каждом — конкретные задачи и понятный результат.",
    result: "Результат",
    stage: "Этап",
    image: "Иллюстрация этапа",
  } : {
    label: "Our process",
    title: "From the first conversation to a finished interior.",
    intro: "Eight stages. Clear tasks and a defined result at every step.",
    result: "Result",
    stage: "Stage",
    image: "Stage illustration",
  };

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = [...list.querySelectorAll<HTMLElement>("[data-lab-stage]")];
    const photos = [...list.querySelectorAll<HTMLElement>(".lab-process-image")];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const initialBounds = list.getBoundingClientRect();
    let inView = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight;
    let frame = 0;
    let dirty = true;
    let current = 0;
    let target = 0;
    let selected = 0;
    let lastTime = 0;

    const draw = (time: number) => {
      frame = 0;
      if (document.hidden || !inView) return;
      if (dirty) {
        dirty = false;
        const bounds = list.getBoundingClientRect();
        const cursor = window.innerHeight * .5 - bounds.top;
        target = Math.max(0, Math.min(1, cursor / Math.max(1, bounds.height)));
        let nearest = 0;
        let distance = Infinity;
        rows.forEach((row, index) => {
          const nextDistance = Math.abs(row.offsetTop + row.offsetHeight / 2 - cursor);
          if (nextDistance < distance) { distance = nextDistance; nearest = index; }
        });
        if (nearest !== selected) { selected = nearest; setActive(nearest); }

        // The same clipped, oversized-image technique as the reference,
        // at a gentler 35% range. Only the photo moves inside its frame.
        const offsets = photos.map(photo => {
          const imageBounds = photo.getBoundingClientRect();
          if (motion.matches) return 0;
          if (imageBounds.bottom < 0 || imageBounds.top > window.innerHeight) return null;
          const progress = Math.max(0, Math.min(1, (window.innerHeight - imageBounds.top) / (window.innerHeight + imageBounds.height)));
          return (progress - .5) * .35 * photo.clientHeight;
        });
        photos.forEach((photo, index) => {
          if (offsets[index] !== null) photo.style.setProperty("--lab-photo-offset", `${offsets[index]}px`);
        });
      }
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
      lastTime = time;
      current = motion.matches ? target : current + (target - current) * (1 - Math.exp(-elapsed / 90));
      if (Math.abs(target - current) < .0002) current = target;
      list.style.setProperty("--lab-process-progress", String(current));
      if (current !== target) frame = window.requestAnimationFrame(draw);
      else lastTime = 0;
    };
    const schedule = () => {
      dirty = true;
      if (!frame && !document.hidden && inView) frame = window.requestAnimationFrame(draw);
    };
    const visibility = () => {
      if (document.hidden) { window.cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
      else schedule();
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(list);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) schedule();
      else { window.cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    });
    observer.observe(list);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", schedule);
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section className="lab-process" id="process" aria-labelledby="lab-process-title">
      <header className="lab-process-heading">
        <p className="lab-process-kicker">[ {text.label} ]</p>
        <div>
          <h2 id="lab-process-title">{text.title}</h2>
          <p>{text.intro}</p>
        </div>
      </header>

      <ol className="lab-process-list" ref={listRef}>
        {stages.map((stage, index) => (
          <li className={`lab-process-stage${active === index ? " is-active" : ""}${index < active ? " is-complete" : ""}`} key={stage.number} id={`process-stage-${stage.number}`} data-lab-stage={index} aria-current={active === index ? "step" : undefined}>
            <div className="lab-process-stage-content">
            <div className="lab-process-number" aria-hidden="true"><span>/{stage.number}</span></div>
            <div className="lab-process-copy">
              <span className="lab-process-step-label">{text.stage} {stage.number} / 08</span>
              <h3>{stage.title[lang]}</h3>
              <p>{stage.text[lang]}</p>
              <div className="lab-process-result">
                <span>{text.result}</span>
                <strong><ResponsiveArrow /> {stage.result[lang]}</strong>
              </div>
            </div>
            <figure className="lab-process-image">
              <div className="lab-process-photo"><Image src={stage.image} alt={`${text.image}: ${stage.title[lang]}`} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 48vw, 43vw" /></div>
              <figcaption>{text.image} · {stage.number}</figcaption>
            </figure>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
