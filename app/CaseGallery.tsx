"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useMemo, useRef, useState, type TouchEvent } from "react";
import type { Lang } from "./data";
import { useDialog } from "./useInteraction";
import "./case-gallery.css";

export type CasePhoto = {
  src: string;
  width: number;
  height: number;
  alt: { ru: string; en: string };
  group: string;
};

type CaseGalleryProps = {
  photos: CasePhoto[];
  lang: Lang;
  projectTitle: string;
  groups: Array<{ id: string; label: { ru: string; en: string } }>;
};

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={direction === "left" ? "M20 12H4m6-6-6 6 6 6" : "M4 12h16m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function CaseGallery({ photos, lang, projectTitle, groups }: CaseGalleryProps) {
  const ru = lang === "ru";
  const [filter, setFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const ignoreClickUntil = useRef(0);
  const filteredPhotos = useMemo(() => filter === null ? photos : photos.filter(photo => photo.group === filter), [photos, filter]);
  const availableGroups = useMemo(() => groups.filter(group => photos.some(photo => photo.group === group.id)), [groups, photos]);
  const visiblePhotos = expanded ? filteredPhotos : filteredPhotos.slice(0, 6);
  const currentIndex = filteredPhotos.findIndex(photo => photo.src === activePhoto);
  const currentPhoto = filteredPhotos[currentIndex];
  const close = useCallback(() => {
    setActivePhoto(null);
    touchStart.current = null;
    ignoreClickUntil.current = 0;
  }, []);
  const dialogRef = useDialog(Boolean(currentPhoto), close);

  const move = useCallback((direction: number) => {
    setActivePhoto(current => {
      if (!current || filteredPhotos.length < 2) return current;
      const index = filteredPhotos.findIndex(photo => photo.src === current);
      return filteredPhotos[(index + direction + filteredPhotos.length) % filteredPhotos.length].src;
    });
  }, [filteredPhotos]);

  function changeFilter(next: string | null) {
    setFilter(next);
    setExpanded(false);
  }

  function startSwipe(event: TouchEvent<HTMLElement>) {
    const touch = event.touches[0];
    const zoomed = (window.visualViewport?.scale ?? 1) > 1.01;
    touchStart.current = !zoomed && event.touches.length === 1 && !(event.target as Element).closest("button, a")
      ? { x: touch.clientX, y: touch.clientY }
      : null;
  }

  function finishSwipe(event: TouchEvent<HTMLElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch || event.touches.length || (window.visualViewport?.scale ?? 1) > 1.01) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.3 || filteredPhotos.length < 2) return;
    // A touch swipe can produce a delayed click at its final screen position.
    // Ignore that click without cancelling native touch or pinch gestures.
    ignoreClickUntil.current = Date.now() + 500;
    move(dx < 0 ? 1 : -1);
  }

  if (!photos.length) return null;

  return <>
    <section id="case-gallery" className="case-gallery" aria-labelledby="case-gallery-title">
      <header className="case-gallery-heading" data-reveal>
        <div>
          <p className="case-gallery-eyebrow">02 / {ru ? "Галерея" : "Gallery"} · {photos.length}</p>
          <h2 id="case-gallery-title">{ru ? "Пространство в деталях" : "The spaces in detail"}</h2>
        </div>
        <p className="case-gallery-hint">{ru ? "Нажмите на фотографию, чтобы рассмотреть детали." : "Open a photograph to explore the details."}</p>
      </header>

      {availableGroups.length > 1 && <div className="case-gallery-filters" role="group" aria-label={ru ? "Разделы галереи" : "Gallery sections"}>
        <button type="button" aria-pressed={filter === null} onClick={() => changeFilter(null)}>{ru ? "Все фотографии" : "All photographs"}<span>{photos.length}</span></button>
        {availableGroups.map(group => <button key={group.id} type="button" aria-pressed={filter === group.id} onClick={() => changeFilter(group.id)}>{group.label[lang]}<span>{photos.filter(photo => photo.group === group.id).length}</span></button>)}
      </div>}

      <div className="case-gallery-grid" id="case-gallery-photos">
        {visiblePhotos.map((photo, index) => {
          return <figure className="case-gallery-photo" key={photo.src}>
            <button type="button" className="case-gallery-open" aria-haspopup="dialog" aria-label={`${ru ? "Открыть фото" : "Open photo"} ${index + 1}: ${photo.alt[lang]}`} onClick={() => setActivePhoto(photo.src)}>
              <Image src={photo.src} alt={photo.alt[lang]} width={photo.width} height={photo.height} sizes="(max-width: 700px) calc(100vw - 40px), 44vw" loading="lazy" />
              <span className="case-gallery-expand" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
            </button>
            <figcaption><span>{photo.alt[lang]}</span><small>{String(index + 1).padStart(2, "0")}</small></figcaption>
          </figure>;
        })}
      </div>

      {filteredPhotos.length > 6 && <div className="case-gallery-more">
        <p aria-live="polite" aria-atomic="true">{ru ? `Показано ${visiblePhotos.length} из ${filteredPhotos.length}` : `${visiblePhotos.length} of ${filteredPhotos.length} photographs`}</p>
        <button type="button" aria-expanded={expanded} aria-controls="case-gallery-photos" onClick={() => setExpanded(value => !value)}>
          {expanded ? (ru ? "Показать меньше" : "Show fewer") : (ru ? `Показать все ${filteredPhotos.length} фото` : `Show all ${filteredPhotos.length} photos`)}
          <span aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>
      </div>}
    </section>

    {currentPhoto && createPortal(<section ref={dialogRef} className="case-lightbox" role="dialog" aria-modal="true" aria-label={`${projectTitle} — ${ru ? "фотографии проекта" : "project photographs"}`} onKeyDown={event => {
      if (event.altKey || event.ctrlKey || event.metaKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      move(event.key === "ArrowRight" ? 1 : -1);
    }} onTouchStart={startSwipe} onTouchMove={event => {
      if (event.touches.length > 1) touchStart.current = null;
    }} onTouchEnd={finishSwipe} onTouchCancel={() => { touchStart.current = null; }} onClickCapture={event => {
      if (event.detail > 0 && Date.now() < ignoreClickUntil.current) {
        event.preventDefault();
        event.stopPropagation();
      }
    }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="case-lightbox-header">
        <p>{projectTitle}</p>
        <button className="case-lightbox-close" type="button" onClick={close} aria-label={ru ? "Закрыть фотографию" : "Close photograph"}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
      </div>
      <div className="case-lightbox-image" onClick={event => { if (event.target === event.currentTarget) close(); }}>
        <Image src={currentPhoto.src} alt={currentPhoto.alt[lang]} width={currentPhoto.width} height={currentPhoto.height} sizes="100vw" loading="eager" />
      </div>
      {filteredPhotos.length > 1 && <>
        <button className="case-lightbox-previous" type="button" onClick={() => move(-1)} aria-label={ru ? "Предыдущее фото" : "Previous photograph"}><Arrow direction="left" /></button>
        <button className="case-lightbox-next" type="button" onClick={() => move(1)} aria-label={ru ? "Следующее фото" : "Next photograph"}><Arrow /></button>
      </>}
      {/* A div deliberately avoids the site's generic footer layout rules. */}
      <div className="case-lightbox-caption" aria-live="polite" aria-atomic="true">
        <p>{currentPhoto.alt[lang]}</p><span>{String(currentIndex + 1).padStart(2, "0")} / {String(filteredPhotos.length).padStart(2, "0")}</span>
      </div>
    </section>, document.body)}
  </>;
}
