"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "./data";
import ResponsiveArrow from "./ResponsiveArrow";

const desktopDirections = [[4, 2], [-.1, 1], [-1, -.1], [-4, 2], [4, -2], [1, .1], [.1, -1], [-4, -2]];
const mobileDirections = [[2, 3], [-2, 3], [.25, 1.5], [-1.5, .25], [1.5, -.25], [-.25, -1.5], [2, -3], [-2, -3]];
const hoverPhotos = [
  "/media/projects/al-furjan-villa/gallery/07.webp",
  "/media/team-group.webp",
  "/media/stages/07-furniture.webp",
  "/media/team-group.webp",
  "/media/stages/05-approvals.webp",
  "/media/stages/04-drawings.webp",
  "/media/stages/06-implementation.webp",
  "/media/stages/08-handover.webp",
];
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => value * value * (3 - 2 * value);
// Source reference: brand.dropbox.com intro, cubic-bezier(1,.25,.85,1).
function assemblyEase(progress: number) {
  if (progress === 0 || progress === 1) return progress;
  let lower = 0, upper = 1;
  const cubic = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  for (let index = 0; index < 18; index++) {
    const middle = (lower + upper) / 2;
    if (cubic(middle, 1, .85) < progress) lower = middle; else upper = middle;
  }
  return cubic((lower + upper) / 2, .25, 1);
}

type Props = { lang: Lang; kicker: string; title: string; items: readonly (readonly string[])[] };
export default function LabAdvantages({ lang, kicker, title, items }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const ru = lang === "ru";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const stage = section.querySelector<HTMLElement>(".lab-advantages-stage")!;
    const grid = section.querySelector<HTMLElement>(".lab-advantages-grid")!;
    const lines = section.querySelector<HTMLElement>(".lab-advantages-gridlines")!;
    const center = section.querySelector<HTMLElement>(".lab-advantages-center")!;
    const backdrop = section.querySelector<HTMLElement>(".lab-advantages-center-backdrop")!;
    const story = section.querySelector<HTMLElement>(".lab-advantages-center-content")!;
    const logo = section.querySelector<HTMLElement>(".lab-advantages-center-logo-frame")!;
    const positions = Array.from(section.querySelectorAll<HTMLElement>(".lab-advantages-position"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, inView = true, headerHeight = 88, stageHeight = 700, width = 1400;
    let range = 1, startWidth = 1120, startHeight = 700, endSize = 90;
    let renderedProgress = -1, lastTime = 0, ready = false;

    const draw = (progress: number) => {
      const eased = assemblyEase(progress);
      // The intro has its own short timeline: the logo is fully visible after
      // 19% of the scroll, without changing the final eight-card composition.
      const intro = clamp(progress / .32);
      const shrink = smoothstep(clamp((intro - .2) / .8));
      const panelWidth = startWidth - shrink * (startWidth - endSize);
      const panelHeight = startHeight - shrink * (startHeight - endSize);
      const scale = 2 - eased;
      const travel = (Math.max(width, stageHeight) - 90) / 4;
      const directions = width <= 991 ? mobileDirections : desktopDirections;
      // The story keeps stable layout dimensions. Only its separate black plane
      // scales, so text wrapping, image fitting and container queries never run
      // again during scrolling. The logo is independent and stays undistorted.
      backdrop.style.transform = `scale(${panelWidth / startWidth},${panelHeight / startHeight})`;
      story.style.opacity = String(1 - smoothstep(clamp(intro / .3)));
      logo.style.opacity = String(smoothstep(clamp((intro - .2) / .4)));
      const logoScale = 1 + (1 - shrink) * (Math.min(180, startWidth * .7) / (endSize * .7) - 1);
      logo.style.transform = `translate(-50%,-50%) scale(${logoScale})`;
      lines.style.opacity = String(eased <= .95 ? .4 : .4 * (1 - (eased - .95) / .05));
      lines.style.setProperty("--line-scale", String(1 / scale));
      positions.forEach(position => {
        const [x, y] = directions[Number(position.dataset.position) - 1];
        position.style.transform = `scale(${scale}) translate(${-x * travel * (1 - eased)}px,${-y * travel * (1 - eased)}px)`;
      });
      const nextReady = eased > .95;
      if (nextReady !== ready) {
        ready = nextReady;
        grid.inert = !ready;
        section.dataset.ready = String(ready);
      }
    };
    const progressAtScroll = () => clamp((headerHeight - section.getBoundingClientRect().top) / range);
    const update = (time: number) => {
      frame = 0;
      if (!inView || document.hidden || reduced.matches) { lastTime = 0; return; }
      const target = progressAtScroll();
      const delta = target - renderedProgress;
      if (delta === 0) { lastTime = 0; return; }
      const elapsed = lastTime ? Math.min(40, time - lastTime) : 16;
      // A short, time-based catch-up softens wheel steps, without a long lag.
      // Keyboard navigation and large jumps go straight to their destination.
      const snap = renderedProgress < 0 || Math.abs(delta) > .35 || grid.contains(document.activeElement);
      renderedProgress = snap || Math.abs(delta) < .00015 ? target : renderedProgress + delta * (1 - Math.exp(-elapsed / 45));
      draw(renderedProgress);
      if (renderedProgress !== target) {
        lastTime = time;
        frame = requestAnimationFrame(update);
      } else lastTime = 0;
    };
    const schedule = () => { if (!frame && inView && !document.hidden && !reduced.matches) frame = requestAnimationFrame(update); };
    const configure = () => {
      cancelAnimationFrame(frame); frame = 0; lastTime = 0;
      headerHeight = document.querySelector<HTMLElement>(".lab-header")?.offsetHeight ?? 88;
      width = section.clientWidth;
      section.style.setProperty("--advantages-top", `${headerHeight}px`);
      section.classList.toggle("has-assembly", !reduced.matches);
      // Measure fixed sizes only on setup/resize. Stable svh avoids a moving timeline
      // when the browser toolbar hides or reappears on a phone.
      stageHeight = stage.offsetHeight;
      range = Math.max(1, section.offsetHeight - stageHeight);
      endSize = width <= 991 ? 64 : 90;
      startWidth = Math.max(endSize, Math.min(1120, width - (width <= 991 ? 32 : 64)));
      startHeight = Math.max(endSize, Math.min(740, stageHeight - (width <= 991 ? 32 : 48), width <= 991 ? startWidth * 1.18 : 740));
      center.style.setProperty("--center-content-width", `${startWidth}px`);
      center.style.setProperty("--center-content-height", `${startHeight}px`);
      if (reduced.matches) {
        positions.forEach(position => position.style.removeProperty("transform"));
        backdrop.style.removeProperty("transform");
        story.style.opacity = "1";
        logo.style.opacity = "0";
        ready = true; grid.inert = false; section.dataset.ready = "true";
        renderedProgress = -1;
      } else {
        ready = false; grid.inert = true; section.dataset.ready = "false";
        renderedProgress = progressAtScroll();
        draw(renderedProgress);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) schedule();
      else { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    }, { rootMargin: "150px 0px" });
    observer.observe(section);
    configure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", configure, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", configure);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", configure);
      document.removeEventListener("visibilitychange", schedule); reduced.removeEventListener("change", configure);
    };
  }, []);

  useEffect(() => {
    if (selected === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = oldOverflow;
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [selected]);

  const focusAdvantages = () => {
    const section = sectionRef.current;
    const stage = section?.querySelector<HTMLElement>(".lab-advantages-stage");
    if (!section || !stage) return;
    const header = document.querySelector<HTMLElement>(".lab-header")?.offsetHeight ?? 88;
    if (section.classList.contains("has-assembly")) {
      window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top + section.offsetHeight - stage.offsetHeight - header, behavior: "instant" });
      const grid = section.querySelector<HTMLElement>(".lab-advantages-grid");
      if (grid) grid.inert = false;
    }
    requestAnimationFrame(() => section.querySelector<HTMLButtonElement>(".lab-advantages-card-button")?.focus({ preventScroll: true }));
  };
  const details = selected === null ? null : items[selected];
  const fullTitle = (item: readonly string[]) => `${item[1]}${item[2]}${item[3]}`;

  return <section ref={sectionRef} id="why" className="lab-advantages" aria-labelledby="why-intro-heading" tabIndex={0} onFocus={event => {
    // Tab enters the finished mosaic directly, without adding a visible skip control.
    const returningFromCard = event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget);
    if (event.target === event.currentTarget && !returningFromCard && event.currentTarget.matches(":focus-visible")) focusAdvantages();
  }}>
    <div className="lab-advantages-stage">
      <div className="lab-advantages-gridlines" aria-hidden="true">
        {items.map((item, index) => <div className="lab-advantages-position lab-advantages-frame" data-position={index + 1} key={item[0]}><i className="line-top" /><i className="line-right" /><i className="line-bottom" /><i className="line-left" /></div>)}
      </div>
      <div className="lab-advantages-grid">
        {items.map((item, index) => <article className="lab-advantages-position lab-advantages-card" data-position={index + 1} key={item[0]}>
          <button type="button" className="lab-advantages-card-button" aria-haspopup="dialog" aria-label={`${fullTitle(item)} — ${ru ? "подробнее" : "learn more"}`} onClick={event => { openerRef.current = event.currentTarget; setSelected(index); }}>
            <Image className="lab-advantages-hover-photo" src={hoverPhotos[index]} alt="" fill sizes="(max-width: 991px) 55vw, 35vw" />
            <span className="lab-advantages-card-copy">
              <span className="lab-advantages-label">
                {item[1] && <span>{item[1]}</span>}
                <strong className={item[2].length > 12 ? "is-long" : undefined}>{item[2]}</strong>
                {item[3] && <span>{item[3]}</span>}
              </span>
              <span className="lab-advantages-description">{item[4]}</span>
            </span>
          </button>
        </article>)}
      </div>
      <div className="lab-advantages-center">
        <div className="lab-advantages-center-backdrop" aria-hidden="true" />
        <div className="lab-advantages-center-content" aria-label={title}>
          <div className="lab-advantages-center-title">
            <span className="lab-advantages-kicker">{kicker}</span>
            <h2 id="why-intro-heading">{title}<span>{ru ? "8 преимуществ" : "8 advantages"}</span></h2>
          </div>
          <div className="lab-advantages-team-photo">
            <div className="lab-advantages-team-crop"><Image src="/media/team-group.webp" alt={ru ? "Команда Space Buro" : "The Space Buro team"} width={1920} height={1280} sizes="(max-width: 991px) 90vw, 1056px" /></div>
          </div>
          <div className="lab-advantages-trust"><span>{ru ? "Единая смета" : "One estimate"}</span><span>{ru ? "Вся команда на связи" : "One connected team"}</span><span>{ru ? "Гарантия 3 года" : "3-year warranty"}</span></div>
        </div>
        <div className="lab-advantages-center-logo-frame"><Image className="lab-advantages-center-logo" src="/space-buro-logo.png" alt="Space Buro" width={416} height={260} /></div>
      </div>
    </div>
    <dialog ref={dialogRef} className="lab-advantages-detail" aria-labelledby="why-benefit-title" onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) event.currentTarget.close(); } }}>
      <button type="button" className="lab-advantages-detail-close" aria-label={ru ? "Закрыть" : "Close"} onClick={() => dialogRef.current?.close()}>×</button>
      <p className="eyebrow">{kicker} / {details?.[0]}</p>
      <h3 id="why-benefit-title">{details ? fullTitle(details) : ""}</h3>
      <p>{details?.[4]}</p>
      <a className="button" href="#calculator" onClick={() => dialogRef.current?.close()}>{ru ? "Обсудим ваш проект" : "Let’s discuss your project"} <ResponsiveArrow /></a>
    </dialog>
  </section>;
}
