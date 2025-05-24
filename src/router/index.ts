import Dashboard from '../views/Dashboard.vue'
import InventoryManagement from '../views/InventoryManagement.vue'
import ProductRegistration from '../views/ProductRegistration.vue'
import RevenueAnalysis from '../views/RevenueAnalysis.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/revenue',
    name: 'RevenueAnalysis',
    component: RevenueAnalysis,
    meta: { title: 'Revenue Analysis' }
  },
  {
    path: '/inventory',
    name: 'InventoryManagement',
    component: InventoryManagement,
    meta: { title: 'Inventory Management' }
  },
  {
    path: '/products/new',
    name: 'ProductRegistration',
    component: ProductRegistration,
    meta: { title: 'Add New Product' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404 Not Found' }
  }
]

export default routes