"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projectLocations, type Lang, type ProjectLocation } from "./data";
import { createLiquidTrail, type LiquidController } from "./labLiquid";
import ResponsiveArrow from "./ResponsiveArrow";
import "./lab-intro.css";

const publishedProjects = projectLocations.filter(project => project.published && project.status !== "service" && project.images.length > 0);
const imageRoot = "/media/projects/";
// Visually reviewed, professionally photographed completed interiors only.
// Keep this selection explicit so an unfinished site's cover cannot enter the reveal.
const curatedPhotos = [
  { id: "al-furjan-villa", photo: "al-furjan-villa/gallery/07.webp", width: 1920, height: 1280 },
  { id: "fujairah-trade-centre", photo: "fujairah-office/gallery/01-dsc-9137.webp", width: 2000, height: 1333 },
  { id: "office-vostok-real-estate", photo: "office-vostok-real-estate/gallery/02.webp", width: 1920, height: 1280 },
  { id: "al-furjan-villa", photo: "al-furjan-villa/gallery/03.webp", width: 1920, height: 1280 },
  { id: "fujairah-trade-centre", photo: "fujairah-office/gallery/06-dsc-9296.webp", width: 2000, height: 1333 },
  { id: "al-furjan-villa", photo: "al-furjan-villa/gallery/01.webp", width: 1920, height: 1268 },
].map(photo => ({ ...photo, project: publishedProjects.find(project => project.id === photo.id)! }));
const featuredPhotos = curatedPhotos.slice(0, 3);
// Three unequal bands preserve every photograph's native ratio. The same gap
// separates each tile and band, while their staggered starting positions create
// a free-flowing collage. Each repeat uses identical dimensions for seamless motion.
const mosaicPhotos = [
  { id: "al-furjan-villa", photo: "al-furjan-villa/gallery/01.webp", width: 1920, height: 1268 },
  { id: "fujairah-trade-centre", photo: "fujairah-office/gallery/01-dsc-9137.webp", width: 2000, height: 1333 },
  { id: "office-vostok-real-estate", photo: "office-vostok-real-estate/gallery/01.webp", width: 1920, height: 1280 },
  { id: "seventh-heaven-al-barari", photo: "seventh-heaven/gallery/02-finished.webp", width: 1500, height: 2000 },
  { id: "al-furjan-villa", photo: "al-furjan-villa/gallery/07.webp", width: 1920, height: 1280 },
  { id: "fujairah-trade-centre", photo: "fujairah-office/gallery/06-dsc-9296.webp", width: 2000, height: 1333 },
  { id: "al-furjan-villa", photo: "al-furjan-villa/gallery/15.webp", width: 1920, height: 1280 },
  { id: "office-vostok-real-estate", photo: "office-vostok-real-estate/gallery/02.webp", width: 1920, height: 1280 },
  { id: "al-furjan-villa", photo: "al-furjan-villa/gallery/03.webp", width: 1920, height: 1280 },
  { id: "fujairah-trade-centre", photo: "fujairah-office/gallery/09-dsc-9391.webp", width: 2000, height: 1333 },
  { id: "seventh-heaven-al-barari", photo: "seventh-heaven/gallery/07-finished.webp", width: 1500, height: 2000 },
  { id: "al-furjan-villa", photo: "al-furjan-villa/gallery/17.webp", width: 1920, height: 1280 },
];
const mosaicRows = [[0, 3, 6, 1, 8, 10], [4, 7, 9, 10, 2, 5], [8, 1, 11, 3, 5, 7]].map(row => row.map(index => mosaicPhotos[index]));

type Props = { lang: Lang; onOpenProject: (project: ProjectLocation) => void };

export default function LabIntro({ lang, onOpenProject }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredHovered, setFeaturedHovered] = useState(false);
  const [featuredFocused, setFeaturedFocused] = useState(false);
  const [featuredVisible, setFeaturedVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [effectEnabled, setEffectEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const openingRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const mosaicSectionRef = useRef<HTMLElement>(null);
  const touchPointRef = useRef<{ x: number; y: number } | null>(null);
  const touchCountRef = useRef(0);
  const featuredRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liquidRef = useRef<LiquidController | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const mosaicControlRef = useRef<{ shift: (direction: number) => void; anchor: (tile: HTMLButtonElement) => void; releaseAnchor: () => void } | null>(null);
  const [activeMosaic, setActiveMosaic] = useState<string | null>(null);
  const [mosaicCopies, setMosaicCopies] = useState(5);
  const activePhoto = curatedPhotos[activeIndex];
  const activeProject = activePhoto.project;
  const backgroundSource = `${imageRoot}${activePhoto.photo}`;
  const liquidSourceRef = useRef(backgroundSource);
  const liquidEnabledRef = useRef(effectEnabled);
  const photoModeRef = useRef(false);
  const featuredProject = featuredPhotos[featuredIndex].project;
  const ru = lang === "ru";

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = matchMedia("(pointer: coarse)");
    const update = () => { setReducedMotion(reduced.matches); setCoarsePointer(coarse.matches); setMotionReady(true); };
    const visibility = () => setPageVisible(!document.hidden);
    update(); visibility();
    reduced.addEventListener("change", update); coarse.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      reduced.removeEventListener("change", update); coarse.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    const card = featuredRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(entries => setFeaturedVisible(entries[0].isIntersecting), { threshold: .15 });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (featuredHovered || featuredFocused || reducedMotion || !featuredVisible || !pageVisible) return;
    const timer = window.setInterval(() => setFeaturedIndex(index => (index + 1) % featuredPhotos.length), 3000);
    return () => window.clearInterval(timer);
  }, [featuredHovered, featuredFocused, reducedMotion, featuredVisible, pageVisible]);

  useEffect(() => {
    liquidSourceRef.current = backgroundSource;
    liquidRef.current?.setImage(backgroundSource);
  }, [backgroundSource]);
  useEffect(() => {
    liquidEnabledRef.current = effectEnabled;
    photoModeRef.current = !effectEnabled || reducedMotion;
    liquidRef.current?.setEnabled(effectEnabled && !reducedMotion);
    const header = document.querySelector<HTMLElement>(".lab-header, .site-header");
    header?.classList.toggle("has-intro-photo", photoModeRef.current && header.classList.contains("has-intro-reveal"));
  }, [effectEnabled, reducedMotion]);

  useEffect(() => {
    // Position the photograph in every mode, but allocate the renderer only when motion is allowed.
    if (!motionReady) return;
    const opening = openingRef.current, surface = surfaceRef.current, canvas = canvasRef.current;
    const mosaic = mosaicSectionRef.current;
    if (!opening || !surface || !canvas || !mosaic) return;
    const liquid = reducedMotion ? null : createLiquidTrail(surface, canvas); liquidRef.current = liquid;
    liquid?.setImage(liquidSourceRef.current);
    liquid?.setEnabled(liquidEnabledRef.current);
    surface.classList.toggle("has-liquid", liquid !== null);
    const header = document.querySelector<HTMLElement>(".lab-header, .site-header");
    let disposed = false, frame = 0, lastWidth = 0, lastHeight = 0, lastOpeningTop = Infinity, nearView = true, wasVisible = true;
    let bounds = { left: 0, top: 0, width: 0, height: 0, bottom: 0 };
    let mousePoint: { x: number; y: number } | null = null;
    const fit = () => {
      frame = 0;
      if (disposed) return;
      const headerHeight = header?.offsetHeight ?? 88;
      const height = opening.offsetHeight;
      const openingTop = Math.min(0, window.innerHeight - height);
      // Read geometry together before changing styles; ordinary scrolling must not force a second layout.
      const box = opening.getBoundingClientRect();
      const mosaicTop = mosaic.getBoundingClientRect().top;
      if (openingTop !== lastOpeningTop) {
        opening.style.setProperty("--lab-opening-top", `${openingTop}px`);
        lastOpeningTop = openingTop;
        // A viewport/font resize can change the sticky offset. Measure its settled position next frame.
        if (!document.hidden) frame = requestAnimationFrame(fit);
      }
      const top = box.top - headerHeight;
      const surfaceHeight = height + headerHeight;
      const bottom = Math.min(box.bottom, mosaicTop, window.innerHeight);
      const visibleNow = bottom > Math.max(0, top) && box.top < innerHeight;
      bounds = { left: box.left, top, width: box.width, height: surfaceHeight, bottom };
      surface.style.left = `${box.left}px`;
      surface.style.top = `${top}px`;
      surface.style.width = `${box.width}px`;
      surface.style.height = `${surfaceHeight}px`;
      surface.style.clipPath = `inset(${Math.max(0, -top)}px 0 ${Math.max(0, top + surfaceHeight - bottom)}px 0)`;
      surface.style.visibility = visibleNow ? "visible" : "hidden";
      const behindHeader = visibleNow && top <= 0 && bottom >= headerHeight;
      header?.classList.toggle("has-intro-reveal", behindHeader);
      header?.classList.toggle("has-intro-photo", behindHeader && photoModeRef.current);
      if (box.width !== lastWidth || surfaceHeight !== lastHeight) {
        lastWidth = box.width; lastHeight = surfaceHeight; liquid?.resize();
      }
      liquid?.setVisible(visibleNow && !document.hidden);
      // Scrolling can move the reveal out from under a stationary pointer.
      if (mousePoint) pulseAt(mousePoint.x, mousePoint.y, "mouse");
      if (visibleNow !== wasVisible) { wasVisible = visibleNow; setVisible(visibleNow); }
    };
    const schedule = () => { if (!frame && nearView && !document.hidden) frame = requestAnimationFrame(fit); };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      nearView = entry.isIntersecting;
      if (nearView) schedule();
      else {
        cancelAnimationFrame(frame); frame = 0;
        surface.style.visibility = "hidden";
        header?.classList.remove("has-intro-reveal", "has-intro-photo");
        liquid?.setVisible(false);
        mousePoint = null; touchPointRef.current = null; touchCountRef.current = 0;
        if (wasVisible) { wasVisible = false; setVisible(false); }
      }
    }, { rootMargin: "120px 0px" });
    visibilityObserver.observe(opening);
    const pulseAt = (x: number, y: number, input: "mouse" | "touch") => {
      if (x < bounds.left || x > bounds.left + bounds.width || y < Math.max(0, bounds.top) || y > bounds.bottom) {
        if (input === "mouse") mousePoint = null;
        liquid?.release(); return;
      }
      liquid?.pulse(x - bounds.left, y - bounds.top, input === "touch" ? 1.2 : 1, input);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return; // Touch events continue during native vertical scrolling.
      if (event.pointerType !== "mouse" && !event.buttons) return;
      mousePoint = event.pointerType === "mouse" ? { x: event.clientX, y: event.clientY } : null;
      pulseAt(event.clientX, event.clientY, event.pointerType === "mouse" ? "mouse" : "touch");
    };
    const touch = (event: TouchEvent) => {
      mousePoint = null;
      touchCountRef.current = event.touches.length;
      // Never turn a two-finger zoom into an arbitrary reveal at the first finger.
      if (event.touches.length !== 1) { touchPointRef.current = null; liquid?.release(); return; }
      const point = event.touches[0];
      if (!point) return;
      touchPointRef.current = { x: point.clientX, y: point.clientY };
      pulseAt(point.clientX, point.clientY, "touch");
    };
    const releaseContact = () => { mousePoint = null; touchPointRef.current = null; touchCountRef.current = 0; liquid?.release(); };
    const pointerEnd = (event: PointerEvent) => { if (event.pointerType !== "mouse") releaseContact(); };
    // Native scrolling cancels PointerEvents while TouchEvents remain active.
    const pointerCancel = (event: PointerEvent) => { if (event.pointerType !== "touch") releaseContact(); };
    const touchEnd = (event: TouchEvent) => {
      touchCountRef.current = event.touches.length;
      if (event.touches.length === 1) touch(event);
      else { touchPointRef.current = null; liquid?.release(); }
    };
    const pointerOut = (event: PointerEvent) => { if (event.pointerType !== "touch" && !event.relatedTarget) releaseContact(); };
    const visibility = () => { if (document.hidden) releaseContact(); else schedule(); };
    const sizeObserver = new ResizeObserver(schedule); sizeObserver.observe(opening);
    if (document.querySelector(".lab-header")) sizeObserver.observe(document.querySelector(".lab-header")!);
    // Capture reaches the narrow header too; the drawing layer never intercepts clicks or swipes.
    window.addEventListener("pointermove", move, { passive: true, capture: true });
    window.addEventListener("pointerdown", move, { passive: true, capture: true });
    window.addEventListener("pointerup", pointerEnd, { passive: true });
    window.addEventListener("pointercancel", pointerCancel, { passive: true });
    window.addEventListener("pointerout", pointerOut, { passive: true });
    window.addEventListener("blur", releaseContact);
    window.addEventListener("touchstart", touch, { passive: true, capture: true });
    window.addEventListener("touchmove", touch, { passive: true, capture: true });
    window.addEventListener("touchend", touchEnd, { passive: true });
    window.addEventListener("touchcancel", releaseContact, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    document.fonts.ready.then(() => { if (!disposed) schedule(); });
    fit();
    return () => {
      disposed = true; cancelAnimationFrame(frame); sizeObserver.disconnect(); visibilityObserver.disconnect(); liquid?.destroy(); liquidRef.current = null;
      surface.classList.remove("has-liquid");
      header?.classList.remove("has-intro-reveal", "has-intro-photo");
      window.removeEventListener("pointermove", move, true); window.removeEventListener("pointerdown", move, true);
      window.removeEventListener("pointerup", pointerEnd); window.removeEventListener("pointercancel", pointerCancel);
      window.removeEventListener("pointerout", pointerOut); window.removeEventListener("blur", releaseContact);
      window.removeEventListener("touchstart", touch, true); window.removeEventListener("touchmove", touch, true);
      window.removeEventListener("touchend", touchEnd); window.removeEventListener("touchcancel", releaseContact);
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibility);
      touchPointRef.current = null; touchCountRef.current = 0;
    };
  }, [motionReady, reducedMotion]);

  useEffect(() => { liquidRef.current?.setVisible(visible && pageVisible); }, [visible, pageVisible]);
  useEffect(() => {
    if (paused || reducedMotion || !visible || !pageVisible) return;
    const interval = window.setInterval(() => setActiveIndex(index => (index + 1) % curatedPhotos.length), 5000);
    return () => window.clearInterval(interval);
  }, [paused, reducedMotion, visible, pageVisible]);

  useEffect(() => {
    if (!coarsePointer || reducedMotion || !effectEnabled || !visible || !pageVisible) return;
    let frame = 0, previous = window.scrollY;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const distance = Math.abs(window.scrollY - previous); previous = window.scrollY;
        if (touchCountRef.current > 1) return;
        const surface = surfaceRef.current?.getBoundingClientRect();
        const statement = statementRef.current?.getBoundingClientRect();
        const mosaic = mosaicSectionRef.current?.getBoundingClientRect();
        if (!surface || !statement || !mosaic || distance < 1) return;
        const bottom = Math.min(surface.bottom, mosaic.top, innerHeight);
        if (bottom <= Math.max(0, surface.top)) return;
        const progress = Math.max(0, Math.min(1, (innerHeight - statement.top) / (innerHeight + statement.height)));
        const touch = touchPointRef.current;
        const x = touch?.x ?? surface.left + surface.width * (.2 + .6 * progress);
        const y = Math.max(Math.max(0, surface.top) + 8, Math.min(bottom - 8, touch?.y ?? innerHeight * .58));
        liquidRef.current?.pulse(x - surface.left, y - surface.top, 1.2, "touch");
      });
    };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.removeEventListener("scroll", scroll); cancelAnimationFrame(frame); };
  }, [coarsePointer, reducedMotion, effectEnabled, visible, pageVisible]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const rows = Array.from(viewport.querySelectorAll<HTMLElement>(".lab-mosaic-row")).map(element => ({
      element, period: 0, position: 0, initialized: false,
      anchor: null as { key: string; screenX: number; until: number } | null,
    }));
    let frame = 0, lastTime = 0, resumeTimer = 0, suppressUntil = 0, resumeAt = 0, velocity = 0;
    let hovered = false, focused = false, inView = false;
    let drag: { x: number; y: number; last: number; time: number; moved: boolean; id: number } | null = null;
    let tween: { distance: number; start: number; previous: number } | null = null;
    const normalize = (row: typeof rows[number]) => {
      if (row.period <= 0) return;
      const relative = row.position - row.period * 2;
      if (relative < 0 || relative >= row.period) row.position -= Math.floor(relative / row.period) * row.period;
      row.element.scrollLeft = row.position;
    };
    const advance = (distance: number) => {
      for (const row of rows) { row.position += distance; normalize(row); }
    };
    const autoAllowed = (now: number) => !motion.matches && !hovered && !focused && !drag && now >= resumeAt;
    const requestTick = () => {
      if (!frame && inView && !document.hidden) { lastTime = performance.now(); frame = requestAnimationFrame(tick); }
    };
    const hold = (milliseconds = 2600) => {
      resumeAt = performance.now() + milliseconds;
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(requestTick, milliseconds + 20);
    };
    function tick(now: number) {
      frame = 0;
      if (!inView || document.hidden) return;
      const elapsed = Math.min(50, now - lastTime) / 1000; lastTime = now;
      if (tween) {
        const progress = Math.min(1, (now - tween.start) / 650);
        const next = tween.distance * (1 - Math.pow(1 - progress, 3));
        advance(next - tween.previous); tween.previous = next;
        if (progress === 1) tween = null;
      } else if (!drag && Math.abs(velocity) > 4) {
        advance(velocity * elapsed); velocity *= Math.exp(-elapsed * 7);
      } else if (autoAllowed(now)) {
        // Increasing scrollLeft moves photographs from right to left.
        advance(elapsed * 18);
      }
      if (tween || (!drag && Math.abs(velocity) > 4) || autoAllowed(now)) frame = requestAnimationFrame(tick);
    }
    const measure = () => {
      // Read all three rows before writing scrollLeft. Hover-size transitions
      // trigger this observer every frame, so interleaved reads/writes are costly.
      const now = performance.now();
      const viewportWidth = viewport.clientWidth;
      const measurements = rows.map(row => {
        const copies = row.element.querySelectorAll<HTMLElement>(".lab-mosaic-collage");
        if (copies.length < 2) return null;
        const next = copies[1].getBoundingClientRect().left - copies[0].getBoundingClientRect().left;
        if (next <= 0) return null;
        let anchorDelta: number | null = null;
        if (row.initialized && row.anchor && now < row.anchor.until) {
          const rowLeft = row.element.getBoundingClientRect().left;
          const candidates = Array.from(row.element.querySelectorAll<HTMLElement>(`[data-tile-key="${row.anchor.key}"]`));
          const centres = candidates.map(tile => {
            const box = tile.getBoundingClientRect();
            return box.left + box.width / 2 - rowLeft;
          });
          const closest = centres.reduce((best, centre) => Math.abs(centre - row.anchor!.screenX) < Math.abs(best - row.anchor!.screenX) ? centre : best, Infinity);
          if (Number.isFinite(closest)) anchorDelta = closest - row.anchor.screenX;
        }
        return { next, anchorDelta };
      });
      rows.forEach((row, index) => {
        const measurement = measurements[index];
        if (!measurement) return;
        const { next, anchorDelta } = measurement;
        if (!row.initialized) {
          row.position = next * 2 + next * [0.13, 0.43, 0.7][index];
          row.initialized = true;
        } else if (anchorDelta !== null) {
          // Keep the chosen photo at the same screen position as neighbours shrink.
          row.position += anchorDelta;
        } else if (Math.abs(next - row.period) > .01) {
          row.position += (next - row.period) * 2;
        }
        row.period = next; normalize(row);
      });
      const shortest = Math.min(...rows.map(row => row.period).filter(period => period > 0));
      if (Number.isFinite(shortest)) {
        const copies = Math.max(5, Math.ceil(viewportWidth / shortest) + 4);
        setMosaicCopies(previous => previous === copies ? previous : copies);
      }
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      velocity = 0; tween = null; hold();
      rows.forEach(row => { row.anchor = null; });
      drag = { x: event.clientX, y: event.clientY, last: event.clientX, time: performance.now(), moved: false, id: event.pointerId };
    };
    const move = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!drag.moved && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) {
        drag.moved = true; viewport.setPointerCapture(event.pointerId); viewport.classList.add("is-dragging");
      }
      if (drag.moved) {
        event.preventDefault();
        const now = performance.now(), distance = (drag.last - event.clientX) * 1.1;
        advance(distance); velocity = Math.max(-1200, Math.min(1200, distance / Math.max(.016, (now - drag.time) / 1000)));
        drag.last = event.clientX; drag.time = now;
      }
    };
    const end = () => {
      if (!drag) return;
      if (drag.moved) suppressUntil = performance.now() + 350;
      if (motion.matches || performance.now() - drag.time > 100) velocity = 0;
      if (viewport.hasPointerCapture(drag.id)) viewport.releasePointerCapture(drag.id);
      drag = null; viewport.classList.remove("is-dragging"); hold(); requestTick();
    };
    const cancel = () => { end(); velocity = 0; };
    const enter = (event: PointerEvent) => { if (event.pointerType === "mouse") { hovered = true; velocity = 0; } };
    const leave = (event: PointerEvent) => { if (event.pointerType === "mouse") { hovered = false; hold(350); requestTick(); } };
    const focusIn = (event: FocusEvent) => {
      focused = true; velocity = 0;
      // Browsers may scroll a focused tile into view; retain that new position.
      const target = event.target as HTMLElement;
      const row = rows.find(item => item.element.contains(target));
      if (row) { row.position = row.element.scrollLeft; normalize(row); }
    };
    const focusOut = (event: FocusEvent) => {
      if (!viewport.contains(event.relatedTarget as Node | null)) { focused = false; hold(800); requestTick(); }
    };
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault(); velocity = 0; tween = null; hold();
      rows.forEach(row => { row.anchor = null; });
      advance(event.deltaX * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1));
    };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else requestTick(); };
    const motionChange = () => { if (motion.matches) { velocity = 0; tween = null; } requestTick(); };
    const preventDrag = (event: Event) => event.preventDefault();
    const click = (event: MouseEvent) => { if (performance.now() < suppressUntil) { event.preventDefault(); event.stopPropagation(); } };
    const sizeObserver = new ResizeObserver(measure);
    sizeObserver.observe(viewport);
    rows.forEach(row => { const copy = row.element.querySelector(".lab-mosaic-collage"); if (copy) sizeObserver.observe(copy); });
    const visibilityObserver = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (inView) requestTick(); else { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: .04 });
    visibilityObserver.observe(viewport); measure();
    mosaicControlRef.current = {
      shift(direction) {
        const distance = direction * viewport.clientWidth * .65;
        rows.forEach(row => { row.anchor = null; });
        velocity = 0; hold();
        if (motion.matches) advance(distance);
        else { tween = { distance, start: performance.now(), previous: 0 }; requestTick(); }
      },
      anchor(tile) {
        for (const row of rows) {
          if (row.element.contains(tile)) {
            const box = tile.getBoundingClientRect();
            row.anchor = { key: tile.dataset.tileKey!, screenX: box.left + box.width / 2 - row.element.getBoundingClientRect().left, until: Infinity };
          } else row.anchor = null;
        }
      },
      releaseAnchor() {
        for (const row of rows) if (row.anchor) row.anchor.until = performance.now() + 750;
      },
    };
    viewport.addEventListener("pointerdown", down); viewport.addEventListener("pointermove", move);
    viewport.addEventListener("pointerup", end); viewport.addEventListener("pointercancel", cancel);
    viewport.addEventListener("pointerenter", enter); viewport.addEventListener("pointerleave", leave);
    viewport.addEventListener("focusin", focusIn); viewport.addEventListener("focusout", focusOut);
    viewport.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("pointerup", end); viewport.addEventListener("dragstart", preventDrag); viewport.addEventListener("click", click, true);
    document.addEventListener("visibilitychange", visibility); motion.addEventListener("change", motionChange);
    return () => {
      cancelAnimationFrame(frame); window.clearTimeout(resumeTimer); sizeObserver.disconnect(); visibilityObserver.disconnect(); mosaicControlRef.current = null;
      viewport.removeEventListener("pointerdown", down); viewport.removeEventListener("pointermove", move);
      viewport.removeEventListener("pointerup", end); viewport.removeEventListener("pointercancel", cancel);
      viewport.removeEventListener("pointerenter", enter); viewport.removeEventListener("pointerleave", leave);
      viewport.removeEventListener("focusin", focusIn); viewport.removeEventListener("focusout", focusOut);
      viewport.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerup", end); viewport.removeEventListener("dragstart", preventDrag); viewport.removeEventListener("click", click, true);
      document.removeEventListener("visibilitychange", visibility); motion.removeEventListener("change", motionChange);
    };
  }, []);

  const shiftWall = (direction: number) => mosaicControlRef.current?.shift(direction);
  return <div className={`lab-intro${!effectEnabled || reducedMotion ? " is-photo-visible" : ""}`}>
    <div className="lab-liquid-surface" ref={surfaceRef} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lab-liquid-background" src={backgroundSource} alt="" decoding="async" />
      <canvas className="lab-liquid-canvas" ref={canvasRef} />
    </div>
    <div className="lab-opening" ref={openingRef}>
      <section className="lab-intro-screen" aria-label={ru ? "Знакомство со Space Buro" : "Welcome to Space Buro"}>
        <div className="lab-hero-card" ref={featuredRef}
          onPointerEnter={event => { if (event.pointerType === "mouse") setFeaturedHovered(true); }}
          onPointerLeave={() => setFeaturedHovered(false)}
          onFocusCapture={() => setFeaturedFocused(true)}
          onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFeaturedFocused(false); }}>
          <button className="lab-hero-image" onClick={() => onOpenProject(featuredProject)} aria-label={`${ru ? "Смотреть проект" : "View project"} ${featuredProject.shortTitle[lang]}`}>
            {featuredPhotos.map((photo, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={photo.photo} className={index === featuredIndex ? "is-current" : ""} src={`${imageRoot}${photo.photo}`} alt={index === featuredIndex ? `${photo.project.shortTitle[lang]} — ${photo.project.district}` : ""} aria-hidden={index !== featuredIndex} width={photo.width} height={photo.height} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" />
            ))}
            <span className="lab-hero-image-label">{featuredProject.shortTitle[lang]} <span aria-hidden="true"><ResponsiveArrow /></span></span>
          </button>
          <div className="lab-image-caption"><span>{featuredProject.district} / {featuredProject.area[lang]}</span><span>{ru ? "Завершён" : "Completed"}</span></div>
        </div>
        <div className="lab-intro-bottom"><span className="lab-edition">SPACE BURO <i /> DUBAI, UAE</span></div>
      </section>
      <section className="lab-statement" ref={statementRef} aria-labelledby="lab-statement-heading">
        <div className="lab-section-top"><span className="lab-eyebrow">[ {ru ? "СОЗДАНО SPACE BURO" : "CRAFTED BY SPACE BURO"} / 03 ]</span>
          <button className="lab-effect-toggle" aria-pressed={effectEnabled && !reducedMotion} disabled={reducedMotion} onClick={() => setEffectEnabled(value => !value)}>{ru ? "ЭФФЕКТ" : "EFFECT"} <span>{effectEnabled && !reducedMotion ? (ru ? "ВКЛ" : "ON") : (ru ? "ВЫКЛ" : "OFF")}</span></button>
        </div>
        <h1 id="lab-statement-heading"><span>{ru ? "Создайте ваше " : "Create your space "}</span><span>{ru ? "пространство " : "together with us."}</span>{ru && <span>вместе с нами.</span>}</h1>
        <div className="lab-statement-bottom"><span className="lab-pointer-help">{reducedMotion ? (ru ? "Уменьшение движения включено" : "Reduced motion enabled") : !effectEnabled ? (ru ? "Фотографии наших объектов" : "Our completed projects") : coarsePointer ? (ru ? "Коснитесь фона или листайте" : "Touch the background or scroll") : (ru ? "Проведите курсором — появится интерьер" : "Move your cursor to reveal an interior")}</span><a href="#lab-mosaic">{ru ? "ЛИСТАЙТЕ ДАЛЬШЕ" : "SCROLL TO EXPLORE"} <span aria-hidden="true">↓</span></a></div>
        <div className="lab-background-controls">
          <button className="lab-background-caption" onClick={() => onOpenProject(activeProject)} aria-label={`${ru ? "Открыть" : "Open"} ${activeProject.shortTitle[lang]}`}><span>{String(activeIndex + 1).padStart(2, "0")} / {String(curatedPhotos.length).padStart(2, "0")}</span><span>{activeProject.shortTitle[lang]} · {ru ? "Реализовано" : "Completed"} <ResponsiveArrow /></span></button>
          <button className="lab-photo-next" onClick={() => setActiveIndex(index => (index + 1) % curatedPhotos.length)} aria-label={ru ? "Следующий фон" : "Next background"}>→</button>
          <button className="lab-photo-pause" aria-pressed={paused || reducedMotion} disabled={reducedMotion} onClick={() => setPaused(value => !value)} aria-label={paused ? (ru ? "Продолжить смену фона" : "Resume background slideshow") : (ru ? "Приостановить смену фона" : "Pause background slideshow")}>{paused || reducedMotion ? "▶" : "Ⅱ"}<span>{ru ? "ФОН / 5 СЕК" : "PHOTO / 5 SEC"}</span></button>
        </div>
      </section>
    </div>
    <section className="lab-mosaic-section" ref={mosaicSectionRef} id="lab-mosaic" aria-label={ru ? "Галерея наших объектов" : "Our project gallery"}>
      <div className="lab-mosaic-heading"><span className="lab-eyebrow">[ {ru ? "НАШИ ПРОСТРАНСТВА" : "OUR SPACES"} / 04 ]</span><span>{ru ? "ДЕТАЛИ СКЛАДЫВАЮТСЯ В ЦЕЛОЕ" : "DETAILS BECOME A WHOLE"}</span></div>
      <div className={`lab-mosaic-viewport${activeMosaic ? " has-active" : ""}`} ref={viewportRef} role="region" aria-label={ru ? "Панорама фотографий. Листайте по горизонтали" : "Photo panorama. Scroll horizontally"} tabIndex={0} onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); shiftWall(event.key === "ArrowLeft" ? -1 : 1); } }}>
        {mosaicRows.map((photos, rowIndex) => <div className={`lab-mosaic-row lab-mosaic-row-${rowIndex + 1}`} key={rowIndex}>
          <div className="lab-mosaic-wall">{Array.from({ length: mosaicCopies }, (_, copy) => <div className="lab-mosaic-collage" key={copy} aria-hidden={copy !== 2 ? true : undefined}>
            {photos.map(({ id, photo, width, height }, index) => {
              const project = publishedProjects.find(item => item.id === id)!;
              const tileKey = `${rowIndex}-${index}`;
              return <button key={`${id}-${index}`} className={`lab-mosaic-photo${activeMosaic === tileKey ? " is-active" : ""}`} data-tile-key={tileKey} style={{ "--photo-ratio": width / height } as CSSProperties} tabIndex={copy === 2 ? 0 : -1} onPointerEnter={event => { if (event.pointerType === "mouse") { mosaicControlRef.current?.anchor(event.currentTarget); setActiveMosaic(tileKey); } }} onPointerLeave={() => { mosaicControlRef.current?.releaseAnchor(); setActiveMosaic(null); }} onFocus={event => { mosaicControlRef.current?.anchor(event.currentTarget); setActiveMosaic(tileKey); }} onBlur={() => { mosaicControlRef.current?.releaseAnchor(); setActiveMosaic(null); }} onClick={() => onOpenProject(project)} aria-label={`${project.shortTitle[lang]}: ${ru ? "открыть фотографии" : "view photography"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${imageRoot}${photo}`} alt={`${project.shortTitle[lang]} — ${project.district}`} loading="lazy" decoding="async" width={width} height={height} draggable={false} />
                <span>{project.shortTitle[lang]} <b aria-hidden="true"><ResponsiveArrow /></b></span>
              </button>;
            })}
          </div>)}</div>
        </div>)}
      </div>
      <div className="lab-mosaic-controls"><button aria-label={ru ? "Галерея влево" : "Scroll gallery left"} onClick={() => shiftWall(-1)}><span aria-hidden="true">←</span></button><button aria-label={ru ? "Галерея вправо" : "Scroll gallery right"} onClick={() => shiftWall(1)}><span aria-hidden="true">→</span></button></div>
    </section>
  </div>;
}
