"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Lang } from "./data";
import "./lab-team-media.css";

// The real team photo is the temporary cover until a video still is supplied.
const teamPhoto = "/media/team-group.webp";
const teamVideo = "https://www.youtube-nocookie.com/embed/fynhXsxRglU?rel=0&playsinline=1&autoplay=1";

export default function TeamMedia({ lang }: { lang: Lang }) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const ru = lang === "ru";

  return (
    <section className="section team-section lab-team-extra lab-team-media" aria-label={ru ? "Команда на объекте" : "Team on site"}>
      <figure className="team-group-photo" data-reveal>
        <Image
          src={teamPhoto}
          alt={ru ? "Команда Space Buro на объекте" : "Space Buro team on site"}
          fill
          sizes="(max-width: 620px) calc(100vw - 40px), 90vw"
        />
      </figure>
      <div className={`team-video${videoPlaying ? " is-playing" : ""}`} data-reveal>
        {videoPlaying ? (
          <iframe
            ref={videoRef}
            src={teamVideo}
            title={ru ? "Видео о команде Space Buro" : "Space Buro team video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={() => videoRef.current?.focus({ preventScroll: true })}
            allowFullScreen
          />
        ) : (
          <button className="video-cover" type="button" onClick={() => setVideoPlaying(true)}>
            <Image src={teamPhoto} alt="" fill sizes="(max-width: 620px) calc(100vw - 40px), 90vw" />
            <span className="team-video-play-label">
              <span className="team-video-play-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false"><path d="m9 5 11 7-11 7Z" /></svg>
              </span>
              <span>{ru ? "Знакомство с командой" : "Meet the team"}</span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
