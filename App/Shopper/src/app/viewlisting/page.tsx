import View from './View'
import TopBar from '../../components/TopBar'
import {Suspense} from 'react'

export default function Page() {
  return (
    <>
      <TopBar title={'Kit Grail'} />
      <Suspense fallback={<div>Loading...</div>}>
        <View />
      </Suspense>
    </>
  )
}
