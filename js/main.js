/**
 * ==========================================================================
 * DỰ ÁN: CareRoute - Quản Lý Dịch Vụ Cơ Sở Y Tế (Facility Service Management)
 * HỌC PHẦN: Phát triển ứng dụng Web cơ bản - CSE122
 * BÀI KIỂM TRA GIỮA KỲ
 * Tệp: js/main.js
 * ==========================================================================
 */

(() => {
  use strict;

  // --- 1. CẤU HÌNH VÀ DỮ LIỆU MẪU BAN ĐẦU ---
  const STORAGE_KEY = careroute.facility.services.v1;

  const initialServices = [
    {
      id: svc-mri,
      name: Chụp sọ não MRI,
      category: Chẩn đoán hình ảnh,
      price: 2500000,
      duration: 45,
      status: active,
      archived: false,
      description: Chụp cộng hưởng từ sọ não độ phân giải cao phát hiện sớm tổn thương thần kinh.
    },
    {
      id: svc-general,
      name: Khám sức khỏe tổng quát,
      category: Khám bệnh,
      price: 1200000,
      duration: 60,
      status: active,
      archived: false,
      description: Gói khám tổng quát định kỳ toàn diện dành cho người trưởng thành.
    },
    {
      id: svc-blood,
      name: Xét nghiệm máu cơ bản,
      category: Xét nghiệm,
      price: 350000,
      duration: 20,
      status: active,
      archived: false,
      description: Đánh giá công thức máu 18 chỉ số, đường huyết và chức năng gan thận.
    },
    {
      id: svc-ultrasound,
      name: Siêu âm ổ bụng,
      category: Chẩn đoán hình ảnh,
      price: 450000,
      duration: 30,
      status: inactive,
      archived: false,
      description: Siêu âm kiểm tra màu Doppler đánh giá các cơ quan nội tạng ổ bụng.
    },
    {
      id: svc-ecg,
      name: Điện tâm đồ (ECG),
      category: Thăm dò chức năng,
      price: 180000,
      duration: 15,
      status: active,
      archived: false,
      description: Ghi điện tâm đồ 12 chuyển đạo tầm soát rối loạn nhịp tim.
    }
  ];

  // --- 2. THAM CHIẾU CÁC PHẦN TỬ GIAO DIỆN (DOM Elements) ---
  const backdrop = document.getElementById(modalBackdrop);
  const modal = backdrop.querySelector(.modal);
  const form = document.getElementById(serviceForm);
  const nameInput = document.getElementById(serviceName);
  const categoryInput = document.getElementById(serviceCategory);
  const priceInput = document.getElementById(servicePrice);
  const durationInput = document.getElementById(serviceDuration);
  const statusInput = document.getElementById(serviceStatus);
  const descriptionInput = document.getElementById(serviceDescription);

  const searchInput = document.getElementById(searchInput);
  const categoryFilter = document.getElementById(categoryFilter);
  const statusFilter = document.getElementById(statusFilter);

  const rowsContainer = document.getElementById(serviceRows);
  const serviceCount = document.getElementById(serviceCount);
  const emptyState = document.getElementById(emptyState);
  const tableScroll = document.querySelector(.table-scroll);
  const toast = document.getElementById(toast);

  // Biến trạng thái nội bộ
  let services = loadServices();
  let toastTimer = null;
  let previouslyFocused = null;

  // --- 3. CÁC HÀM XỬ LÝ LƯU TRỮ (LocalStorage) ---

  /**
   * Tải danh sách dịch vụ từ LocalStorage. Nếu chưa có, sử dụng danh sách ban đầu.
   */
  function loadServices() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === null) {
        return initialServices.map((item) => ({ ...item }));
      }
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        throw new Error(Dữ liệu dịch vụ đã lưu không phải mảng hợp lệ.);
      }
      return parsed.map((item) => ({
        ...item,
        archived: item.archived === true
      }));
    } catch (error) {
      console.warn(Không thể tải dịch vụ từ localStorage. Sử dụng dữ liệu mẫu:, error);
      return initialServices.map((item) => ({ ...item }));
    }
  }

  /**
   * Lưu danh sách dịch vụ vào LocalStorage
   */
  function saveServices(nextServices) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextServices));
      return true;
    } catch (error) {
      console.error(Lỗi khi ghi dữ liệu vào LocalStorage:, error);
      showToast(Không thể lưu dữ liệu, Bộ nhớ trình duyệt có thể đã bị đầy hoặc bị chặn quyền.);
      return false;
    }
  }

  // --- 4. CÁC HÀM TIỆN ÍCH HIỂN THỊ (Utilities) ---

  /**
   * Định dạng số tiền sang chuẩn Việt Nam Đồng (VD: 2.500.000 ₫)
   */
  function formatPrice(value) {
    return new Intl.NumberFormat(vi-VN).format(value) +  ₫;
  }

  /**
   * Hiển thị thông báo Toast góc màn hình
   */
  function showToast(title, message) {
    document.getElementById(toastTitle).textContent = title;
    document.getElementById(toastMessage).textContent = message;
    toast.classList.add(visible);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove(visible);
    }, 3200);
  }

  /**
   * Tạo nút thao tác (Sửa, Lưu trữ, Khôi phục)
   */
  function createActionButton(label, iconName, serviceId, action) {
    const button = document.createElement(button);
    button.className = icon-button;
    if (action === archive) button.classList.add(archive);
    button.type = button;
    button.setAttribute(aria-label, ${label} dịch vụ);
    button.title = ${label} dịch vụ;
    button.dataset.action = action;
    button.dataset.id = serviceId;

    const icon = document.createElement(img);
    icon.className = icon;
    icon.src = ssets/icons/;
    icon.alt = label;

    button.appendChild(icon);
    return button;
  }

  // --- 5. RENDER DỮ LIỆU & BỘ LỌC (Rendering & Filtering) ---

  /**
   * Dựng danh sách dịch vụ vào bảng theo từ khóa tìm kiếm và các tiêu chí lọc
   */
  function renderServices() {
    const query = (searchInput.value || ").trim().toLocaleLowerCase(vi);
 const selectedCategory = categoryFilter.value;
 const selectedStatus = statusFilter.value;

 const filtered = services.filter((service) => {
 // 1. Lọc theo danh mục
 if (selectedCategory && service.category !== selectedCategory) {
 return false;
 }

 // 2. Lọc theo vòng đời/trạng thái
 if (selectedStatus === archived) {
 if (!service.archived) return false;
 } else {
 if (service.archived) return false;
 if (selectedStatus === active && service.status !== active) return false;
 if (selectedStatus === inactive && service.status !== inactive) return false;
 }

 // 3. Tìm kiếm theo từ khóa
 if (query) {
 const fullText = ${service.name} .toLocaleLowerCase(vi);
 if (!fullText.includes(query)) return false;
 }

 return true;
 });

 // Làm sạch bảng trước khi đổ dữ liệu mới
 rowsContainer.replaceChildren();

 // Render từng hàng
 filtered.forEach((service) => {
 const row = document.createElement(tr);

 // Cột 1: Tên dịch vụ & mô tả
 const nameCell = document.createElement(td);
 const name = document.createElement(span);
 name.className = service-title;
 name.textContent = service.name;
 nameCell.appendChild(name);

 if (service.description) {
 const desc = document.createElement(span);
 desc.className = service-description;
 desc.textContent = service.description;
 nameCell.appendChild(desc);
 }

 // Cột 2: Danh mục
 const categoryCell = document.createElement(td);
 categoryCell.className = category-label;
 categoryCell.textContent = service.category;

 // Cột 3: Giá dịch vụ
 const priceCell = document.createElement(td);
 priceCell.className = price;
 priceCell.textContent = formatPrice(service.price);

 // Cột 4: Thời lượng
 const durationCell = document.createElement(td);
 durationCell.textContent = service.duration ? ${service.duration} phút : —;

 // Cột 5: Trạng thái (Active / Inactive / Archived)
 const statusCell = document.createElement(td);
 const statusBadge = document.createElement(span);
 const isInactive = service.archived || service.status === inactive;
 statusBadge.className = status;
 statusBadge.textContent = service.archived
 ? Đã lưu trữ
 : service.status === inactive
 ? Tạm ngưng
 : Đang hoạt động;
 statusCell.appendChild(statusBadge);

 // Cột 6: Các nút thao tác
 const actionsCell = document.createElement(td);
 const actionsWrap = document.createElement(div);
 actionsWrap.className = row-actions;

 if (service.archived) {
 actionsWrap.appendChild(
 createActionButton(Khôi phục, check-circle-svgrepo-com.svg, service.id, restore)
 );
 } else {
 actionsWrap.appendChild(
 createActionButton(Sửa, edit-square-svgrepo-com.svg, service.id, edit)
 );
 actionsWrap.appendChild(
 createActionButton(Lưu trữ, folder-open-svgrepo-com.svg, service.id, archive)
 );
 }
 actionsCell.appendChild(actionsWrap);

 row.append(nameCell, categoryCell, priceCell, durationCell, statusCell, actionsCell);
 rowsContainer.appendChild(row);
 });

 // Cập nhật thống kê & trạng thái rỗng
 serviceCount.textContent = ${filtered.length} dịch vụ;
 if (filtered.length === 0) {
 emptyState.hidden = false;
 tableScroll.hidden = true;
 } else {
 emptyState.hidden = true;
 tableScroll.hidden = false;
 }
 }

 // --- 6. KIỂM TRA HỢP LỆ FORM (Form Validation) ---

 function setFieldError(input, errorElement, message) {
 if (errorElement) errorElement.textContent = message;
 if (message) {
 input.classList.add(invalid);
 input.setAttribute(aria-invalid, true);
 } else {
 input.classList.remove(invalid);
 input.removeAttribute(aria-invalid);
 }
 }

 function clearErrors() {
 setFieldError(nameInput, document.getElementById(nameError), );
 setFieldError(categoryInput, document.getElementById(categoryError), );
 setFieldError(priceInput, document.getElementById(priceError), );
 setFieldError(durationInput, document.getElementById(durationError), );
 }

 function validateForm() {
 let isValid = true;
 const nameVal = nameInput.value.trim();
 const priceVal = Number(priceInput.value);
 const durationVal = durationInput.value ===  ? null : Number(durationInput.value);

 // Kiểm tra tên dịch vụ
 if (!nameVal) {
 setFieldError(nameInput, document.getElementById(nameError), Vui lòng nhập tên dịch vụ.);
 isValid = false;
 } else {
 setFieldError(nameInput, document.getElementById(nameError), );
 }

 // Kiểm tra danh mục
 if (!categoryInput.value) {
 setFieldError(categoryInput, document.getElementById(categoryError), Vui lòng chọn danh mục.);
 isValid = false;
 } else {
 setFieldError(categoryInput, document.getElementById(categoryError), );
 }

 // Kiểm tra giá dịch vụ
 if (!priceInput.value || !Number.isSafeInteger(priceVal) || priceVal <= 0) {
 setFieldError(priceInput, document.getElementById(priceError), Giá dịch vụ phải là số nguyên lớn hơn 0.);
 isValid = false;
 } else {
 setFieldError(priceInput, document.getElementById(priceError), );
 }

 // Kiểm tra thời lượng
 if (durationVal !== null && (!Number.isInteger(durationVal) || durationVal < 1 || durationVal > 1440)) {
 setFieldError(durationInput, document.getElementById(durationError), Thời lượng phải từ 1 đến 1440 phút.);
 isValid = false;
 } else {
 setFieldError(durationInput, document.getElementById(durationError), );
 }

 if (!isValid) {
 const firstInvalid = form.querySelector('[aria-invalid=true]');
 if (firstInvalid) firstInvalid.focus();
 }

 return isValid;
 }

 // --- 7. QUẢN LÝ MODAL (Open / Close Modal) ---

 function openModal(service = null) {
 previouslyFocused = document.activeElement;
 clearErrors();
 form.reset();

 const isEdit = Boolean(service);
 document.getElementById(serviceId).value = isEdit ? service.id : ;
 document.getElementById(modalTitle).textContent = isEdit ? Chỉnh Sửa Dịch Vụ : Thêm Dịch Vụ Mới;
 document.getElementById(modalDescription).textContent = isEdit
 ? Cập nhật các thông tin của dịch vụ y tế.
 : Điền thông tin để thêm dịch vụ mới vào danh sách cơ sở.;
 document.getElementById(saveServiceButton).textContent = isEdit ? Lưu thay đổi : Lưu dịch vụ;

 if (isEdit) {
 nameInput.value = service.name;
 categoryInput.value = service.category;
 priceInput.value = String(service.price);
 durationInput.value = service.duration ? String(service.duration) : ;
 statusInput.value = service.status;
 descriptionInput.value = service.description || ;
 } else {
 statusInput.value = active;
 }

 backdrop.hidden = false;
 document.body.style.overflow = hidden;
 nameInput.focus();
 }

 function closeModal() {
 backdrop.hidden = true;
 document.body.style.overflow = ;
 clearErrors();
 if (previouslyFocused && typeof previouslyFocused.focus === function) {
 previouslyFocused.focus();
 }
 }

 // --- 8. LẮNG NGHE SỰ KIỆN (Event Listeners) ---

 // Mở modal thêm dịch vụ mới
 document.getElementById(addServiceButton).addEventListener(click, () => openModal(null));

 // Đóng modal
 document.getElementById(closeModalButton).addEventListener(click, closeModal);
 document.getElementById(cancelModalButton).addEventListener(click, closeModal);
 backdrop.addEventListener(click, (event) => {
 if (event.target === backdrop) closeModal();
 });

 // Tìm kiếm và lọc theo thời gian thực
 searchInput.addEventListener(input, renderServices);
 categoryFilter.addEventListener(change, renderServices);
 statusFilter.addEventListener(change, renderServices);

 // Xóa cảnh báo lỗi khi người dùng đang nhập
 nameInput.addEventListener(input, () => {
 if (nameInput.value.trim()) setFieldError(nameInput, document.getElementById(nameError), );
 });
 priceInput.addEventListener(input, () => {
 const val = Number(priceInput.value);
 if (Number.isSafeInteger(val) && val > 0) {
 setFieldError(priceInput, document.getElementById(priceError), );
 }
 });

 // Đóng modal bằng phím ESC & quản lý focus Trap
 document.addEventListener(keydown, (event) => {
 if (backdrop.hidden) return;

 if (event.key === Escape) {
 closeModal();
 return;
 }

 // Focus Trap bên trong modal
 if (event.key === Tab) {
 const focusables = modal.querySelectorAll(
 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
 );
 if (focusables.length === 0) return;
 const first = focusables[0];
 const last = focusables[focusables.length - 1];

 if (event.shiftKey && document.activeElement === first) {
 event.preventDefault();
 last.focus();
 } else if (!event.shiftKey && document.activeElement === last) {
 event.preventDefault();
 first.focus();
 }
 }
 });

 // Thao tác sửa, lưu trữ, khôi phục trên danh sách dịch vụ (Event Delegation)
 rowsContainer.addEventListener(click, (event) => {
 const actionBtn = event.target.closest(button[data-action]);
 if (!actionBtn) return;

 const serviceId = actionBtn.dataset.id;
 const action = actionBtn.dataset.action;
 const service = services.find((item) => item.id === serviceId);

 if (!service) {
 showToast(Không tìm thấy dịch vụ, Dữ liệu có thể đã được cập nhật trước đó.);
 return;
 }

 if (action === edit) {
 openModal(service);
 return;
 }

 if (action === archive || action === restore) {
 const isRestoring = action === restore;
 const actionName = isRestoring ? khôi phục : lưu trữ;

 if (!window.confirm(Bạn có chắc chắn muốn dịch vụ  không?)) {
 return;
 }

 const nextServices = services.map((item) =>
 item.id === service.id ? { ...item, archived: !isRestoring } : item
 );

 if (saveServices(nextServices)) {
 services = nextServices;
 renderServices();
 showToast(
 isRestoring ? Đã khôi phục dịch vụ : Đã lưu trữ dịch vụ,
 Dịch vụ  đã được thành công.
 );
 }
 }
 });

 // Xử lý gửi Form (Submit Form - Thêm mới hoặc Cập nhật)
 form.addEventListener(submit, (event) => {
 event.preventDefault();
 if (!validateForm()) return;

 const id = document.getElementById(serviceId).value;
 const existingIndex = services.findIndex((item) => item.id === id);

 const serviceData = {
 id: id || svc--,
 name: nameInput.value.trim(),
 category: categoryInput.value,
 price: Number(priceInput.value),
 duration: durationInput.value ? Number(durationInput.value) : null,
 status: statusInput.value,
 archived: false,
 description: descriptionInput.value.trim()
 };

 const nextServices = [...services];
 if (existingIndex >= 0) {
 nextServices[existingIndex] = serviceData;
 } else {
 nextServices.unshift(serviceData);
 }

 if (saveServices(nextServices)) {
 services = nextServices;
 renderServices();
 closeModal();
 showToast(
 existingIndex >= 0 ? Đã cập nhật dịch vụ : Đã thêm dịch vụ mới,
 Dịch vụ  đã được lưu thành công.
 );
 }
 });

 // --- 9. KHỞI TẠO TRANG BAN ĐẦU ---
 renderServices();
})();
