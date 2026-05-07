import View from './View'
import {Suspense} from 'react'
// import {useSearchParams} from 'next/navigation';


export default function Page() {
  // const searchParams = useSearchParams();
  // const id = searchParams.get('id') ?? undefined;
  // if id undefined, send to not found
  // if id not uuid, send to not found
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <View />
    </Suspense>
  )
  // return <>hi</>
}
