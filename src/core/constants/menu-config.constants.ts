import type { MenuEntry } from '@/core/types'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import { SYSTEM_ROLES } from './app.constants'

export const menuConfig: MenuEntry[] = [
    // Standalone
    {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        to: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.NAME,
        roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN],
    },

    // Quản lý
    {
        section: 'Quản lý',
        items: [
            {
                title: 'Người dùng',
                icon: 'mdi-account-group',
                to: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME,
                roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN],
            },
            {
                title: 'Thương hiệu',
                icon: 'mdi-domain',
                to: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME,
                roles: [
                    SYSTEM_ROLES.SUPER_ADMIN,
                    SYSTEM_ROLES.ORG_ADMIN,
                    SYSTEM_ROLES.BRAND_MANAGER,
                    SYSTEM_ROLES.BRAND_ACCOUNTANT,
                ],
            },
            {
                title: 'Sản phẩm',
                icon: 'mdi-package-variant-closed',
                roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN],
                children: [
                    { title: 'Danh sách sản phẩm', to: 'admin:products' },
                    { title: 'Danh mục', to: 'admin:product-categories' },
                ],
            },
            {
                title: 'Cửa hàng',
                icon: 'mdi-store',
                to: 'admin:stores',
                roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN],
            },
        ],
    },

    // Nghiệp vụ
    {
        section: 'Nghiệp vụ',
        items: [
            {
                title: 'Bán hàng',
                icon: 'mdi-cart-outline',
                to: 'admin:sales',
                roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN, SYSTEM_ROLES.CASHIER],
            },
            {
                title: 'Đơn hàng',
                icon: 'mdi-clipboard-list-outline',
                to: 'admin:orders',
                roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN, SYSTEM_ROLES.CASHIER],
            },
        ],
    },

    // Báo cáo
    {
        section: 'Báo cáo',
        items: [
            {
                title: 'Doanh thu',
                icon: 'mdi-chart-line',
                to: 'admin:reports-revenue',
                roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN],
            },
            {
                title: 'Báo cáo ca',
                icon: 'mdi-calendar-clock',
                to: 'admin:reports-shift',
                roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN, SYSTEM_ROLES.CASHIER],
            },
            {
                title: 'Sản phẩm bán chạy',
                icon: 'mdi-fire',
                to: 'admin:reports-top-products',
                roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN],
            },
        ],
    },
]
