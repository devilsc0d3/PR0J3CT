// src/lib/locales.ts
export const locales = {
    en: {
        greeting: {
            hello: "Hello",
            welcome: "Welcome"
        }
    },
    fr: {
        greeting: {
            hello: "Bonjour",
            welcome: "Bienvenue"
        }
    }
} as const;

export type Locales = typeof locales;
