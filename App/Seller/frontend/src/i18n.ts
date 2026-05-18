import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

// read locale from cookie
const locale = document.cookie.split('; ').find((r) => r.startsWith(
    'locale='))?.split('=')[1] ?? 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: {translation: {activeListings: 'Active Listings',
      productName: 'Product Name', inventoryStatus: 'Inventory Status',
      price: 'Price', dashboard: 'Dashboard', inventory: 'Inventory',
      orders: 'Orders', newListing: 'New Listing', totalSales: 'TOTAL SALES',
      pendingOrders: 'PENDING ORDERS', signOut: 'Sign Out'}},
    sp: {translation: {activeListings: 'Anuncios activos',
      productName: 'Nombre del producto',
      inventoryStatus: 'Estado del inventario', price: 'Precio',
      dashboard: 'Panel', inventory: 'Inventario', orders: 'Pedidos',
      newListing: 'Nuevo anuncio', totalSales: 'VENTAS TOTALES',
      pendingOrders: 'PEDIDOS PENDIENTES', signOut: 'Cerrar sesión'}},
  },
  lng: locale,
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
})

;(window as any).i18n = i18n;

export default i18n;
