import { Notify } from 'quasar'

const ADMIN_ROUTE = '/admin'


export default ({ app, router, store, Vue }) => {

  let routeData = {
    path: '/admin',
    meta: { auth: true },
    component: () => import('@/layouts/AdminLayout'),
    children: [
      { path: '', name: 'AdminIndex', component: () => import('@/pages/admin/Index') },
      { path: 'warehouses/opname-vouchers/create',
        name: 'OpnameVoucherCreate',
        meta: { mode: 'create', auth: ['opname-vouchers-create'] },
        component: () => import('@/pages/admin/warehouses/opname-vouchers/Form') },
      { path: 'warehouses/opname-vouchers/:id/edit',
        name: 'OpnameVoucherUpdate',
        meta: { mode: 'update', auth: ['opname-vouchers-update'] },
        component: () => import('@/pages/admin/warehouses/opname-vouchers/Form') },
      { path: 'warehouses/opname-vouchers/:id',
        name: 'OpnameVoucherView',
        meta: { mode: 'view', auth: ['opname-vouchers-read'] },
        component: () => import('@/pages/admin/warehouses/opname-vouchers/View') },
      { path: 'warehouses/opname-vouchers',
        name: 'OpnameVouchers',
        meta: { auth: ['opname-vouchers-read']},
        component: () => import('@/pages/admin/warehouses/opname-vouchers/Index') },

      { path: 'error', name: 'AdminError', component: () => import('@/pages/admin/Error') },
      { path: '/*', name: 'AdminE404', component: () => import('@/pages/admin/E404') },
    ]
  }

  router.addRoutes([routeData])
}
