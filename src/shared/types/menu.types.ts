export interface MenuItem {
    title: string
    icon?: string
    to?: string
    permissions?: string[]
    badge?: {
        text: string
        color: string
    }
    children?: MenuItem[]
}
