import {cookies} from 'next/headers';
import {getRequestConfig} from 'next-intl/server';

const SUPPORTED_LOCALES = ['en', 'sp'];

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = SUPPORTED_LOCALES.includes(store.get('locale')?.value ?? '')
    ? store.get('locale')!.value
    : 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
