# Chế độ Học tập (Learning Mode)

## Tổng quan
Ứng dụng hiện hỗ trợ **2 chế độ** làm bài:

### 1. 📝 Chế độ Thi (Test Mode)
- Câu hỏi được **xáo trộn ngẫu nhiên**
- Không hiển thị đáp án đúng khi làm bài
- Có nút **"Nộp bài"** ở cuối để xem kết quả
- Lưu tiến độ - có thể tạm dừng và tiếp tục sau
- Phù hợp để **kiểm tra kiến thức**

### 2. 📖 Chế độ Học tập (Learning Mode) ⭐ MỚI
- Câu hỏi được sắp xếp **theo thứ tự** (không xáo trộn)
- Khi chọn đáp án, **ngay lập tức hiển thị**:
  - ✓ Đáp án đúng (màu xanh lá)
  - ✗ Đáp án sai (màu đỏ)
  - 💡 **Giải thích chi tiết** (nếu có)
- Không có nút "Nộp bài" - chỉ học từng câu
- Không lưu tiến độ
- Phù hợp để **học và ghi nhớ kiến thức**

## Cách sử dụng

### Tại trang chủ
Mỗi môn học có 2 nhóm nút:

#### Chế độ học tập (màu xanh lá):
```
📖 10 câu  |  📖 20 câu  |  📖 50 câu  |  📖 Tất cả
```

#### Chế độ thi (màu xanh dương):
```
10 câu  |  20 câu  |  50 câu  |  Thi tất cả (XXX câu)
```

### Trong bài làm
- **Header** hiển thị chế độ hiện tại:
  - `📖 Chế độ học tập` (màu xanh lá)
  - `📝 Chế độ thi` (màu xanh dương)

### Tính năng Learning Mode

#### Khi chọn đáp án:
1. Đáp án được highlight màu xanh lá (đúng) hoặc đỏ (sai)
2. Biểu tượng ✓ hoặc ✗ xuất hiện bên cạnh
3. Khung giải thích hiển thị ngay bên dưới:
   ```
   💡 Giải thích:
   [Nội dung giải thích chi tiết...]
   Đáp án đúng: A
   ```

#### Điều hướng:
- Nút "← Câu trước" và "Câu tiếp →" để di chuyển
- Câu cuối cùng: nút "Hoàn thành học tập ✓" để về trang chủ
- Không có các nút "Tạm dừng" hay "Làm lại từ đầu"

## Thay đổi kỹ thuật

### 1. File: `src/lib/questionBank.ts`
- Thêm function `getOrderedQuestions()` - lấy câu hỏi theo thứ tự gốc

### 2. File: `src/app/page.tsx`
- Cập nhật UI với 2 nhóm nút cho 2 chế độ
- Thêm parameter `mode=learning` hoặc `mode=test` vào URL

### 3. File: `src/app/quiz/[bankId]/page.tsx`
- Thêm state `quizMode` để theo dõi chế độ hiện tại
- Thêm state `showExplanations` để kiểm soát hiển thị giải thích
- Cập nhật `handleAnswerSelect()` và `handleSubAnswerSelect()` để show giải thích
- Cập nhật UI components:
  - Highlight đáp án đúng/sai trong learning mode
  - Hiển thị khung giải thích
  - Thay đổi nút navigation ở câu cuối
  - Ẩn các nút không cần thiết (Tạm dừng, Làm lại)
- Không lưu session trong learning mode

## URL Parameters

### Test Mode:
```
/quiz/english?count=10&mode=test
/quiz/network?count=20&mode=test
```

### Learning Mode:
```
/quiz/english?count=10&mode=learning
/quiz/network?count=20&mode=learning
```

## Lợi ích

### Cho người học:
- ✅ Học từng câu một cách chắc chắn
- ✅ Hiểu rõ lý do tại sao đúng/sai ngay lập tức
- ✅ Câu hỏi theo thứ tự logic, dễ theo dõi
- ✅ Không áp lực phải "nộp bài"

### Cho người thi:
- ✅ Kiểm tra kiến thức thực tế
- ✅ Câu hỏi ngẫu nhiên, giống thi thật
- ✅ Lưu tiến độ, linh hoạt
- ✅ Xem tổng kết sau khi nộp bài

## Demo
1. Mở http://localhost:3000
2. Chọn một môn học
3. Click nút "📖 10 câu" trong phần "Chế độ học tập"
4. Chọn đáp án bất kỳ
5. ➡️ Xem giải thích xuất hiện ngay lập tức!
