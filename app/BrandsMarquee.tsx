"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { brands, type Lang } from "./data";
import "./lab-brands.css";

const rows = [brands.slice(0, Math.ceil(brands.length / 2)), brands.slice(Math.ceil(brands.length / 2))];

// Visible ink bounds measured from the original SVGs at 2048 px canvas width.
// Most source files have a square white canvas, although the mark is a wordmark.
// Cropping only that blank canvas gives every logo the same visible height
// without stretching, recolouring or rasterising the original vector artwork.
// [canvas width, canvas height, left, top, right, bottom]
const logoBounds: Record<string, readonly [number, number, number, number, number, number]> = {
  EGGER: [2048, 471, 0, 0, 2048, 471],
  Blum: [2048, 2048, 90, 785, 1958, 1263],
  Hettich: [2048, 2048, 90, 721, 1958, 1267],
  "Häfele": [2048, 2048, 90, 889, 1958, 1159],
  REHAU: [2048, 2048, 90, 759, 1958, 1289],
  Mapei: [2048, 475, 0, 0, 2048, 475],
  Knauf: [2048, 2048, 30, 392, 2018, 1656],
  Jotun: [2048, 2048, 30, 724, 2018, 1324],
  "Schneider Electric": [2048, 2048, 30, 640, 2018, 1461],
  // This SVG contains live Arial text: retain its full horizontal canvas so
  // differences in platform font metrics cannot cut off the final letter.
  Legrand: [2048, 512, 0, 9, 2048, 453],
  Grohe: [2048, 2048, 30, 616, 2018, 1432],
  Geberit: [2048, 2048, 30, 884, 2018, 1164],
  Kohler: [2048, 2048, 90, 463, 1958, 1585],
  Roca: [2048, 2048, 90, 670, 1958, 1379],
  Siemens: [2048, 2048, 77, 874, 1971, 1174],
  "Saint-Gobain": [2048, 2048, 90, 729, 1958, 1249],
};

function logoGeometry(name: string) {
  const [canvasWidth, canvasHeight, inkLeft, inkTop, inkRight, inkBottom] = logoBounds[name] ?? [1, 1, 0, 0, 1, 1];
  // A two-pixel measurement margin preserves antialiased edges at every scale.
  const left = Math.max(0, inkLeft - 2);
  const top = Math.max(0, inkTop - 2);
  const width = Math.min(canvasWidth, inkRight + 2) - left;
  const height = Math.min(canvasHeight, inkBottom + 2) - top;
  return {
    canvasWidth,
    canvasHeight,
    frame: { "--brand-ratio": width / height } as CSSProperties,
    image: {
      width: `${canvasWidth / width * 100}%`,
      height: `${canvasHeight / height * 100}%`,
      left: `${-left / width * 100}%`,
      top: `${-top / height * 100}%`,
    },
  };
}

export default function BrandsMarquee({ title }: { lang: Lang; title: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let inView = false;
    const sync = () => { section.dataset.motionPaused = String(!inView || document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(section);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); };
  }, []);

  return <section className="brands-marquee" ref={sectionRef} data-motion-paused="true" tabIndex={0} aria-label={title}>
    <p>{title}</p>
    <div className="brands-rows">
      {rows.map((row, rowIndex) => <div className="marquee-window" key={rowIndex}>
        <div className={`marquee-track${rowIndex === 0 ? " marquee-track-reverse" : ""}`}>
          {[0, 1].map(copy => <div className="marquee-group" key={copy} aria-hidden={copy === 1 || undefined}>
            {row.map(brand => {
              const geometry = logoGeometry(brand.name);
              return <span className="brand-mark" data-brand={brand.name} key={brand.name} style={geometry.frame}>
                <Image src={brand.logo} alt={copy === 0 ? brand.name : ""} width={geometry.canvasWidth} height={geometry.canvasHeight} style={geometry.image} />
              </span>;
            })}
          </div>)}
        </div>
      </div>)}
    </div>

  </section>;
}
