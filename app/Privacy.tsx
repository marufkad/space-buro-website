import Link from "next/link";
import type { Lang } from "./data";
import { businessName, pathFor } from "./site";

export default function Privacy({lang}:{lang:Lang}) {
  const ru=lang==="ru";
  const sections=ru ? [
    ["Обращения через сайт", "Форма готовит сообщение с вашим именем, телефоном, типом проекта и описанием задачи. Сообщение отправляется только после вашего подтверждения в WhatsApp. На сайте нет отдельной базы для хранения этих заявок."],
    ["Для чего нужны ваши данные", "Space Buro использует данные из полученного сообщения для ответа на запрос, подготовки расчёта и обсуждения проекта. Для изменения или удаления переписки и контактных данных напишите на info@space-buro.ae."],
    ["Внешние сервисы", "WhatsApp, Telegram, Instagram и YouTube работают по своим правилам конфиденциальности. Карта загружает данные OpenStreetMap; при её открытии провайдер получает обычные технические данные запроса, включая IP-адрес. Хостинг Vercel также может обрабатывать технические журналы запросов."],
    ["Фотографии и документы", "Отправляйте только материалы, которыми вы вправе поделиться. Для предварительного обсуждения не нужны паспортные данные, банковские реквизиты или другие чувствительные документы."],
  ] : [
    ["Website enquiries", "The form prepares a message with your name, phone number, project type and brief. It is sent only after you confirm it in WhatsApp. This website has no separate database for storing these enquiries."],
    ["How your details are used", "Space Buro uses information received in your message to respond, prepare an estimate and discuss your project. To request changes or deletion of correspondence and contact details, email info@space-buro.ae."],
    ["External services", "WhatsApp, Telegram, Instagram and YouTube have their own privacy policies. The map loads OpenStreetMap data; its provider receives normal technical request data, including your IP address. Vercel hosting may also process technical request logs."],
    ["Photos and documents", "Send only materials you are entitled to share. Passport details, banking information and other sensitive documents are not needed for an initial discussion."],
  ];
  return <main id="content" className="privacy-page"><Link href={pathFor(lang)}>← Space Buro</Link><Link href={pathFor(ru?"en":"ru","/privacy")} hrefLang={ru?"en":"ru"}>{ru?"English":"Русский"}</Link><p className="eyebrow">{businessName}</p><h1>{ru?"Конфиденциальность":"Privacy"}</h1>{sections.map(([title,text])=><section key={title}><h2>{title}</h2><p>{text}</p></section>)}<a href="mailto:info@space-buro.ae">info@space-buro.ae</a></main>;
}
