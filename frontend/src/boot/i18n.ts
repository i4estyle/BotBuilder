import { defineBoot } from '#q-app';
import { createI18n } from 'vue-i18n';

import messages from '@/i18n';

export type MessageLanguages = keyof typeof messages;
// Type-define 'th-TH' as the master schema for the resource
export type MessageSchema = (typeof messages)['th-TH'];

export const LOCALE_STORAGE_KEY = 'botbuilder-locale';

export function getStoredLocale(): MessageLanguages {
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === 'th-TH' || stored === 'en-US') return stored;
  return 'th-TH';
}

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

export default defineBoot(({ app }) => {
  const i18n = createI18n<{ message: MessageSchema }, MessageLanguages>({
    locale: getStoredLocale(),
    fallbackLocale: 'th-TH',
    legacy: false,
    messages,
  });

  // Set i18n instance on app
  app.use(i18n);
});
