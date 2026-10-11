"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Only local content blocks: never animate the page, sticky headers, maps,
// dialogs, or the separately animated first screen / lab components.
const selector = [
  ".lab-home [data-reveal]",
  ".case-study [data-reveal]",
  ".lab-home .trust-photo",
  ".lab-home .trust-copy",
  ".project-detail-page .detail-facts > div",
  ".project-detail-page .detail-facts > dl",
  ".project-detail-page .detail-section-title",
  ".project-detail-page .detail-gallery-grid > button",
  ".project-detail-page .detail-team > div:last-child > a",
  ".project-detail-page .detail-next > *",
  ".china-detail-page .detail-section-title",
  ".china-detail-page .china-detail-process article",
  ".china-detail-page .china-detail-terms > div:first-child",
  ".china-detail-page .china-detail-terms article",
  ".china-detail-page .china-detail-included > div",
  ".china-detail-page .china-detail-included li",
  ".china-detail-page .detail-next > *",
  ".privacy-page h2",
].join(",");
const excluded = ".lab-intro,.lab-advantages,.lab-team,.lab-process,.map-layout,.project-map,.project-modal-backdrop,.detail-lightbox";

export default function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.IntersectionObserver || !Element.prototype.animate) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(pointer: coarse)");
    const running = new Set<Animation>();
    let observer: IntersectionObserver | undefined;
    const frame = window.requestAnimationFrame(() => {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(element => {
        if (element.closest(excluded)) return false;
        // Avoid stacked parent/child movement and transformed containing blocks
        // around overlays. These nodes remain fully visible without JavaScript.
        if (element.parentElement?.closest(selector)) return false;
        if (element.querySelector(".floating-contact,.detail-lightbox,.project-modal-backdrop")) return false;
        const position = window.getComputedStyle(element).position;
        return position !== "fixed" && position !== "sticky";
      });
      observer = new IntersectionObserver(entries => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer?.unobserve(entry.target);
          if (reduced.matches || document.hidden) continue;
          const animation = entry.target.animate([
            { opacity: 1, translate: touch.matches ? "0 10px" : "0 20px" },
            { opacity: 1, translate: "0 0" },
          ], {
            duration: touch.matches ? 420 : 720,
            delay: Math.min(order++, 3) * (touch.matches ? 30 : 65),
            easing: "cubic-bezier(.2,.7,.2,1)",
            fill: "backwards",
          });
          running.add(animation);
          animation.onfinish = () => running.delete(animation);
          animation.oncancel = () => running.delete(animation);
        }
      }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
      candidates.forEach(element => observer?.observe(element));
    });
    const stop = () => { running.forEach(animation => animation.cancel()); running.clear(); };
    const onPreference = () => { if (reduced.matches) stop(); };
    const onVisibility = () => { if (document.hidden) stop(); };
    reduced.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      reduced.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [pathname]);

  return null;
}
