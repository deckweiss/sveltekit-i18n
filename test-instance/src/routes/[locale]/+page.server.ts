import type { PageServerLoad } from './$types';

export const load: PageServerLoad = function (event) {
    return {
        translatedOnServer: event.locals.i18n.t('app.name')
    };
};
