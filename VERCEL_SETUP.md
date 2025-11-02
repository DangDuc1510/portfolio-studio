# Hướng dẫn Deploy Monorepo lên Vercel

## Cấu trúc Project

- `portfolio-web/` - Next.js Frontend
- `portfolio-backend/` - NestJS Backend

## Cách Setup trên Vercel

### Option 1: Deploy Frontend lên Vercel (Khuyên dùng)

Vercel tối ưu cho Next.js, backend có thể deploy riêng trên Railway/Render hoặc Vercel Serverless.

#### Bước 1: Tạo Project Frontend trên Vercel

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import repository của bạn
4. Cấu hình project:
   - **Project Name**: `portfolio-web` (hoặc tên bạn muốn)
   - **Root Directory**: `portfolio-web`
   - **Framework Preset**: Next.js (tự động detect)
   - **Build Command**: `npm run build` (hoặc để tự động)
   - **Output Directory**: `.next` (hoặc để tự động)
   - **Install Command**: `npm install`

#### Bước 2: Thêm Environment Variables cho Frontend

Trong Vercel Dashboard → Settings → Environment Variables, thêm:

- `NEXT_PUBLIC_API_URL` - URL của backend API
- Các biến môi trường khác nếu cần

#### Bước 3: Deploy Backend (Tùy chọn)

**Option A: Deploy Backend lên Vercel (Serverless Functions)**

Tạo project thứ 2 trên Vercel:

1. Click "Add New Project" lần nữa
2. Import cùng repository
3. Cấu hình:
   - **Project Name**: `portfolio-backend-api`
   - **Root Directory**: `portfolio-backend`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

Sau đó cần cấu hình `vercel.json` cho backend để chuyển NestJS thành serverless functions.

**Option B: Deploy Backend trên Railway/Render (Khuyên dùng)**

Backend NestJS chạy tốt hơn trên platform chuyên dụng:

1. Đăng ký [Railway](https://railway.app) hoặc [Render](https://render.com)
2. Connect GitHub repository
3. Chọn root directory: `portfolio-backend`
4. Set build command: `npm run build`
5. Set start command: `npm run start:prod`
6. Thêm environment variables (MongoDB URI, API keys, etc.)

### Option 2: Deploy cả 2 trên Vercel với Monorepo

1. Tạo 2 projects riêng biệt trong Vercel Dashboard
2. Mỗi project:
   - Frontend: Root Directory = `portfolio-web`
   - Backend: Root Directory = `portfolio-backend` (cần config serverless)

## Environment Variables

### Frontend (Vercel)

```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### Backend (Railway/Render hoặc Vercel)

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
API_KEY=your_api_key_for_auth
NODE_ENV=production
```

## CORS Configuration

Đảm bảo backend CORS config bao gồm domain của frontend trên Vercel:

```typescript
app.enableCors({
  origin: ["http://localhost:4000", "https://your-frontend.vercel.app"],
  credentials: true,
});
```

## Lưu ý

1. **Frontend**: Vercel tự động detect Next.js và optimize
2. **Backend**: NestJS tốt nhất nên deploy trên Railway/Render vì cần persistent server
3. **Database**: Có thể dùng MongoDB Atlas (free tier)
4. **File Uploads**: Nếu dùng Cloudinary, không cần lo về storage

## Testing Locally

```bash
# Install dependencies cho cả 2 projects
npm run install:all

# Chạy backend
npm run dev:backend

# Chạy frontend (terminal khác)
npm run dev:web
```
