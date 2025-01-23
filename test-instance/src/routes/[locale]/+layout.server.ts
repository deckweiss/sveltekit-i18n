import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = function (event) {
    event.locals.i18n.setLocale(event.params.locale);
    return { locale: event.locals.i18n.locale };
};
