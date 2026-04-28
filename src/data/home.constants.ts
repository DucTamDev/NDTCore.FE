import { IMG } from './home.images'
import type {
  Benefit,
  DrinkItem,
  FaqItem,
  InvestRow,
  MenuTab,
  ProcessStep,
} from '@/data/home.types'

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

export const ALL_MENU: DrinkItem[] = [
  { cat: 'milk-tea', imgUrl: IMG.olong_hanh_nhan, name: 'Olong Hạnh Nhân', desc: 'Trà olong, hạnh nhân, sữa', price: '23K' },
  { cat: 'milk-tea', imgUrl: IMG.olong_hat_phi, name: 'Olong Hạt Phỉ', desc: 'Trà olong, hạt phỉ, sữa', price: '23K' },
  { cat: 'milk-tea', imgUrl: IMG.tam_gao, name: 'Tấm Gạo', desc: 'Trà olong tấm gạo, sữa', price: '20K' },
  { cat: 'milk-tea', imgUrl: IMG.phuc_long, name: 'Phúc Long', desc: 'Trà đen nguyên lá, sữa', price: '20K' },
  { cat: 'milk-tea', imgUrl: IMG.olong_sua, name: 'Olong Sữa', desc: 'Trà olong, sữa thơm', price: '23K' },
  { cat: 'milk-tea', imgUrl: IMG.olong_nhai_sua, name: 'Olong Nhài Sữa', desc: 'Trà olong, sữa thơm nhài', price: '25K' },
  { cat: 'milk-tea', imgUrl: IMG.olong_kem_pho_mai, name: 'Olong Kem Phô Mai', desc: 'Olong, thạch aiyu, kem phô mai', price: '23K' },
  { cat: 'milk-tea', imgUrl: IMG.olong_rang_kem_pho_mai, name: 'Olong Rang Kem Phô Mai', desc: 'Olong rang, hạt sen, thạch aiyu, kem phô mai', price: '26K' },
  { cat: 'fruit', imgUrl: IMG.thanh_tra_phuc_bon_tu, name: 'Thanh Trà Phúc Bồn Tử', desc: 'Trà xanh hoa nhài, phúc bồn tử, thạch aiyu', price: '22K' },
  { cat: 'fruit', imgUrl: IMG.sen_long_nhan, name: 'Sen Long Nhãn', desc: 'Trà sen, hạt sen, nhãn quả, thạch aiyu', price: '30K' },
  { cat: 'fruit', imgUrl: IMG.vai_lai_sen_olong, name: 'Vải Lài / Sen / Olong', desc: 'Trà sen hoặc olong kết hợp vải, thạch aiyu', price: '30K' },
  { cat: 'fruit', imgUrl: IMG.tra_xoai_machiato, name: 'Trà Xoài Machiato', desc: 'Lục trà xanh, hạt sen, xoài, thạch aiyu, kem phô mai', price: '27K' },
  { cat: 'matcha', imgUrl: IMG.olong_sua, name: 'Matcha Latte', desc: 'Sữa tươi kết hợp matcha Nhật thượng hạng', price: '29K' },
  { cat: 'matcha', imgUrl: IMG.olong_kem_pho_mai, name: 'Matcha Latte Kem Cheese', desc: 'Sữa tươi kết hợp matcha Nhật cùng lớp kem cheese', price: '33K' },
  { cat: 'fresh', imgUrl: IMG.sua_tuoi_tran_chau, name: 'Sữa Tươi Trân Châu', desc: 'Sữa tươi, trân châu đường đen', price: '25K' },
  { cat: 'fresh', imgUrl: IMG.sua_dua_suong_sao, name: 'Sữa Dừa Sương Sáo', desc: 'Sữa hạnh, cà phê, sương sáo, hạt sen', price: '27K' },
  { cat: 'fresh', imgUrl: IMG.phindi_hanh_nhan, name: 'Phindi Hạnh Nhân', desc: 'Sữa tươi, cà phê, hạnh nhân, thạch cà phê', price: '27K' },
  { cat: 'fresh', imgUrl: IMG.olong_sua_dua, name: 'Olong Sữa Dừa', desc: 'Trà olong kết hợp sữa dừa thơm mát', price: '23K' },
]

export const BENEFITS: Benefit[] = [
  { num: '01', title: 'Mô hình bền vững', desc: 'Lợi nhuận ổn định với quy trình đã chuẩn hóa.' },
  { num: '02', title: 'Vốn thấp - Hoàn vốn nhanh', desc: 'Chỉ từ 150 đến 250 triệu để khởi động.' },
  { num: '03', title: 'Bảo hộ khu vực', desc: 'Không cạnh tranh chéo trong bán kính phù hợp.' },
  { num: '04', title: 'Hỗ trợ trọn gói', desc: 'Đào tạo A-Z, setup và hỗ trợ khai trương.' },
  { num: '05', title: 'Mặt bằng linh hoạt', desc: 'Phù hợp nhiều diện tích và khu vực khác nhau.' },
  { num: '06', title: 'Tỷ lệ thành công cao', desc: 'Rủi ro thấp hơn nhờ vận hành chuẩn hóa.' },
]

export const STEPS: ProcessStep[] = [
  { title: 'Tư vấn ban đầu', desc: 'Trao đổi mô hình kinh doanh và điều khoản.' },
  { title: 'Khảo sát khu vực', desc: 'Kiểm tra vị trí mặt bằng và bán kính khai thác.' },
  { title: 'Hợp đồng chính thức', desc: 'Ký hợp đồng và hoàn tất phí nhượng quyền.' },
  { title: 'Đào tạo và chuyển giao', desc: 'Đào tạo trực tiếp tại cửa hàng.' },
  { title: 'Setup và khai trương', desc: 'Hoàn thiện thiết kế, thi công và chuẩn bị vận hành.' },
  { title: 'Đồng hành bền vững', desc: 'Theo dõi chất lượng và hỗ trợ tối ưu doanh thu.' },
]

export const INVEST_ROWS: InvestRow[] = [
  { name: 'Dụng cụ và máy móc pha chế', amount: '48.000.000 đ' },
  { name: 'Bảng hiệu', amount: '15.000.000 đ' },
  { name: 'Quầy pha chế', amount: '20.000.000 đ' },
  { name: 'Nội thất decor', amount: '15.000.000 đ' },
  { name: 'Điện nước + camera + wifi', amount: '10.000.000 đ' },
  { name: 'Nguyên liệu ban đầu', amount: '20.000.000 đ' },
  { name: 'Phí nhượng quyền', amount: '50.000.000 đ' },
  { name: 'Thuê mặt bằng', amount: '45.000.000 đ' },
]

export const FAQS: FaqItem[] = [
  { q: 'Tôi không có kinh nghiệm F&B, có làm được không?', a: 'Được. Mô hình đã chuẩn hóa và có đào tạo chi tiết.' },
  { q: 'Tôi đang có sẵn mặt bằng thì sao?', a: 'Đội ngũ sẽ khảo sát và tư vấn setup phù hợp với mặt bằng thực tế.' },
  { q: 'Có phải nhập nguyên liệu toàn bộ từ Soli không?', a: 'Chỉ các nhóm nguyên liệu cần đồng nhất chất lượng mới cần theo chuẩn Soli.' },
  { q: 'Bao lâu thì hoàn vốn?', a: 'Thông thường từ 2 đến 4 tháng tùy vị trí và cách vận hành.' },
  { q: 'Chi phí đầu tư ban đầu bao nhiêu?', a: 'Trung bình từ 120 đến 250 triệu đồng.' },
  { q: 'Có hợp đồng cam kết không?', a: 'Có. Điều khoản rõ ràng về quyền lợi và trách nhiệm của hai bên.' },
]
