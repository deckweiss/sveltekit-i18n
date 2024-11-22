import { setLocale } from '@deckweiss/internationalization';

export function load(event) {
    setLocale(event.data.userLocale);
}
