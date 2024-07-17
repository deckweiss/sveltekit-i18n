import { initialize as initializeI18n } from '$lib/index.js';
import de from './de.json';
import en from './en.json';

initializeI18n({
    defaultLocale: 'en',
    locales: {
        de,
        en
    }
});
