# 🏪 GS25 Online Store - Website Bán Hàng Trực Tuyến

![Banner Project](https://via.placeholder.com/1000x300?text=GS25+Online+Store+Project+Banner)
> *Dự án xây dựng hệ thống thương mại điện tử mô phỏng cho chuỗi cửa hàng tiện lợi GS25, tập trung vào trải nghiệm đặt hàng nhanh và quản lý vận hành.*

---

## 🌟 Giới thiệu (Overview)

Đây là đồ án môn học **Phát triển Ứng dụng Web**, mô phỏng quy trình hoạt động của một hệ thống bán hàng trực tuyến. Dự án không chỉ dừng lại ở giao diện (Frontend) mà còn xử lý logic nghiệp vụ phức tạp (Backend Simulation) ngay trên trình duyệt, tích hợp thanh toán QR Code thực tế.

### 🎯 Điểm nổi bật:
- **Giả lập Database:** Sử dụng `LocalStorage` để lưu trữ dữ liệu bền vững (sản phẩm, đơn hàng, user) mà không cần server.
- **Thanh toán VietQR:** Tích hợp API tạo mã QR động theo giá trị đơn hàng thực tế.
- **Quy trình chuẩn UML:** Hệ thống được phân tích và thiết kế dựa trên bộ quy chuẩn UML (Use Case & Sequence Diagram).

---

## 🛠 Công nghệ sử dụng (Tech Stack)

| Lĩnh vực | Công nghệ |
| :--- | :--- |
| **Frontend** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) |
| **Database** | ![LocalStorage](https://img.shields.io/badge/Storage-LocalStorage-green?style=flat) (NoSQL simulation) |
| **Payment** | ![VietQR](https://img.shields.io/badge/Payment-VietQR_API-blue?style=flat) |
| **Design Tool** | ![Visual Paradigm](https://img.shields.io/badge/Design-Visual_Paradigm-purple?style=flat) |

---

## 🚀 Chức năng chính (Key Features)

### 🛒 Phân hệ Khách hàng (Customer)
1. **Trang chủ & Sản phẩm:**
   - Hiển thị danh sách món ăn/thức uống theo danh mục.
   - Tìm kiếm và lọc sản phẩm thông minh.
   - Xem chi tiết sản phẩm.
2. **Giỏ hàng & Đặt hàng:**
   - Thêm/Sửa/Xóa món trong giỏ hàng (Lưu trưc LocalStorage).
   - Tự động tính tổng tiền.
3. **Thanh toán QR:**
   - Tự động sinh mã VietQR ứng với số tiền cần thanh toán.
   - Xác nhận đặt hàng thành công.
4. **Tài khoản:** Đăng ký, Đăng nhập, Xem lịch sử đơn hàng.

### 👮‍♂️ Phân hệ Quản trị (Admin)
1. **Dashboard:** Thống kê tổng quan doanh thu và số lượng đơn hàng.
2. **Quản lý Sản phẩm:** Thêm mới, chỉnh sửa giá/hình ảnh, xóa món ăn.
3. **Quản lý Đơn hàng:**
   - Xem danh sách đơn mới.
   - **Duyệt đơn:** Hệ thống tự động trừ tồn kho.
   - Hủy đơn hoặc xác nhận giao hàng.

---

## 📊 Thiết kế hệ thống (System Design)

Dự án được xây dựng dựa trên quy trình phân tích thiết kế hệ thống bài bản.

### 1. Sơ đồ Use Case (Use Case Diagrams)
Mô tả các chức năng chi tiết của hệ thống:
<details>
  <summary>Click để xem Sơ đồ Use Case</summary>
  
  - **Tổng quát hệ thống**
  ![Use Case Overview](./images/UseCase_TongQuat.png)
  
  - **Phân hệ Mua sắm & Thanh toán**
  ![Use Case Shopping](./images/UseCase_MuaSam.png)
  
  - **Phân hệ Quản lý Kho & Vận hành**
  ![Use Case Admin](./images/UseCase_QuanLy.png)
</details>

### 2. Sơ đồ Tuần tự (Sequence Diagrams)
Mô tả luồng xử lý dữ liệu và logic code:
<details>
  <summary>Click để xem Sơ đồ Tuần tự</summary>

  - **Quy trình Khách hàng Đặt hàng & Thanh toán QR**
  ![Sequence Order](./images/Sequence_DatHang.png)

  - **Quy trình Admin Duyệt đơn & Cập nhật kho**
  ![Sequence Admin](./images/Sequence_XuLyDon.png)
</details>

---

## 📸 Demo Giao diện (Screenshots)

*(Phần này bạn hãy chụp ảnh màn hình web thực tế chèn vào đây)*

| Trang chủ | Giỏ hàng & Thanh toán |
| :---: | :---: |
| ![Home](./images/demo_home.png) | ![Cart](./images/demo_cart.png) |

| Admin Dashboard | Quản lý Đơn hàng |
| :---: | :---: |
| ![Admin](./images/demo_admin.png) | ![Orders](./images/demo_orders.png) |

---

## ⚙️ Cài đặt & Hướng dẫn sử dụng (Installation)

Dự án sử dụng thuần HTML/CSS/JS nên không cần cài đặt môi trường phức tạp.

1. **Clone dự án về máy:**
   ```bash
   git clone [https://github.com/username-cua-ban/GS25-Online-Store.git](https://github.com/username-cua-ban/GS25-Online-Store.git)
