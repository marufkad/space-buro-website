"use client";

import Image from "next/image";
import { type FocusEvent, type KeyboardEvent, type TouchEvent, useEffect, useState } from "react";
import { stages, type Lang } from "./data";
import { useVisible, useReducedMotion } from "./useInteraction";

type ProcessShowcaseProps = {
  lang: Lang;
  stageLabel: string;
  resultLabel: string;
};

export default function ProcessShowcase({ lang, stageLabel, resultLabel }: ProcessShowcaseProps) {
  const [activeStage, setActiveStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const stage = stages[activeStage];
  const [processRef, processVisible] = useVisible<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [manualPause, setManualPause] = useState(false);

  useEffect(() => {
    if (paused || manualPause || reduced || !processVisible) return;
    const timer = window.setTimeout(
      () => { if (!document.hidden) setActiveStage((current) => (current + 1) % stages.length); },
      4000,
    );
    return () => window.clearTimeout(timer);
  }, [activeStage, paused, manualPause, reduced, processVisible]);

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    setTouchStart(event.changedTouches[0]?.clientX ?? null);
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    if (touchStart === null) return;
    const distance = (event.changedTouches[0]?.clientX ?? touchStart) - touchStart;
    if (Math.abs(distance) > 48) {
      setActiveStage((current) => (
        distance < 0
          ? (current + 1) % stages.length
          : (current - 1 + stages.length) % stages.length
      ));
    }
    setTouchStart(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? stages.length - 1
        : event.key === "ArrowRight"
          ? (activeStage + 1) % stages.length
          : (activeStage - 1 + stages.length) % stages.length;
    setActiveStage(next);
    event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='tab']")[next]?.focus();
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).matches(":focus-visible")) setPaused(true);
  }

  return (
    <div
      ref={processRef}
      className="process-showcase"
      data-paused={paused || manualPause || !processVisible || reduced}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      <button className="process-pause" type="button" aria-pressed={manualPause} onClick={()=>setManualPause(!manualPause)}>{manualPause?(lang==="ru"?"Продолжить показ":"Resume slideshow"):(lang==="ru"?"Приостановить показ":"Pause slideshow")}</button>
      <div className="stage-buttons" data-reveal role="tablist" aria-label={stageLabel} onKeyDown={handleKeyDown}>
        {stages.map((item, index) => (
          <button
            key={item.number}
            type="button"
            role="tab"
            aria-selected={activeStage === index}
            aria-controls="active-stage-panel"
            tabIndex={activeStage === index ? 0 : -1}
            className={activeStage === index ? "active" : ""}
            onClick={() => setActiveStage(index)}
            onFocus={() => setActiveStage(index)}
          >
            <span>{item.number}</span>
            <strong>{item.title[lang]}</strong>
            {activeStage === index && <i className="stage-progress" aria-hidden="true" />}
          </button>
        ))}
      </div>

      <article
        id="active-stage-panel"
        className="stage-detail"
        key={`${lang}-${stage.number}`}
        role="tabpanel"
        aria-label={`${stageLabel} ${stage.number} — ${stage.title[lang]}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="stage-detail-image">
          <Image
            src={stage.image}
            alt={`${stageLabel} ${stage.number} — ${stage.title[lang]}`}
            fill
            sizes="(max-width: 900px) 100vw, 62vw"

          />
          <span>{lang === "ru" ? "Иллюстрация этапа" : "Stage illustration"} · {stage.number} / {String(stages.length).padStart(2, "0")}</span>
        </div>
        <div className="stage-detail-copy">
          <p className="eyebrow">{stageLabel} {stage.number}</p>
          <h3>{stage.title[lang]}</h3>
          <p>{stage.text[lang]}</p>
          <div className="stage-result">
            <span>{resultLabel}</span>
            <strong>{stage.result[lang]}</strong>
          </div>
        </div>
      </article>
    </div>
  );
}
