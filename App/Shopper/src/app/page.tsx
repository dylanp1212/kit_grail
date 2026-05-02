"use client"
import {Suspense} from 'react'
import KitList from '../components/kitList'
import Search from '../components/search'

export default function Home() {
  return (
    <main>
      SHOPPPPPPPPPPPP!!!!!
      <Search />
      <br />
      <Suspense fallback={<div>Loading...</div>}>
        <KitList />
      </Suspense>
    </main>
  );
}
