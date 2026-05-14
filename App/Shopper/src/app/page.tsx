"use client"

import {Suspense} from 'react'
import KitList from './listings/kitList'
import Search from './listings/search'

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
