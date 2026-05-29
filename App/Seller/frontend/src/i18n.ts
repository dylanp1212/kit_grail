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
      pendingOrders: 'PENDING ORDERS', signOut: 'Sign Out',
      language: 'Language',
      apiKeys: 'API Keys', keysTitle: 'API Keys',
      keysSubtitle: 'Use these to authenticate B2B integrations.',
      keysCreateButton: 'Create Key',
      keysCreateTitle: 'Create a new API key',
      keysLabel: 'Label', keysLabelPlaceholder: 'e.g. Production',
      keysCancel: 'Cancel', keysShowTitle: 'Save this key',
      keysShowWarning: 'This is the only time you\'ll see the full ' +
        'key. Copy it now and store it securely.',
      keysShowDone: 'I saved it', keysCopy: 'Copy',
      keysPrefix: 'Prefix', keysCreatedAt: 'Created',
      keysStatus: 'Status', keysActions: 'Actions',
      keysActive: 'Active', keysRevoked: 'Revoked',
      keysRevoke: 'Revoke',
      keysRevokeConfirm: 'Revoke this key? It will stop working ' +
        'immediately.',
      keysEmpty: 'No API keys yet. Create one to get started.'}},
    sp: {translation: {activeListings: 'Anuncios activos',
      productName: 'Nombre del producto',
      inventoryStatus: 'Estado del inventario', price: 'Precio',
      dashboard: 'Panel', inventory: 'Inventario', orders: 'Pedidos',
      newListing: 'Nuevo anuncio', totalSales: 'VENTAS TOTALES',
      pendingOrders: 'PEDIDOS PENDIENTES', signOut: 'Cerrar sesión',
      language: 'Idioma',
      apiKeys: 'Claves de API', keysTitle: 'Claves de API',
      keysSubtitle: 'Úsalas para autenticar integraciones B2B.',
      keysCreateButton: 'Crear clave',
      keysCreateTitle: 'Crear una nueva clave de API',
      keysLabel: 'Etiqueta', keysLabelPlaceholder: 'p. ej. Producción',
      keysCancel: 'Cancelar', keysShowTitle: 'Guarda esta clave',
      keysShowWarning: 'Esta es la única vez que verás la clave ' +
        'completa. Cópiala ahora y guárdala de forma segura.',
      keysShowDone: 'La guardé', keysCopy: 'Copiar',
      keysPrefix: 'Prefijo', keysCreatedAt: 'Creada',
      keysStatus: 'Estado', keysActions: 'Acciones',
      keysActive: 'Activa', keysRevoked: 'Revocada',
      keysRevoke: 'Revocar',
      keysRevokeConfirm: '¿Revocar esta clave? Dejará de funcionar ' +
        'de inmediato.',
      keysEmpty: 'Aún no hay claves de API. Crea una para comenzar.'}},
  },
  lng: locale,
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
})

;(window as any).i18n = i18n;

export default i18n;
