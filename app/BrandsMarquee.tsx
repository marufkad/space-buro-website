"use client";

import Image from "next/image";
import { useState } from "react";
import { brands, type Lang } from "./data";

const rows = [brands.slice(0, Math.ceil(brands.length / 2)), brands.slice(Math.ceil(brands.length / 2))];

export default function BrandsMarquee({ lang, title }: { lang: Lang; title: string }) {
  const [paused, setPaused] = useState(false);

  return <section className={`brands-marquee${paused ? " is-paused" : ""}`} aria-label={title}>
    <p>{title}</p>
    <div className="brands-rows">
      {rows.map((row, rowIndex) => <div className="marquee-window" key={rowIndex}>
        <div className={`marquee-track${rowIndex === 0 ? " marquee-track-reverse" : ""}`}>
          {[0, 1].map(copy => <div className="marquee-group" key={copy} aria-hidden={copy === 1 || undefined}>
            {row.map(brand => <span data-brand={brand.name} key={brand.name}>
              <Image src={brand.logo} alt={copy === 0 ? brand.name : ""} width={176} height={58} />
            </span>)}
          </div>)}
        </div>
      </div>)}
    </div>
    <button className="brands-motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
      {lang === "ru" ? (paused ? "Продолжить движение" : "Остановить движение") : (paused ? "Resume motion" : "Pause motion")}
    </button>
  </section>;
}
