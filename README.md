# BÀI KIỂM TRA GIỮA KỲ - HỌC PHẦN CSE122

> **Học phần:** Phát triển ứng dụng Web cơ bản - CSE122  
> **Đề tài BTL:** CareRoute - Điều hướng dịch vụ chăm sóc sức khỏe (BTL-03)  
> **Trang thực hiện:** Quản lý Dịch vụ Cơ sở Y tế (Facility Service Management)  
> **Sinh viên thực hiện:** SV2 (Phụ trách giao diện & nghiệp vụ Cơ sở y tế)  
> **Họ và tên:** _(Điền họ và tên của bạn)_  
> **Mã sinh viên:** _(Điền mã sinh viên của bạn)_  
> **Lớp:** _(Điền mã lớp)_

---

## 1. THÔNG TIN BÀI NỘP (3 LINK BẮT BUỘC)

| STT | Nội dung                                              | Đường dẫn (Link)                                                                                  |
| :-: | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
|  1  | **Link Figma**                                        | https://www.figma.com/design/VQF430OptRQQVL2OvdsIwY/Untitled?node-id=0-1&p=f&t=lXfHw3kO2ex9AWPY-0 |
|  2  | **Link GitHub cá nhân**                               | https://github.com/butmai093-source                                                               |
|  3  | **Link Video trình bày** https://youtu.be/o9CfvkoFGuA |

> **Quy chuẩn đặt tên video:**  
> CSE122-GK-SV02-[HoVaTen]-FacilityGuidanceManagement  
> _(Ví dụ: CSE122-GK-SV02-NguyenVanA-FacilityGuidanceManagement)_

---

## 2. GIỚI THIỆU TRANG WEB

### 2.1. Tên trang

**Quản Lý Dịch Vụ Cơ Sở Y Tế** (Facility Guidance Management - file index.html)

### 2.2. Đối tượng sử dụng

Nhân viên quản trị, điều phối viên hoặc nhân sự phụ trách danh mục y tế tại các cơ sở khám chữa bệnh (bệnh viện, phòng khám, trung tâm y tế).

### 2.3. Mục đích của trang

- Giúp cơ sở y tế quản lý minh bạch danh mục dịch vụ kỹ thuật, khám bệnh, xét nghiệm và chẩn đoán hình ảnh.
- Hỗ trợ thiết lập giá dịch vụ niêm yết, thời lượng thực hiện dự kiến và mô tả chỉ định.
- Cho phép bật/tắt trạng thái hoạt động hoặc lưu trữ dịch vụ để dữ liệu điều hướng của hệ thống **CareRoute** luôn chính xác, giúp người dân dễ dàng tra cứu trước khi đến khám.

---

## 3. CÁC CHỨC NĂNG CHÍNH

1. **Hiển thị và thống kê danh mục dịch vụ:**
   - Đọc dữ liệu động từ mảng JavaScript và đồng bộ hóa tức thời với localStorage.
   - Hiển thị trực quan theo dạng bảng gồm: Tên dịch vụ kèm mô tả, Danh mục, Giá tiền (được format chuẩn VND), Thời lượng dự kiến, Badge trạng thái có màu nhận diện.
   - Hiển thị số lượng bản ghi thực tế đang hiển thị (X dịch vụ đang hiển thị).

2. **Tìm kiếm thời gian thực (Real-time Search):**
   - Tìm kiếm linh hoạt không phân biệt chữ hoa/thường theo tên dịch vụ, mô tả dịch vụ hoặc danh mục.
   - Tự động cập nhật bảng ngay khi người dùng gõ phím (input event).

3. **Lọc dữ liệu đa tiêu chí (Filter):**
   - Lọc theo **Danh mục**: Tất cả, Chẩn đoán hình ảnh, Khám bệnh, Xét nghiệm, Thăm dò chức năng.
   - Lọc theo **Trạng thái**: Tất cả hiện tại, Đang hoạt động (ctive), Tạm ngưng (inactive), Đã lưu trữ (rchived).

4. **Thêm mới dịch vụ (Create):**
   - Mở cửa sổ Modal popup tiện lợi khi nhấn nút + Thêm dịch vụ mới.
   - Tự động sinh mã định danh duy nhất (UUID hoặc timestamp ngẫu nhiên).
   - Đưa bản ghi mới lên đầu danh sách và lưu vào localStorage.

5. **Chỉnh sửa dịch vụ (Update):**
   - Nhấn icon bút chỉnh sửa tại mỗi hàng để nạp toàn bộ thông tin cũ vào Form Modal.
   - Cập nhật thông tin nhanh chóng và phản ánh ngay lên giao diện.

6. **Lưu trữ & Khôi phục dịch vụ (Archive / Restore):**
   - Cho phép tạm thời cất trữ dịch vụ không còn cung cấp kèm hộp thoại xác nhận an toàn (window.confirm).
   - Có bộ lọc xem danh sách dịch vụ đã lưu trữ và nút khôi phục (Restore) trở lại hoạt động bình thường.

7. **Kiểm tra tính hợp lệ dữ liệu (Form Validation):**
   - Bắt buộc nhập tên dịch vụ (không được để trống khoảng trắng).
   - Bắt buộc chọn danh mục phù hợp.
   - Giá dịch vụ phải là số nguyên dương hợp lệ (> 0).
   - Thời lượng khám phải từ 1 đến 1440 phút (nếu có nhập).
   - Báo lỗi ngay dưới từng ô nhập liệu với viền đỏ nổi bật và tự động focus vào trường sai.

8. **Trải nghiệm người dùng cao cấp (UX / UI):**
   - Thông báo Toast sinh động góc phải màn hình sau mỗi thao tác thêm, sửa, lưu trữ.
   - Hỗ trợ phím tắt Escape để thoát nhanh modal, quản lý bẫy focus (Trap Focus) khi dùng phím Tab.
   - Hiển thị khối Empty State khi không có dữ liệu phù hợp với từ khóa tìm kiếm.

---

## 4. CÔNG NGHỆ SỬ DỤNG

- **HTML5:**
  - Cấu trúc chuẩn ngữ nghĩa Semantic Web (<aside>, <header>, <nav>, <main>, <section>, <table>, <form>).
  - Đầy đủ thuộc tính trợ năng Accessibility: ria-label, ria-modal,
    ole=dialog, ria-live.
- **CSS3:**
  - Hệ thống biến CSS (Design Tokens: màu sắc, typography, spacing, border-radius, shadows).
  - Bố cục hiện đại kết hợp linh hoạt giữa **CSS Flexbox** và **CSS Grid**.
  - Hiệu ứng chuyển động mượt mà ( ransition, nimation cho modal, hover effects).
  - **Responsive Design** tối ưu trên mọi độ phân giải: Desktop lớn (>1200px), Laptop/Tablet (860px), Điện thoại thông minh (dưới 640px).
- **JavaScript (Vanilla JS ES6+):**
  - Mô hình IIFE đóng gói phạm vi tránh xung đột biến toàn cục (use strict).
  - Thao tác DOM thuần (document.createElement,
    eplaceChildren, querySelector).
  - Quản lý sự kiện hiệu quả với Event Delegation.
  - Lưu trữ dữ liệu phía client với window.localStorage.
  - Định dạng tiền tệ với Intl.NumberFormat(vi-VN).

---

## 5. CẤU TRÚC THƯ MỤC DỰ ÁN

`	ext
KiemTraGiuaKy/
├── index.html          # Trang HTML chính ngữ nghĩa (Semantic HTML)
├── css/
│   └── style.css       # Toàn bộ CSS giao diện, token và media query responsive
├── js/
│   └── main.js         # Toàn bộ mã nguồn JavaScript xử lý tương tác, CRUD, lọc, validation
├── assets/
│   ├── icons/          # Bộ icon vector SVG sắc nét cho giao diện
│   ├── images/         # Hình ảnh minh họa y tế
│   └── data/           # Các tệp JSON tham khảo
└── README.md           # Tài liệu báo cáo chi tiết bài kiểm tra giữa kỳ
`

---

## 6. HƯỚNG DẪN CHẠY THỬ TRANG WEB

1. **Cách 1 - Mở trực tiếp:**
   - Nhấp đúp chuột vào tệp index.html trong thư mục KiemTraGiuaKy để mở trực tiếp trên trình duyệt Chrome, Edge, Firefox, Cốc Cốc.
2. **Cách 2 - Dùng VS Code Live Server:**
   - Mở thư mục KiemTraGiuaKy bằng VS Code.
   - Nhấp chuột phải vào index.html và chọn **Open with Live Server**.

---

## 7. GỢI Ý KỊCH BẢN QUAY VIDEO TRÌNH BÀY (03 PHÚT)

| Thời lượng                                                      | Phân đoạn                  | Nội dung cần nói và thao tác                                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **00:00 - 00:30** _(30s)_                                       | **1. Giới thiệu**          | - Chào thầy/cô, giới thiệu bản thân (Họ tên, MSSV, vai trò SV2 trong nhóm đề tài CareRoute).<br>- Giới thiệu tên trang: _Quản lý Dịch vụ Cơ sở Y tế_.<br>- Mục đích: Giúp nhân viên y tế cập nhật giá, trạng thái, danh mục dịch vụ chính xác cho người dân tra cứu.                                             |
| **00:30 - 01:00** _(30s)_                                       | **2. Figma**               | - Mở giao diện Figma thiết kế trang Quản lý Dịch vụ.<br>- Giới thiệu bố cục: Sidebar điều hướng bên trái, Header trên cùng, Bộ lọc tìm kiếm và bảng danh sách dịch vụ kèm Modal thêm/sửa.<br>- Cho thấy phương án responsive trên màn hình nhỏ.                                                                  |
| **01:00 - 01:30** _(30s)_                                       | **3. So khớp sản phẩm**    | - Mở trang web index.html đang chạy trên trình duyệt.<br>- Đối chiếu giao diện thực tế với bản vẽ Figma (màu sắc tone xanh y tế #559b8f, font chữ Be Vietnam Pro, độ sắc nét của icon và bố cục card).                                                                                                           |
| **01:30 - 02:30** _(60s)_                                       | **4. Giới thiệu mã nguồn** | - Mở VS Code:<br> + **HTML:** Chỉ ra các thẻ semantic <aside>, <nav>, <main>, <header>, <table>, <form>, <dialog> modal.<br> + **CSS:** Chỉ ra việc tổ chức CSS tokens, Flexbox/Grid và các khối @media xử lý Responsive.<br> + **JS:** Chỉ ra mảng dữ liệu services, các hàm                                    |
| enderServices(), alidateForm(), và cơ chế lưu trữ localStorage. |
| **02:30 - 03:00** _(30s)_                                       | **5. Trình diễn (Demo)**   | - Thực hiện trực tiếp trên trình duyệt:<br> 1. Gõ tìm kiếm dịch vụ MRI hoặc Khám.<br> 2. Lọc theo danh mục Xét nghiệm.<br> 3. Nhấn + Thêm dịch vụ mới, cố tình để trống để xem báo lỗi Validation.<br> 4. Điền đầy đủ dữ liệu -> Nhấn Lưu -> Toast thông báo thành công và dữ liệu xuất hiện ngay trên đầu bảng. |

---

## 8. CÂU HỎI VẤN ĐÁP THƯỜNG GẶP & CÂU TRẢ LỜI NHANH

- **Q1: Vì sao lại dùng
  eplaceChildren() hoặc createElement() thay vì gán toàn bộ innerHTML?**  
   _Trả lời:_ Dùng DOM API giúp chống tấn công XSS (Cross-Site Scripting) khi chèn dữ liệu text từ người dùng, đồng thời tối ưu hiệu năng và dễ gắn event listeners.
- **Q2: Logic tìm kiếm hoạt động như thế nào?**  
  _Trả lời:_ Sử dụng phương thức .filter() trên mảng services, chuyển chuỗi về chữ thường có dấu với .toLocaleLowerCase(vi) và dùng .includes() để so khớp với từ khóa người dùng nhập.
- **Q3: Cơ chế Responsive được xử lý ở đâu?**  
  _Trả lời:_ Xử lý trong css/style.css thông qua các media query @media (max-width: 860px) và @media (max-width: 640px). Khi vào màn hình điện thoại, Sidebar chuyển thành thanh ngang trên đầu hoặc thu gọn nhãn text chỉ giữ lại icon, bảng tự động có thanh cuộn ngang able-scroll để không vỡ bố cục.
