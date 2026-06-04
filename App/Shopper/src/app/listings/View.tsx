
import TopBar from '../../components/TopBar'
import KitList from './kitList'
import {Suspense} from 'react'
import { useTranslations } from 'next-intl';

export default function View() {
  const t = useTranslations('Shop');
  return (
    <main>
      <TopBar title={t('title')} showSearch />
        <Suspense fallback={<div>Loading...</div>}>
          <KitList />
        </Suspense>
    </main>
  )
}
