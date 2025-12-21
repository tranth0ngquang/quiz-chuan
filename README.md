# Ứng dụng Trắc nghiệm

Ứng dụng trắc nghiệm được xây dựng với Next.js, TypeScript, Tailwind CSS và shadcn/ui.

## Tính năng

### ✅ Đã hoàn thành (Mức 1 - MVP)

1. **Ngân hàng câu hỏi**
   - Hệ thống quản lý câu hỏi dựa trên file JSON
   - Mỗi câu có: nội dung, 4 đáp án (A/B/C/D), đáp án đúng, giải thích
   - 3 bộ đề mẫu: DSA, Mạng máy tính, Toán cao cấp
   - Dễ dàng thêm bộ đề mới bằng cách tạo file JSON theo schema

2. **Chế độ làm bài**
   - Chọn chủ đề từ danh sách các bộ đề có sẵn
   - Chọn số lượng câu hỏi: 10, 20, 50 câu hoặc tất cả
   - Random câu hỏi từ ngân hàng

3. **Màn hình quiz**
   - Hiển thị 1 câu trên 1 màn hình
   - 4 đáp án dạng card lớn, dễ bấm trên mobile
   - Nút Next/Previous để di chuyển giữa các câu
   - Thanh progress hiển thị "Câu X/Y"
   - Chuyển nhanh đến câu bất kỳ
   - Hiển thị số câu đã trả lời

4. **Kết quả sau khi nộp**
   - Hiển thị điểm số: X/Y câu đúng và phần trăm
   - Danh sách chi tiết từng câu với đáp án đã chọn
   - Đáp án đúng được đánh dấu màu xanh
   - Đáp án sai được đánh dấu màu đỏ
   - Hiển thị giải thích cho mỗi câu hỏi

5. **Tính năng luyện câu sai**
   - Tự động lưu các câu trả lời sai vào localStorage
   - Tích lũy câu sai qua nhiều lần làm bài
   - Xem danh sách tất cả câu sai theo từng môn
   - Làm lại các câu sai như quiz bình thường
   - Tự động xóa câu khỏi danh sách khi trả lời đúng
   - Xóa thủ công từng câu hoặc xóa tất cả

## Cấu trúc thư mục

```
app-trac-nghiem/
├── data/                          # Ngân hàng câu hỏi
│   ├── schema.json               # Schema cho AI tạo data
│   ├── dsa.json                  # Câu hỏi DSA
│   ├── network.json              # Câu hỏi Mạng máy tính
│   └── calculus.json             # Câu hỏi Toán cao cấp
├── src/
│   ├── app/
│   │   ├── page.tsx              # Trang chủ - chọn chủ đề
│   │   ├── quiz/[bankId]/page.tsx # Màn hình làm bài
│   │   ├── result/page.tsx       # Màn hình kết quả
│   │   └── wrong-questions/page.tsx # Danh sách câu sai
│   ├── components/ui/            # shadcn/ui components
│   ├── lib/
│   │   ├── questionBank.ts       # Quản lý ngân hàng câu hỏi
│   │   ├── storage.ts            # Quản lý localStorage
│   │   └── utils.ts              # Utilities
│   └── types/
│       └── quiz.ts               # Type definitions
└── README.md
```

## Cách chạy

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy development server:**
   ```bash
   npm run dev
   ```

3. **Mở trình duyệt:**
   ```
   http://localhost:3000
   ```

## Thêm bộ câu hỏi mới

1. Tạo file JSON mới trong thư mục `data/` theo schema:

```json
{
  "id": "unique-id",
  "name": "Tên môn học",
  "description": "Mô tả ngắn",
  "questions": [
    {
      "id": 1,
      "question": "Nội dung câu hỏi?",
      "options": {
        "A": "Đáp án A",
        "B": "Đáp án B",
        "C": "Đáp án C",
        "D": "Đáp án D"
      },
      "correctAnswer": "A",
      "explanation": "Giải thích đáp án đúng (optional)"
    }
  ]
}
```

2. Import file trong `src/lib/questionBank.ts`:

```typescript
import newBank from '@/../data/your-file.json';

export const questionBanks: QuestionBank[] = [
  // ... existing banks
  newBank as QuestionBank,
];
```

## Sử dụng AI để tạo câu hỏi

File `data/schema.json` chứa JSON Schema để bạn có thể yêu cầu AI (ChatGPT, Claude, etc.) tạo câu hỏi theo đúng format. 

Ví dụ prompt:
```
Hãy tạo 10 câu hỏi trắc nghiệm về [chủ đề] theo schema JSON sau:
[paste nội dung schema.json]
```

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Storage:** localStorage (client-side)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## License

MIT


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
