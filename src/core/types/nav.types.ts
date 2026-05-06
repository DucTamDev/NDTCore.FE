export interface MenuItemBadge {
    text: string
    color: string
}

export interface MenuItem {
    title: string
    icon?: string
    to?: string
    roles?: string[]
    badge?: MenuItemBadge
    children?: MenuItem[]
}

export interface MenuSection {
    section: string
    items: MenuItem[]
}

export type MenuEntry = MenuItem | MenuSection

export function isMenuSection(entry: MenuEntry): entry is MenuSection {
    return 'section' in entry
}
