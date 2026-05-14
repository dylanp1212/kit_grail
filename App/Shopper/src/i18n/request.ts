import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';

const SUPPORTED_LOCALES = ['en', 'sp'];

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = SUPPORTED_LOCALES.includes(cookieStore.get('locale')?.value ?? '')
    ? cookieStore.get('locale')!.value
    : 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
