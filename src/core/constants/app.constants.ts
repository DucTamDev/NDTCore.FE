export const APP_NAME = import.meta.env.VITE_APP_NAME || 'NDTCore'

export const SYSTEM_ROLES = {
    SUPER_ADMIN: 'SuperAdmin',
    ORG_ADMIN: 'OrgAdmin',
    BRAND_MANAGER: 'BrandManager',
    BRAND_ACCOUNTANT: 'BrandAccountant',
    FRANCHISEE_OWNER: 'FranchiseeOwner',
    STORE_MANAGER: 'StoreManager',
    CASHIER: 'Cashier',
    ORDER_STAFF: 'OrderStaff',
    ORG_USER: 'OrgUser',
    CUSTOMER: 'Customer',
    GUEST: 'Guest',
    INTEGRATION: 'Integration',
} as const

export const SYSTEM_PERMISSIONS = {
    ORG: {
        READ_ORG: 'Org.Read.All',
        CREATE_ORG: 'Org.Create.All',
        UPDATE_ORG: 'Org.Update.All',
        DELETE_ORG: 'Org.Delete.All',
        USER: {
            READ_USER: 'OrgUser.Read.All',
            CREATE_USER: 'OrgUser.Create.All',
            UPDATE_USER: 'OrgUser.Update.All',
            DISABLE_USER: 'OrgUser.Disable.All',
            RESET_USER_PASSWORD: 'OrgUser.ResetPassword.All',
        },
        ROLE: {
            READ_ROLE: 'OrgRole.Read.All',
            ASSIGN_ROLE: 'OrgRole.Assign.All',
            REMOVE_ROLE: 'OrgRole.Remove.All',
        },
        SETTING: {
            READ_SETTING: 'OrgSetting.Read.All',
            UPDATE_SETTING: 'OrgSetting.Update.All',
        },
        BILLING: {
            READ_BILLING: 'OrgBilling.Read.All',
            UPDATE_BILLING: 'OrgBilling.Update.All',
        },
    },
    BRAND: {
        READ_BRAND: 'Brand.Read.All',
        CREATE_BRAND: 'Brand.Create.All',
        UPDATE_BRAND: 'Brand.Update.All',
        DELETE_BRAND: 'Brand.Delete.All',
        MEMBER: {
            READ_BRAND_MEMBER: 'BrandMember.Read.All',
            ASSIGN_BRAND_MEMBER: 'BrandMember.Assign.All',
            REMOVE_BRAND_MEMBER: 'BrandMember.Remove.All',
        },
        AGREEMENT: {
            READ_BRAND_AGREEMENT: 'BrandAgreement.Read.All',
            CREATE_BRAND_AGREEMENT: 'BrandAgreement.Create.All',
            UPDATE_BRAND_AGREEMENT: 'BrandAgreement.Update.All',
            DELETE_BRAND_AGREEMENT: 'BrandAgreement.Delete.All',
        },
        REPORT: {
            READ_BRAND_REPORT: 'BrandReport.Read.All',
        },
    },
    FRANCHISEE: {
        CREATE_FRANCHISEE: 'Franchisee.Create.All',
        READ_FRANCHISEE: 'Franchisee.Read.All',
        UPDATE_FRANCHISEE: 'Franchisee.Update.All',
        DISABLE_FRANCHISEE: 'Franchisee.Disable.All',
        MEMBER: {
            READ_FRANCHISEE_MEMBER: 'FranchiseeMember.Read.All',
            ASSIGN_FRANCHISEE_MEMBER: 'FranchiseeMember.Assign.All',
            REMOVE_FRANCHISEE_MEMBER: 'FranchiseeMember.Remove.All',
        },
        REPORT: {
            READ_FRANCHISEE_REPORT: 'FranchiseeReport.Read.All',
        },
    },
    STORE: {
        READ_STORE: 'Store.Read.All',
        CREATE_STORE: 'Store.Create.All',
        UPDATE_STORE: 'Store.Update.All',
        DISABLE_STORE: 'Store.Disable.All',
        MEMBER: {
            READ_STORE_MEMBER: 'StoreMember.Read.All',
            ASSIGN_STORE_MEMBER: 'StoreMember.Assign.All',
            REMOVE_STORE_MEMBER: 'StoreMember.Remove.All',
        },
        MENU: {
            READ_STORE_MENU: 'StoreMenu.Read.All',
            UPDATE_STORE_MENU: 'StoreMenu.Update.All',
        },
        OPERATING_HOUR: {
            READ_OPERATING_HOUR: 'StoreOperatingHour.Read.All',
            UPDATE_OPERATING_HOUR: 'StoreOperatingHour.Update.All',
        },
        REPORT: {
            READ_STORE_REPORT: 'StoreReport.Read.All',
        },
    },
    PRODUCT: {
        READ_PRODUCT: 'Product.Read.All',
        CREATE_PRODUCT: 'Product.Create.All',
        UPDATE_PRODUCT: 'Product.Update.All',
        DELETE_PRODUCT: 'Product.Delete.All',
        DISABLE_PRODUCT: 'Product.Disable.All',
        CATEGORY: {
            READ_CATEGORY: 'ProductCategory.Read.All',
            CREATE_CATEGORY: 'ProductCategory.Create.All',
            UPDATE_CATEGORY: 'ProductCategory.Update.All',
            DELETE_CATEGORY: 'ProductCategory.Delete.All',
        },
        OPTION: {
            READ_OPTION: 'ProductOption.Read.All',
            CREATE_OPTION: 'ProductOption.Create.All',
            UPDATE_OPTION: 'ProductOption.Update.All',
            DELETE_OPTION: 'ProductOption.Delete.All',
        },
        TAG: {
            READ_TAG: 'ProductTag.Read.All',
            CREATE_TAG: 'ProductTag.Create.All',
            UPDATE_TAG: 'ProductTag.Update.All',
            DELETE_TAG: 'ProductTag.Delete.All',
        },
        STORE_OVERRIDE: {
            READ_STORE_OVERRIDE: 'ProductStoreOverride.Read.All',
            UPDATE_STORE_OVERRIDE: 'ProductStoreOverride.Update.All',
        },
    },
    ORDER: {
        READ_ORDER: 'Order.Read.All',
        CREATE_ORDER: 'Order.Create.All',
        UPDATE_ORDER: 'Order.Update.All',
        DELETE_ORDER: 'Order.Delete.All',
        PAYMENT: {
            CREATE_PAYMENT: 'OrderPayment.Create.All',
            DELETE_PAYMENT: 'OrderPayment.Delete.All',
        },
        SHIFT: {
            READ_SHIFT: 'OrderShift.Read.All',
            CREATE_SHIFT: 'OrderShift.Create.All',
            UPDATE_SHIFT: 'OrderShift.Update.All',
        },
        RECEIPT: {
            READ_RECEIPT: 'OrderReceipt.Read.All',
        },
    },
    ANALYTICS: {
        READ_ANALYTICS: 'Analytics.Read.All',
        REVENUE: {
            READ_REVENUE: 'AnalyticsRevenue.Read.All',
        },
        PRODUCT_ANALYTICS: {
            READ_PRODUCT_ANALYTICS: 'AnalyticsProduct.Read.All',
        },
        CUSTOMER: {
            READ_CUSTOMER_ANALYTICS: 'AnalyticsCustomer.Read.All',
        },
        ROYALTY_ANALYTICS: {
            READ_ROYALTY_ANALYTICS: 'AnalyticsRoyalty.Read.All',
        },
        STORE_ANALYTICS: {
            READ_STORE_ANALYTICS: 'AnalyticsStore.Read.All',
        },
    },
    ROYALTY: {
        READ_ROYALTY: 'Royalty.Read.All',
        INVOICE: {
            READ_ROYALTY_INVOICE: 'RoyaltyInvoice.Read.All',
            CREATE_ROYALTY_INVOICE: 'RoyaltyInvoice.Create.All',
            UPDATE_ROYALTY_INVOICE: 'RoyaltyInvoice.Update.All',
            DELETE_ROYALTY_INVOICE: 'RoyaltyInvoice.Delete.All',
        },
    },
    INTEGRATION: {
        MANAGE_INTEGRATION: 'Integration.Manage.All',
        ACCOUNTING: {
            MANAGE_ACCOUNTING: 'IntegrationAccounting.Manage.All',
        },
        MARKETING: {
            MANAGE_MARKETING: 'IntegrationMarketing.Manage.All',
        },
        WEBHOOK: {
            MANAGE_WEBHOOK: 'IntegrationWebhook.Manage.All',
        },
    },
} as const

export const DEFAULT_PAGINATION = {
    PAGE: 1,
    LIMIT: 10,
    LIMIT_OPTIONS: [10, 25, 50, 100],
} as const

export const CONFIRM_DIALOG_DEFAULTS = {
    CONFIRM_TEXT: 'Xác nhận',
    CANCEL_TEXT: 'Hủy',
    CONFIRM_COLOR: 'error',
} as const
