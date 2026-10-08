/** Noms d'icônes : des chaînes sérialisables, pour passer des composants serveur aux composants client. */
export type NavIconName =
  | "dashboard"
  | "tutor"
  | "training"
  | "cases"
  | "courses"
  | "anatomy"
  | "level"
  | "plan"
  | "progress"
  | "profile";

export type NavItem = {
  href: string;
  label: string;
  /** Libellé court pour la barre basse mobile. */
  shortLabel?: string;
  icon: NavIconName;
  /** Affiché dans la barre basse mobile ; les autres passent dans « Plus ». */
  primary?: boolean;
};

/** Sections de l'application. Ordre = ordre d'affichage. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Tableau de bord", shortLabel: "Accueil", icon: "dashboard", primary: true },
  { href: "/tuteur", label: "Mon tuteur", icon: "tutor", primary: true },
  { href: "/entrainement", label: "Entraînement", icon: "training", primary: true },
  { href: "/cours", label: "Mes cours", icon: "courses", primary: true },
  { href: "/cas-cliniques", label: "Cas cliniques", icon: "cases" },
  { href: "/anatomie-3d", label: "Anatomie 3D", icon: "anatomy" },
  { href: "/niveau-reel", label: "Mon niveau réel", icon: "level" },
  { href: "/plan", label: "Mon plan", icon: "plan" },
  { href: "/progression", label: "Progression", icon: "progress" },
  { href: "/profil", label: "Profil", icon: "profile" },
];
