import { IMG } from './home.images'
import type {
    MenuTab,
    MenuItem,
    Benefit,
    ProcessStep,
    InvestRow,
    FaqItem,
} from '../types/home.types'

export const VALUES: string[] = [
    'Chất lượng',
    'Sáng tạo',
    'Minh bạch',
    'Đồng hành',
    'Bền vững',
    'Tối giản',
]

export const MENU_TABS: MenuTab[] = [
    { id: 'milk-tea', name: 'Trà Sữa' },
    { id: 'fruit', name: 'Trà Trái Cây' },
    { id: 'matcha', name: 'Matcha' },
    { id: 'fresh', name: 'Fresh & Cà Phê' },
]

export const ALL_MENU: MenuItem[] = [
    {
        cat: 'milk-tea',
        imgUrl: IMG.olong_hanh_nhan,
        name: 'Olong Hạnh Nhân',
        desc: 'Trà olong tô quý, hạnh nhân, sữa',
        price: '23K',
    },
    {
        cat: 'milk-tea',
        imgUrl: IMG.olong_hat_phi,
        name: 'Olong Hạt Phỉ',
        desc: 'Trà olong tô quý, hạt phỉ, sữa',
        price: '23K',
    },
    {
        cat: 'milk-tea',
        imgUrl: IMG.tam_gao,
        name: 'Tấm Gạo',
        desc: 'Trà olong tấm gạo, sữa',
        price: '20K',
    },
    {
        cat: 'milk-tea',
        imgUrl: IMG.phuc_long,
        name: 'Phúc Long',
        desc: 'Trà đen nguyên lá, sữa',
        price: '20K',
    },
    {
        cat: 'milk-tea',
        imgUrl: IMG.olong_sua,
        name: 'Olong Sữa',
        desc: 'Trà olong tô quý, sữa thơm',
        price: '23K',
    },
    {
        cat: 'milk-tea',
        imgUrl: IMG.olong_nhai_sua,
        name: 'Olong Nhài Sữa',
        desc: 'Trà olong tô quý, sữa – thơm nhài đậm vị nguyên bản',
        price: '25K',
    },
    {
        cat: 'milk-tea',
        imgUrl: IMG.olong_kem_pho_mai,
        name: 'Olong Kem Phô Mai',
        desc: 'Olong tô quý, thạch aiyu, kem Phô mai',
        price: '23K',
    },
    {
        cat: 'milk-tea',
        imgUrl: IMG.olong_rang_kem_pho_mai,
        name: 'Olong Rang Kem Phô Mai',
        desc: 'Olong rang, hạt sen, thạch aiyu, kem Phô mai',
        price: '26K',
    },
    {
        cat: 'fruit',
        imgUrl: IMG.thanh_tra_phuc_bon_tu,
        name: 'Thanh Trà Phúc Bổn Tử',
        desc: 'Trà xanh hoa nhài kết hợp phúc bổn tử, thạch aiyu, đậm vị trà',
        price: '22K',
    },
    {
        cat: 'fruit',
        imgUrl: IMG.sen_long_nhan,
        name: 'Sen Long Nhãn',
        desc: 'Trà sen kết hợp với vải nhãn, hạt sen, nhãn quả, thạch aiyu',
        price: '30K',
    },
    {
        cat: 'fruit',
        imgUrl: IMG.vai_lai_sen_olong,
        name: 'Vải Lài / Sen / Olong',
        desc: 'Trà kết hợp sen hoặc olong với vải, đậm vị trà, thạch aiyu',
        price: '30K',
    },
    {
        cat: 'fruit',
        imgUrl: IMG.tra_xoai_machiato,
        name: 'Trà Xoài Machiato',
        desc: 'Lục trà xanh, hạt sen, xoài tô quý, thạch aiyu, kem Phô mai',
        price: '27K',
    },
    {
        cat: 'matcha',
        imgUrl: IMG.olong_sua,
        name: 'Matcha Latte',
        desc: 'Sữa tươi kết hợp với matcha nhật thượng hạng',
        price: '29K',
    },
    {
        cat: 'matcha',
        imgUrl: IMG.olong_kem_pho_mai,
        name: 'Matcha Latte Kem Cheese',
        desc: 'Sữa tươi kết hợp với matcha nhật, thêm lớp kem cheese',
        price: '33K',
    },
    {
        cat: 'fresh',
        imgUrl: IMG.sua_tuoi_tran_chau,
        name: 'Sữa Tươi Trân Châu',
        desc: 'Sữa tươi, trân châu đường đen',
        price: '25K',
    },
    {
        cat: 'fresh',
        imgUrl: IMG.sua_dua_suong_sao,
        name: 'Sữa Dừa Sương Sáo',
        desc: 'Sữa hạnh, cà phê, sương sáo, hạt sen',
        price: '27K',
    },
    {
        cat: 'fresh',
        imgUrl: IMG.phindi_hanh_nhan,
        name: 'Phindi Hạnh Nhân',
        desc: 'Sữa tươi, cà phê, hạnh nhân, thạch cà phê',
        price: '27K',
    },
    {
        cat: 'fresh',
        imgUrl: IMG.olong_sua_dua,
        name: 'Olong Sữa Dừa',
        desc: 'Trà olong kết hợp sữa dừa thơm mát',
        price: '23K',
    },
]

export const BENEFITS: Benefit[] = [
    {
        num: '01',
        title: 'Mô hình bền vững',
        desc: 'Lợi nhuận ổn định từ 5–7 năm với quy trình đã chuẩn hóa',
    },
    {
        num: '02',
        title: 'Vốn thấp – Hoàn vốn nhanh',
        desc: 'Chỉ từ 150–250 triệu, giúp bạn nhanh chóng bắt đầu kinh doanh',
    },
    {
        num: '03',
        title: 'Bảo hộ khu vực',
        desc: 'Đảm bảo không cạnh tranh chéo bán kính 2km (TP lớn) – 3km (TP nhỏ)',
    },
    {
        num: '04',
        title: 'Hỗ trợ trọn gói',
        desc: 'Đào tạo A–Z, tư vấn thiết kế, chuyển giao công thức, hỗ trợ khai trương',
    },
    {
        num: '05',
        title: 'Mặt bằng linh hoạt',
        desc: 'Không yêu cầu mặt bằng quá lớn, phù hợp với nhiều địa điểm',
    },
    {
        num: '06',
        title: 'Tỉ lệ thành công 80%',
        desc: 'Rủi ro được giảm thiểu đáng kể với hệ thống hỗ trợ chuyên nghiệp',
    },
]

export const STEPS: ProcessStep[] = [
    {
        title: 'Tư vấn ban đầu',
        desc: 'Trao đổi thông tin, mô hình kinh doanh và điều khoản để hiểu rõ',
    },
    { title: 'Khảo sát khu vực', desc: 'Trao đổi vị trí mặt bằng, kiểm tra điều kiện khoảng cách' },
    { title: 'Hợp đồng chính thức', desc: 'Ký hợp đồng và thanh toán 100% phí nhượng quyền' },
    {
        title: 'Đào tạo & chuyển giao',
        desc: 'Đào tạo trực tiếp tại cửa hàng, chuyển giao toàn bộ quy trình',
    },
    {
        title: 'Setup & Khai trương',
        desc: 'Thiết kế, thi công, setup quy trình khai trương, bàn giao kinh doanh',
    },
    {
        title: 'Đồng hành bền vững',
        desc: 'Tư vấn thường xuyên và kiểm soát chất lượng để duy trì tiêu chuẩn',
    },
]

export const INVEST_ROWS: InvestRow[] = [
    { name: 'Dụng cụ và máy móc pha chế', amount: '48.000.000 đ' },
    { name: 'Bảng hiệu', amount: '15.000.000 đ' },
    { name: 'Quầy pha chế', amount: '20.000.000 đ' },
    { name: 'Nội thất decor + sơn sửa quán', amount: '15.000.000 đ' },
    { name: 'Điện nước + camera + wifi', amount: '10.000.000 đ' },
    { name: 'Dự trù nguyên liệu ban đầu', amount: '20.000.000 đ' },
    { name: 'Phí nhượng quyền', amount: '50.000.000 đ' },
    { name: 'Tiền thuê mặt bằng (2 tháng + cọc)', amount: '45.000.000 đ' },
]

export const FAQS: FaqItem[] = [
    {
        q: 'Tôi không có kinh nghiệm F&B, có làm được không?',
        a: 'Được! Quy trình đã chuẩn hóa, đào tạo chi tiết A–Z, phù hợp cả người mới bắt đầu.',
    },
    {
        q: 'Tôi đang có sẵn mặt bằng — có thể tự setup không?',
        a: 'Soli hỗ trợ linh hoạt theo thực tế mặt bằng, tư vấn thiết kế và thiết bị phù hợp, vẫn đảm bảo đúng bộ nhận diện thương hiệu.',
    },
    {
        q: 'Tôi có phải nhập nguyên liệu từ Soli không?',
        a: 'Soli cung cấp một số loại nguyên liệu đơn giản. Soli ưu tiên sự linh hoạt — bạn có thể nhập từ nhà cung cấp uy tín tại địa phương những nguyên liệu Soli không yêu cầu, miễn đảm bảo tiêu chuẩn chất lượng.',
    },
    {
        q: 'Bao lâu thì hoàn vốn?',
        a: 'Trung bình 2–4 tháng, tùy vào vị trí và cách vận hành. Soli sẽ hỗ trợ tính toán điểm hòa vốn cụ thể trong quá trình tư vấn.',
    },
    {
        q: 'Chi phí đầu tư ban đầu khoảng bao nhiêu?',
        a: 'Tùy vào quy mô quán, trung bình từ 120–250 triệu đồng (gồm cả phí nhượng quyền + setup quán + nguyên vật liệu khai trương).',
    },
    {
        q: 'Có hợp đồng cam kết gì không?',
        a: 'Có. Hợp đồng minh bạch, có điều khoản rõ ràng về quyền lợi và trách nhiệm hai bên.',
    },
]
