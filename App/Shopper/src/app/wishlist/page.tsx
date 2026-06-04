import TopBar from '../../components/TopBar'
import WishList from './wishList'
import {Suspense} from 'react'

export default function Page() {
  return (
    <main>
      <TopBar title={'Wishlist'} showSearch />
      <Suspense fallback={<div>Loading...</div>}>
        <WishList />
      </Suspense>
    </main>
  )
}
