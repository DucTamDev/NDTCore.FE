import type { MenuEntry } from '@/core/types/_index'
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
                title: 'Nhà nhượng quyền',
                icon: 'mdi-handshake-outline',
                to: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME,
                roles: [
                    SYSTEM_ROLES.SUPER_ADMIN,
                    SYSTEM_ROLES.ORG_ADMIN,
                    SYSTEM_ROLES.BRAND_MANAGER,
                ],
            },
            {
                title: 'Sản phẩm',
                icon: 'mdi-package-variant-closed',
                roles: [SYSTEM_ROLES.SUPER_ADMIN, SYSTEM_ROLES.ORG_ADMIN, SYSTEM_ROLES.BRAND_MANAGER],
                children: [
                    {
                        title: 'Danh sách sản phẩm',
                        icon: 'mdi-food-variant',
                        to: APP_ROUTES.PRODUCT.PRODUCTS.NAME,
                    },
                    {
                        title: 'Danh mục',
                        icon: 'mdi-format-list-bulleted-type',
                        children: [
                            {
                                title: 'Nhóm danh mục',
                                to: APP_ROUTES.PRODUCT.CATEGORY_GROUPS.NAME,
                            },
                            {
                                title: 'Danh mục sản phẩm',
                                to: APP_ROUTES.PRODUCT.CATEGORIES.NAME,
                            },
                        ],
                    },
                    {
                        title: 'Nhãn',
                        icon: 'mdi-tag-multiple-outline',
                        to: APP_ROUTES.PRODUCT.TAGS.NAME,
                    },
                    {
                        title: 'Tùy chọn',
                        icon: 'mdi-tune-variant',
                        children: [
                            {
                                title: 'Nhóm tùy chọn',
                                to: APP_ROUTES.PRODUCT.OPTION_GROUPS.NAME,
                            },
                            {
                                title: 'Danh sách tùy chọn',
                                to: APP_ROUTES.PRODUCT.OPTIONS.NAME,
                            },
                        ],
                    },
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
                roles: [
                    SYSTEM_ROLES.SUPER_ADMIN,
                    SYSTEM_ROLES.ORG_ADMIN,
                    SYSTEM_ROLES.BRAND_MANAGER,
                    SYSTEM_ROLES.FRANCHISEE_OWNER,
                ],
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
                to: 'admin:reports-store-revenue',
                roles: [
                    SYSTEM_ROLES.SUPER_ADMIN,
                    SYSTEM_ROLES.ORG_ADMIN,
                    SYSTEM_ROLES.BRAND_MANAGER,
                    SYSTEM_ROLES.FRANCHISEE_OWNER,
                    SYSTEM_ROLES.STORE_MANAGER,
                    SYSTEM_ROLES.CASHIER,
                ],
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
