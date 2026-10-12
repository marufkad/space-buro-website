import type { Localized } from "./data";

// Confirmed participation can be displayed before a project has its own gallery.
// Apartment-specific credits replace the generic Al Bateen label in profiles;
// they must not imply that the same gallery belongs to both apartments.
export type TeamProjectCredit = {
  id: string;
  title: Localized;
  teamIds: string[];
  replacesProjectId?: string;
};

export const teamProjectCredits: TeamProjectCredit[] = [
  {
    id: "al-bateen-residence-2808",
    title: { ru: "Al Bateen Residence 2808", en: "Al Bateen Residence 2808" },
    teamIds: ["maruf", "georgiy", "quvvat", "aygul"],
    replacesProjectId: "al-bateen-residences-jbr",
  },
  {
    id: "al-bateen-residence-2803",
    title: { ru: "Al Bateen Residence 2803", en: "Al Bateen Residence 2803" },
    teamIds: ["maruf", "georgiy", "quvvat", "aygul"],
    replacesProjectId: "al-bateen-residences-jbr",
  },
  {
    id: "hillcrest-address-villa-dubai",
    title: { ru: "Hillcrest Address Villa Dubai", en: "Hillcrest Address Villa Dubai" },
    teamIds: ["maruf", "georgiy", "aygul"],
  },
];
