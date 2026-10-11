"use client";

import ResponsiveArrow from "./ResponsiveArrow";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { projectLocations, team, type Lang, type ProjectLocation } from "./data";
import { projectPath } from "./site";
import "./lab-people-process.css";
import "./case-team.css";

type LabPerson = {
  id: string;
  name: Record<Lang, string>;
  role: Record<Lang, string>;
  experience: Record<Lang, string>;
  image?: string;
  initials?: Record<Lang, string>;
  responsibilities?: Record<Lang, string[]>;
};

const labPeople: LabPerson[] = [
  ...team,
  {
    id: "georgiy",
    name: { ru: "Георгий", en: "Georgiy" },
    role: { ru: "Менеджер проектов", en: "Project Manager" },
    image: "/media/team-georgiy-lab.webp",
    initials: { ru: "Г", en: "G" },
    experience: {
      ru: "Ведёт организационную работу по проектам и помогает команде согласовывать задачи на объекте.",
      en: "Coordinates project activity and helps the team align tasks on site.",
    },
    responsibilities: {
      ru: ["Организация работ", "Координация команды", "Сопровождение проекта"],
      en: ["Work planning", "Team coordination", "Project support"],
    },
  },
  {
    id: "aygul",
    name: { ru: "Айгуль", en: "Aygul" },
    role: { ru: "Разрешения и документация", en: "Permits & Documentation" },
    initials: { ru: "А", en: "A" },
    experience: {
      ru: "Занимается документацией и согласованиями, необходимыми для выполнения работ на объекте.",
      en: "Handles the documentation and approvals required for work on site.",
    },
    responsibilities: {
      ru: ["Документы по объекту", "Подготовка разрешений", "Сопровождение согласований"],
      en: ["Project documentation", "Permit preparation", "Approval coordination"],
    },
  },
  {
    id: "pavel",
    name: { ru: "Павел", en: "Pavel" },
    role: { ru: "Мебель на заказ", en: "Custom Furniture" },
    initials: { ru: "П", en: "P" },
    experience: {
      ru: "Работает в мебельной команде Space Buro и участвует в реализации мебели на заказ.",
      en: "Works with the Space Buro furniture team to deliver custom furniture.",
    },
    responsibilities: {
      ru: ["Мебельные работы", "Сборка мебели", "Монтаж на объекте"],
      en: ["Furniture work", "Furniture assembly", "On-site installation"],
    },
  },
];

const teamOrder = ["maruf", "georgiy", "serdar", "quvvat", "aygul", "pavel"];
const labTeam = teamOrder.flatMap(id => labPeople.filter(person => person.id === id));
const portraitSizes: Record<string, [number, number]> = {
  maruf: [900, 1026],
  georgiy: [1190, 1322],
  serdar: [900, 1022],
  quvvat: [900, 991],
};

const teamProjects = new Map(labTeam.map((person) => [person.id, projectLocations.filter((project) =>
  project.published && project.status !== "service" && project.teamIds.includes(person.id),
)]));

export default function LabTeam({ lang, project }: { lang: Lang; project?: ProjectLocation }) {
  const people = useMemo(() => project ? labTeam.filter((person) => project.teamIds.includes(person.id)) : labTeam, [project]);
  const sectionId = project ? "case-team" : "team";
  const titleId = project ? "case-team-title" : "lab-team-title";
  const memberPrefix = project ? "case-team" : "team";
  const infoPrefix = project ? "case-team-info" : "lab-team-info";
  const [active, setActive] = useState(0);
  const controls = useRef<(HTMLButtonElement | null)[]>([]);
  const portraits = useRef<HTMLDivElement>(null);
  const text = lang === "ru" ? {
    label: project ? "03 / Команда проекта" : "Команда Space Buro",
    title: project ? "Люди за этим проектом." : "Люди за каждым решением.",
    intro: "Дизайн, инженерные решения, снабжение и работы на объекте ведёт команда Space Buro.",
    hint: project ? "Выберите сотрудника" : "Выберите сотрудника, чтобы узнать больше",
    projects: "Участие в проектах",
    expertise: "Опыт и ответственность",
    profile: project ? "Показать сотрудника" : "Открыть профиль",
    responsibilities: "Зона ответственности",
  } : {
    label: project ? "03 / The project team" : "The Space Buro team",
    title: project ? "The people behind this project." : "The people behind every decision.",
    intro: "Our team leads design, engineering, procurement and work on site.",
    hint: project ? "Select a team member" : "Select a team member to learn more",
    projects: "Project involvement",
    expertise: "Experience & responsibility",
    profile: project ? "Show team member" : "Show profile",
    responsibilities: "Responsibilities",
  };

  useEffect(() => {
    const followHash = () => {
      const member = people.findIndex((person) => window.location.hash === `#${memberPrefix}-${person.id}`);
      if (member >= 0) setActive(member);
    };
    followHash();
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, [people, memberPrefix]);

  useEffect(() => {
    const viewport = portraits.current;
    const portrait = controls.current[active]?.parentElement;
    if (!viewport || !portrait) return;
    let frame = 0;
    // Follow the expanding card only inside its horizontal strip; never move the page.
    const reveal = () => {
      frame = 0;
      if (!window.matchMedia("(max-width: 700px)").matches) return;
      const outer = viewport.getBoundingClientRect();
      const inner = portrait.getBoundingClientRect();
      if (inner.left < outer.left) viewport.scrollLeft += inner.left - outer.left;
      else if (inner.right > outer.right) viewport.scrollLeft += inner.right - outer.right;
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(reveal);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(viewport);
    observer.observe(portrait);
    schedule();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [active]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? people.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : -1) + people.length) % people.length;
    setActive(next);
    controls.current[next]?.focus({ preventScroll: true });
  }

  return (
    <section className={`lab-team${project ? " case-project-team" : ""}`} id={sectionId} aria-labelledby={titleId}>
      <div className="lab-team-heading">
        <p className="lab-team-kicker">[ {text.label} ]</p>
        <div>
          <h2 id={titleId}>{text.title}</h2>
          {!project && <p className="lab-team-intro">{text.intro}</p>}
          <p className="lab-team-hint">{text.hint} <ResponsiveArrow /></p>
        </div>
      </div>

      <div className="lab-team-portraits" ref={portraits} aria-label={text.label}>
        {people.map((person, index) => (
          <article
            className={`lab-team-portrait${active === index ? " is-active" : ""}`}
            id={`${memberPrefix}-${person.id}`}
            data-member={person.id}
            key={person.id}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(index); }}
          >
            <button
              className="lab-team-select"
              ref={(node) => { controls.current[index] = node; }}
              type="button"
              aria-expanded={active === index}
              aria-controls={project ? `${memberPrefix}-caption-${person.id}` : `${infoPrefix}-${person.id}`}
              aria-label={`${text.profile}: ${person.name[lang]}, ${person.role[lang]}`}
              onFocus={event => { if (event.currentTarget.matches(":focus-visible")) setActive(index); }}
              onClick={() => setActive(index)}
              onKeyDown={(event) => navigate(event, index)}
            >
              {person.image ? (
                <span className="lab-team-photo-frame">
                  <Image src={person.image} alt={person.name[lang]} width={portraitSizes[person.id][0]} height={portraitSizes[person.id][1]} sizes="(max-width: 700px) 75vw, 550px" />
                </span>
              ) : (
                <span className="lab-team-monogram" aria-hidden="true">
                  <span>{person.initials?.[lang]}</span>
                </span>
              )}
              <span className="lab-team-collapsed-name" aria-hidden="true">{person.name[lang]}</span>
              <span className="lab-team-portrait-caption" id={`${memberPrefix}-caption-${person.id}`} aria-hidden={active !== index}>
                <strong>{person.name[lang]}</strong>
                <span>{person.role[lang]}</span>
              </span>
              <ResponsiveArrow className="lab-team-portrait-arrow" />
            </button>
          </article>
        ))}
      </div>

      {!project && <div className="lab-team-details">
        {people.map((person, index) => (
          <div id={`${infoPrefix}-${person.id}`} className="lab-team-info" key={person.id} hidden={active !== index}>
            <div className="lab-team-biography">
              <p className="lab-team-small-label">{text.expertise}</p>
              <h3>{person.name[lang]}</h3>
              <p className="lab-team-role">{person.role[lang]}</p>
              <p>{person.experience[lang]}</p>
            </div>
            <div className="lab-team-projects">
              <p className="lab-team-small-label">{person.responsibilities ? text.responsibilities : text.projects}</p>
              {person.responsibilities ? (
                <ul className="lab-team-responsibilities">
                  {person.responsibilities[lang].map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
              ) : <ul>
                {teamProjects.get(person.id)?.map((project) => (
                  <li key={project.id}>
                    <Link href={projectPath(lang, project)}>
                      <span>{project.shortTitle[lang]}</span><ResponsiveArrow />
                    </Link>
                  </li>
                ))}
              </ul>}
            </div>
          </div>
        ))}
      </div>}
    </section>
  );
}
