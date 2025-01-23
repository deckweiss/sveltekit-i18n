import { browser } from '$app/environment';
import dateFormat from 'dateformat';

export function translate(
    locale: string,
    translations: Record<string, Record<string, string>>,
    key: string,
    params: Record<string, any>
): string {
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

    const regex = new RegExp('{{(.*?}})?', 'g');
    Array.from(text.matchAll(regex)).forEach((match) => {
        const wholeInterpolation = match[0];
        const hasFunctionCall = wholeInterpolation.indexOf(',') > 0;
        const varName = wholeInterpolation
            .substring(
                2,
                hasFunctionCall ? wholeInterpolation.indexOf(',') : wholeInterpolation.length - 2
            )
            .trim();

        const resolveVariableContent = params[varName];
        if (typeof resolveVariableContent === 'undefined') {
            console.warn(
                `Translation '${text}' is missing variable '${varName}'. Consider adding your variable to $t().`
            );
        } else if (hasFunctionCall) {
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
                        .map((arg) => [
                            arg.split(':')[0].trim(),
                            arg.substring(arg.indexOf(':') + 1).trim()
                        ])
                );
            } else {
                functionName = functionCall;
            }

            switch (functionName) {
                case 'date':
                    if (functionArguments.format) {
                        text = text.replace(
                            wholeInterpolation,
                            dateFormat(params[varName], functionArguments.format)
                        );
                    } else if (browser) {
                        console.warn(
                            `Translation '${text}' is missing required parameter 'format'. Example: '{{date, date(format: dd.mm.yyyy)}}'`
                        );
                    }
                    break;
                case 'number':
                    if (functionArguments.options) {
                        const numberFormat = new Intl.NumberFormat(
                            locale,
                            JSON.parse(functionArguments.options)
                        );
                        text = text.replace(
                            wholeInterpolation,
                            numberFormat.format(params[varName])
                        );
                    }
                    break;
            }
        } else {
            text = text.replace(wholeInterpolation, params[varName]);
        }
    });

    return text;
}
