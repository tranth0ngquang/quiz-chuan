# Schema để tạo câu hỏi trắc nghiệm

Sử dụng schema JSON này để yêu cầu AI (ChatGPT, Claude, Gemini, v.v.) tạo bộ câu hỏi mới.

## Cách sử dụng

Sao chép nội dung file `schema.json` và sử dụng prompt như sau:

```
Hãy tạo [SỐ LƯỢNG] câu hỏi trắc nghiệm về [CHỦ ĐỀ] theo JSON Schema sau:

[Paste nội dung của schema.json]

Yêu cầu:
- Mỗi câu có 4 đáp án A, B, C, D
- Đáp án phải rõ ràng, chính xác
- Có giải thích cho mỗi câu (nếu có thể)
- Câu hỏi phải có độ khó phù hợp
```

## Ví dụ prompt cụ thể

### Tạo câu hỏi về Hệ điều hành

```
Hãy tạo 20 câu hỏi trắc nghiệm về Hệ điều hành (Operating System) theo JSON Schema sau:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Quiz Question Bank Schema",
  ...
}

Yêu cầu:
- Các chủ đề: Process Management, Memory Management, File System, CPU Scheduling
- Độ khó: Trung bình
- Mỗi câu phải có giải thích chi tiết
- Format id của question bank: "operating-system"
```

### Tạo câu hỏi về Tiếng Anh

```
Hãy tạo 30 câu hỏi trắc nghiệm Tiếng Anh TOEIC Part 5 (Grammar) theo JSON Schema sau:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  ...
}

Yêu cầu:
- Các chủ đề ngữ pháp: Tenses, Prepositions, Conditionals, Passive Voice
- Có giải thích ngữ pháp cho từng câu
- Format id: "toeic-grammar"
```

## Sau khi có data

1. Lưu kết quả JSON vào file mới trong thư mục `data/`, ví dụ: `data/operating-system.json`

2. Import vào `src/lib/questionBank.ts`:

```typescript
import osBank from '@/../data/operating-system.json';

export const questionBanks: QuestionBank[] = [
  networkBank as QuestionBank,
  dsaBank as QuestionBank,
  calculusBank as QuestionBank,
  osBank as QuestionBank, // Thêm mới
];
```

3. Restart dev server:
```bash
npm run dev
```

## Tips để tạo câu hỏi chất lượng

1. **Chủ đề cụ thể**: Càng cụ thể càng tốt (VD: "Thuật toán Dijkstra" thay vì "Giải thuật")
2. **Độ khó đa dạng**: Mix câu dễ, trung bình, khó
3. **Đáp án nhiễu tốt**: Các đáp án sai nên hợp lý, không quá dễ loại
4. **Giải thích rõ ràng**: Giúp người học hiểu tại sao đáp án đó đúng
5. **Số lượng hợp lý**: 20-50 câu mỗi bộ đề

## Ví dụ câu hỏi tốt

```json
{
  "id": 1,
  "question": "Trong hệ điều hành, kỹ thuật nào được sử dụng để giải quyết vấn đề Deadlock bằng cách phá vỡ điều kiện Circular Wait?",
  "options": {
    "A": "Yêu cầu tất cả các process phải request tài nguyên theo một thứ tự được định trước",
    "B": "Cho phép process giữ tài nguyên trong khi chờ tài nguyên khác",
    "C": "Không cho phép preemption tài nguyên",
    "D": "Tăng số lượng tài nguyên trong hệ thống"
  },
  "correctAnswer": "A",
  "explanation": "Circular Wait có thể được phá vỡ bằng cách yêu cầu các process phải request tài nguyên theo một thứ tự cố định. Điều này đảm bảo không thể xảy ra vòng tròn chờ đợi tài nguyên."
}
```
