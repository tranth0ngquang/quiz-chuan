# Schema để tạo câu hỏi trắc nghiệm

Sử dụng schema JSON này để yêu cầu AI (ChatGPT, Claude, Gemini, v.v.) tạo bộ câu hỏi mới.

## Các loại câu hỏi được hỗ trợ

### 1. Câu hỏi đơn (Single Question)
Câu hỏi trắc nghiệm thông thường với 4 đáp án A, B, C, D.

### 2. Câu hỏi đoạn văn (Passage Question)
Bao gồm 2 loại:

- **Reading Comprehension (Đọc hiểu)**: Một đoạn văn với nhiều câu hỏi về nội dung.
- **Fill-in-the-blank (Điền từ)**: Một đoạn văn có chỗ trống cần điền từ phù hợp.

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

### Tạo câu hỏi TOEIC với đoạn văn (Passage-based)

```
Hãy tạo bộ câu hỏi TOEIC bao gồm:
- 2 đoạn văn điền từ (fill-in-the-blank), mỗi đoạn 4 câu hỏi
- 2 đoạn văn đọc hiểu (reading-comprehension), mỗi đoạn 4 câu hỏi

Yêu cầu:
- Đối với fill-in-the-blank: sử dụng format ____N____ trong đoạn văn (N là id của subQuestion)
- Đối với reading-comprehension: câu hỏi về nội dung, ý chính, chi tiết
- Mỗi câu có giải thích ngữ pháp/từ vựng
```

## Cấu trúc câu hỏi đoạn văn

### Fill-in-the-blank (Điền từ vào chỗ trống)

```json
{
  "id": 3,
  "type": "passage",
  "passageType": "fill-in-the-blank",
  "passageTitle": "Job Advertisement",
  "passage": "We are looking for a ____1____ candidate. The position requires ____2____ in marketing.",
  "subQuestions": [
    {
      "id": 1,
      "question": "Choose the correct word for blank 1",
      "options": {
        "A": "qualify",
        "B": "qualified",
        "C": "qualifying",
        "D": "qualification"
      },
      "correctAnswer": "B",
      "explanation": "'Qualified' is an adjective describing the candidate."
    },
    {
      "id": 2,
      "question": "Choose the correct word for blank 2",
      "options": {
        "A": "experience",
        "B": "experiences",
        "C": "experienced",
        "D": "experiencing"
      },
      "correctAnswer": "A",
      "explanation": "'Experience' as an uncountable noun is correct here."
    }
  ]
}
```

### Reading Comprehension (Đọc hiểu)

```json
{
  "id": 4,
  "type": "passage",
  "passageType": "reading-comprehension",
  "passageTitle": "Company Announcement",
  "passage": "ABC Company is pleased to announce the opening of our new branch...",
  "subQuestions": [
    {
      "id": 13,
      "question": "What is the purpose of this announcement?",
      "options": {
        "A": "To advertise products",
        "B": "To announce a new branch",
        "C": "To recruit employees",
        "D": "To report earnings"
      },
      "correctAnswer": "B",
      "explanation": "The announcement is about opening a new branch."
    }
  ]
}
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
  englishBank as QuestionBank,
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
6. **Đoạn văn đa dạng**: Sử dụng các loại văn bản thực tế (email, memo, quảng cáo, báo chí)

## Ví dụ câu hỏi đơn tốt

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
