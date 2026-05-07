// ############################
// these tests cover the if(!isTest) lines in the services
// those lines are there to get rid of an error that sometimes occurs
// if you add a service make sure that the import of server-only 
// uses the test guard (copy from existing ones)
// !!!! don't change the name of this test, it needs to start with
// 01 so runs first (alphabetically)
// ############################

'use server'
import {it, vi} from 'vitest';

vi.unmock('../src/kit_listing/service')
vi.unmock('../src/wishlist/service')
vi.unmock('../src/shoppingcart/service')

const switchEnv = async (path: string) => {
  process.env.NODE_ENV = 'dev';
  console.log(process.env.NODE_ENV);
  try {
    await import(path);
  } catch {
    console.log('caught error importing service');
  }
  process.env.NODE_ENV = 'test';
}

it('switches node environment kit_listing service', async () => {
  await switchEnv('../src/kit_listing/service')
});

it('switches node environment wishlist service', async () => {
  await switchEnv('../src/wishlist/service')
});

it('switches node environment shoppingcart service', async () => {
  await switchEnv('../src/shoppingcart/service')
});
