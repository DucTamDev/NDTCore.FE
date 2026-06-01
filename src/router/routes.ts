import type { RouteRecordRaw } from 'vue-router'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'

export const routes: RouteRecordRaw[] = [
    {
        path: APP_ROUTES.HOME.PATH,
        component: () => import('@/layouts/DefaultLayout.vue'),
        children: [
            {
                path: '',
                name: APP_ROUTES.HOME.NAME,
                component: () => import('@/modules/home/views/HomeView.vue'),
                meta: {
                    title: 'Home',
                    requiresAuth: false,
                },
            },
        ],
    },
    {
        path: APP_ROUTES.AUTH.BASE.PATH,
        component: () => import('@/layouts/AuthLayout.vue'),
        children: [
            {
                path: APP_ROUTES.AUTH.CHILDREN.LOGIN.PATH,
                name: APP_ROUTES.AUTH.CHILDREN.LOGIN.NAME,
                component: () => import('@/modules/auth/views/LoginView.vue'),
                meta: {
                    title: 'Đăng nhập',
                    requiresAuth: false,
                },
            },
            {
                path: APP_ROUTES.AUTH.CHILDREN.REGISTER.PATH,
                name: APP_ROUTES.AUTH.CHILDREN.REGISTER.NAME,
                component: () => import('@/modules/auth/views/RegisterView.vue'),
                meta: {
                    title: 'Đăng ký',
                    requiresAuth: false,
                },
            },
        ],
    },
    {
        path: APP_ROUTES.ADMIN.BASE.PATH,
        component: () => import('@/layouts/AdminLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.NAME,
                component: () => import('@/modules/dashboard/views/DashboardView.vue'),
                meta: {
                    title: 'Dashboard',
                    breadcrumbs: [{ title: 'Dashboard', disabled: true }],
                    requiresAuth: true,
                },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.USERS.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME,
                component: () => import('@/components/common/ComingSoonView.vue'),
                meta: {
                    title: 'Users',
                    breadcrumbs: [
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Users', disabled: true },
                    ],
                },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.BRANDS.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME,
                component: () => import('@/modules/brand/views/BrandsView.vue'),
                meta: {
                    title: 'Thương hiệu',
                    breadcrumbs: [
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Thương hiệu', disabled: true },
                    ],
                },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.BRAND_DETAIL.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.BRAND_DETAIL.NAME,
                component: () => import('@/modules/brand/views/BrandDetailView.vue'),
                meta: {
                    title: 'Chi tiết thương hiệu',
                },
            },
            {
                path: APP_ROUTES.PRODUCT.PRODUCTS.PATH,
                name: APP_ROUTES.PRODUCT.PRODUCTS.NAME,
                component: () => import('@/modules/product/views/ProductsView.vue'),
                meta: { title: 'Sản phẩm', requiresAuth: true },
            },
            {
                path: APP_ROUTES.PRODUCT.CATEGORIES.PATH,
                name: APP_ROUTES.PRODUCT.CATEGORIES.NAME,
                component: () => import('@/modules/product/views/CategoriesView.vue'),
                meta: {
                    title: 'Danh mục sản phẩm',
                    requiresAuth: true,
                    breadcrumbs: [
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Sản phẩm' },
                        { title: 'Danh mục', disabled: true },
                    ],
                },
            },
            {
                path: APP_ROUTES.PRODUCT.TAGS.PATH,
                name: APP_ROUTES.PRODUCT.TAGS.NAME,
                component: () => import('@/modules/product/views/TagsView.vue'),
                meta: {
                    title: 'Nhãn sản phẩm',
                    requiresAuth: true,
                    breadcrumbs: [
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Sản phẩm' },
                        { title: 'Nhãn', disabled: true },
                    ],
                },
            },
            {
                path: APP_ROUTES.PRODUCT.OPTION_GROUPS.PATH,
                name: APP_ROUTES.PRODUCT.OPTION_GROUPS.NAME,
                component: () => import('@/modules/product/views/OptionGroupsView.vue'),
                meta: { title: 'Nhóm option', requiresAuth: true },
            },
            {
                path: APP_ROUTES.PRODUCT.OPTIONS.PATH,
                name: APP_ROUTES.PRODUCT.OPTIONS.NAME,
                component: () => import('@/modules/product/views/OptionsView.vue'),
                meta: { title: 'Options', requiresAuth: true },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME,
                component: () => import('@/modules/brand/views/FranchiseesView.vue'),
                meta: { title: 'Nhà nhượng quyền', requiresAuth: true },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEE_DETAIL.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEE_DETAIL.NAME,
                component: () => import('@/modules/brand/views/FranchiseeDetailView.vue'),
                meta: { title: 'Chi tiết nhà nhượng quyền', requiresAuth: true },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.STORES.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME,
                component: () => import('@/modules/store/views/StoresView.vue'),
                meta: { title: 'Cửa hàng', requiresAuth: true },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.STORE_DETAIL.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.STORE_DETAIL.NAME,
                component: () => import('@/modules/store/views/StoreDetailView.vue'),
                meta: { title: 'Chi tiết cửa hàng', requiresAuth: true },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.STORE_MEMBERS.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.STORE_MEMBERS.NAME,
                component: () => import('@/modules/store/views/StoreMembersView.vue'),
                meta: { title: 'Thành viên cửa hàng', requiresAuth: true },
            },
            {
                path: 'sales',
                name: 'admin:sales',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'orders',
                name: 'admin:orders',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'reports/revenue',
                name: 'admin:reports-revenue',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'reports/shift',
                name: 'admin:reports-shift',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'reports/top-products',
                name: 'admin:reports-top-products',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
        ],
    },
    {
        path: APP_ROUTES.NOT_FOUND.PATH,
        component: () => import('@/layouts/BlankLayout.vue'),
        children: [
            {
                path: '',
                name: APP_ROUTES.NOT_FOUND.NAME,
                component: () => import('@/views/NotFoundView.vue'),
                meta: {
                    title: '404 Not Found',
                    requiresAuth: false,
                },
            },
        ],
    },
]
