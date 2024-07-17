import { derived } from 'svelte/store';
import dateFormat from 'dateformat';
import { locale, locales, translations } from './state.js';
import { browser } from '$app/environment';

export function translate(locale: string, key: string, params: Record<string, any>): string {
    if (!key) {
        if (browser) console.warn('Please provide a translation key');
        return '[no key provided]';
    }

    const selectedLocale = locale ?? 'en';
    let text: string = translations[selectedLocale]?.[key] ?? '';

    if (!text) {
        if (browser) console.warn(`Translation for locale ${selectedLocale} not found`, key);
        return key;
    }

    // Replace any passed in variables in the translation string.
    Object.keys(params).map((k) => {
        const regex = new RegExp(`{{\\s*${k}.*}}`, 'g');
        Array.from(text.matchAll(regex)).forEach((match) => {
            const wholeInterpolation = match[0];
            const hasFunctionCall = wholeInterpolation.indexOf(',') > 0;

            if (hasFunctionCall) {
                const functionCall = wholeInterpolation
                    .slice(wholeInterpolation.indexOf(',') + 1, -2)
                    .trim();
                let functionName = '';
                let functionArguments: Record<string, string> = {};

                if (functionCall.includes('(')) {
                    functionName = functionCall.slice(0, functionCall.indexOf('('));
                    functionArguments = Object.fromEntries(
                        functionCall
                            .slice(functionCall.indexOf('(') + 1, -1)
                            .split(';')
                            .map((arg) => arg.split(':').map((_arg) => _arg.trim()))
                    );
                } else {
                    functionName = functionCall;
                }

                switch (functionName) {
                    case 'date':
                        if (functionArguments.format) {
                            text = text.replace(
                                wholeInterpolation,
                                dateFormat(params[k], functionArguments.format)
                            );
                        } else if (browser) {
                            console.warn(
                                `Translation '${text}' is missing required parameter 'format'. Example: '{{date, date(format: dd.mm.yyyy)}}'`
                            );
                        }
                        break;
                }
            } else {
                text = text.replace(wholeInterpolation, params[k]);
            }
        });
    });

    return text;
}

export const t = derived(
    locale,
    ($locale) =>
        (key: string, vars = {}) =>
            translate($locale, key, vars)
);
