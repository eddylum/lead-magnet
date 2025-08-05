import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fonction utilitaire pour gérer les apostrophes sur Vercel
export function formatText(text: string) {
  return text.replace(/&#39;/g, "'").replace(/&apos;/g, "'");
}

// Fonction pour créer un élément avec du HTML sécurisé
export function createHtmlElement(html: string) {
  return { __html: html };
}
