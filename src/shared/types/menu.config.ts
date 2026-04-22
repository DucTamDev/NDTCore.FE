import type { MenuItem } from './menu.types'

export const menuConfig: MenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        to: '/dashboard',
    },
    {
        title: 'Products',
        icon: 'mdi-package-variant',
        children: [
            {
                title: 'All Products',
                to: '/products',
            },
            {
                title: 'Create Product',
                to: '/products/create',
            },
            {
                title: 'Categories',
                to: '/products/categories',
            },
        ],
    },
    {
        title: 'Orders',
        icon: 'mdi-shopping',
        to: '/orders',
        badge: {
            text: '5',
            color: 'error',
        },
    },
    {
        title: 'Customers',
        icon: 'mdi-account-group',
        to: '/customers',
    },
    {
        title: 'Analytics',
        icon: 'mdi-chart-line',
        to: '/analytics',
    },
    {
        title: 'Settings',
        icon: 'mdi-cog',
        children: [
            {
                title: 'General',
                to: '/settings/general',
            },
            {
                title: 'Users',
                to: '/settings/users',
            },
        ],
    },
]
