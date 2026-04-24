export interface MenuItem {
    cat: string
    imgUrl: string | undefined
    name: string
    desc: string
    price: string
}

export interface MenuTab {
    id: string
    name: string
}

export interface Benefit {
    num: string
    title: string
    desc: string
}

export interface ProcessStep {
    title: string
    desc: string
}

export interface InvestRow {
    name: string
    amount: string
}

export interface FaqItem {
    q: string
    a: string
}

export interface ContactForm {
    name: string
    phone: string
    city: string
    message: string
}
