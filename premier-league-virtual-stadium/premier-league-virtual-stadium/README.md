# Premier League Virtual Stadium

Prototype website mô phỏng trải nghiệm xem bóng đá 3D từ góc nhìn khán đài.

## Tính năng hiện có

- Sân bóng 3D với mặt cỏ, vạch sân, khung thành, khán đài và đèn sân.
- 22 nhân vật cầu thủ 3D dạng low-poly, màu áo theo hai đội.
- Chọn ngẫu nhiên hai CLB và tạo trận mới.
- Điều khiển bắt đầu / tạm dừng / tiếp tục / trận mới.
- Đồng hồ mô phỏng 0–90 phút, tốc độ 1x / 2x / 3x.
- Sự kiện mô phỏng, bàn thắng ngẫu nhiên và bảng diễn biến.
- Âm thanh nền tổng hợp bằng Web Audio API.
- Bình luận tiếng Việt bằng SpeechSynthesis của trình duyệt.
- Góc nhìn khán đài có thể xoay và zoom bằng chuột.
- Responsive cho desktop và mobile.

## Yêu cầu

- Node.js 18 trở lên
- npm

## Chạy dự án

```bash
npm install
npm run dev
```

Mở URL Vite hiển thị trong terminal, thường là `http://localhost:5173`.

## Build production

```bash
npm run build
npm run preview
```

## Cấu trúc

```text
src/
  components/
    AudioEngine.js
    Stadium.jsx
  data/
    teams.js
  App.jsx
  main.jsx
  styles.css
```

## Ghi chú quan trọng

1. Danh sách đội bóng trong `src/data/teams.js` là dữ liệu mẫu để chạy prototype. Hãy cập nhật theo danh sách CLB chính thức của mùa giải mục tiêu trước khi phát hành.
2. Đây là mô phỏng tự tạo, không phải luồng phát sóng trận đấu thật và không sử dụng dữ liệu trận đấu chính thức.
3. Âm thanh đám đông hiện là âm thanh tổng hợp bằng Web Audio API; để có tiếng cổ động chân thực, hãy thay bằng các tệp âm thanh đã được cấp phép.
4. Bình luận dùng giọng đọc hệ thống của trình duyệt. Giọng đọc tiếng Việt tùy thuộc thiết bị và hệ điều hành.
5. Cầu thủ đang dùng hình khối procedural và chuyển động demo. Muốn đạt chất lượng game thương mại cần thay bằng model GLB có rig/animation, AI chiến thuật, điều khiển bóng vật lý và hệ thống va chạm.
6. Đây là frontend prototype; chưa có tài khoản, backend, multiplayer, lưu dữ liệu hoặc hệ thống quản trị.

## Tùy chỉnh nhanh

- Đội bóng / màu áo / sân nhà: `src/data/teams.js`
- Mô hình sân và cầu thủ: `src/components/Stadium.jsx`
- Âm thanh và đọc bình luận: `src/components/AudioEngine.js`
- Giao diện và logic trận đấu: `src/App.jsx`
- Thiết kế: `src/styles.css`
