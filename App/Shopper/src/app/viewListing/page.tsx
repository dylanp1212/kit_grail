import View from './View'
import {Suspense} from 'react'


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <View />
    </Suspense>
  )
}
