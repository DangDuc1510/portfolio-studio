# 📋 KẾ HOẠCH PHÁT TRIỂN WEBSITE PORTFOLIO STUDIO

## 🎯 TỔNG QUAN DỰ ÁN

Website Portfolio Studio - Website giới thiệu studio nhiếp ảnh/video với CMS quản lý đầy đủ.

## 📦 DỮ LIỆU ĐÃ CÓ (Backend API)

✅ **Products**: Sản phẩm với images, videoUrl, thumbnail, category, albumId  
✅ **Albums**: Album ảnh với coverImage, description  
✅ **Categories**: Danh mục sản phẩm (bao gồm "Video")  
✅ **Customers**: Form liên hệ với status tracking  
✅ **Homepage Sections**: Quản lý nội dung động cho homepage  

---

## 🏗️ KIẾN TRÚC WEBSITE

### **1. LAYOUT & NAVIGATION**

#### 1.1 Header Component
- **Logo** ở bên trái
- **Navigation Menu**: Home, Portfolio, Albums, About, Contact
- **CTA Button**: "Book Session" / "Liên hệ"
- **Mobile Menu**: Hamburger menu với slide animation
- **Sticky Header**: Header cố định khi scroll
- **Scroll Progress Bar**: Thanh tiến trình scroll

**File**: `src/components/layout/Header.tsx`

#### 1.2 Footer Component
- **Thông tin studio**: Địa chỉ, SĐT, Email
- **Social Links**: Facebook, Instagram, YouTube, TikTok
- **Quick Links**: Sitemap
- **Copyright & Credits**
- **Newsletter Signup** (optional)

**File**: `src/components/layout/Footer.tsx`

---

### **2. HOMEPAGE SECTIONS**

#### 2.1 Hero Section (Fullscreen)
- **Fullscreen Video/Image Background** từ homepage-sections
- **Overlay gradient** tối để text dễ đọc
- **Animated Text**: Title + Subtitle từ CMS
- **CTA Buttons**: "View Portfolio", "Book Now"
- **Scroll Indicator**: Mũi tên xuống với animation
- **Parallax Effect**: Background scroll chậm hơn content

**File**: `src/components/sections/HeroSection.tsx`

#### 2.2 About Section
- **Split Layout**: Text bên trái, Image bên phải
- **Stats Counter**: Số năm kinh nghiệm, số dự án, khách hàng
- **Read More Button** với expand animation
- **Timeline** (optional): Lịch sử studio

**File**: `src/components/sections/AboutSection.tsx`

#### 2.3 Featured Products Section
- **Carousel/Slider** với autoplay
- **Featured Products**: Hiển thị 6-8 sản phẩm nổi bật
- **Card Design**: 
  - Image với overlay gradient
  - Category badge
  - Title + Short description
  - Hover effect: Zoom image + Show video play button (nếu có video)
- **Navigation**: Arrow buttons + Dot indicators
- **"View All Products" Button**

**File**: `src/components/sections/FeaturedProducts.tsx`

#### 2.4 Albums Showcase Section
- **Masonry/Grid Layout**: 3-4 cột, responsive
- **Album Cards**:
  - Cover image với aspect ratio
  - Album name
  - Product count badge
  - Hover: Image zoom + Show "View Album" button
- **Filter Buttons**: "All", "Wedding", "Portrait", etc.
- **"View All Albums" Button**

**File**: `src/components/sections/AlbumsShowcase.tsx`

#### 2.5 Services Section (Từ Homepage Sections)
- **Service Cards**: Grid 3 cột
- **Icons**: Custom icons hoặc Ant Design icons
- **Description**: Từ CMS
- **Hover Animation**: Lift up effect

**File**: `src/components/sections/ServicesSection.tsx`

#### 2.6 Testimonials Section (Từ Customers - Completed)
- **Testimonial Cards**: Carousel với customer reviews
- **Customer Info**: Name, Photo (avatar), Rating stars
- **Quote**: Message từ customer
- **Auto-rotate**: Mỗi 5 giây

**File**: `src/components/sections/TestimonialsSection.tsx`

#### 2.7 Contact Section
- **Contact Form**: Cải thiện từ ContactForm.tsx hiện tại
- **Contact Info Sidebar**: Địa chỉ, SĐT, Email, Giờ làm việc
- **Map Integration**: Google Maps (optional)
- **Success Animation**: Confetti hoặc checkmark animation
- **Validation**: Real-time validation với error messages

**File**: `src/components/sections/ContactSection.tsx`

---

### **3. PRODUCT PAGES**

#### 3.1 Products Listing Page (`/products`)
- **Filter Bar**: 
  - Search input
  - Category dropdown
  - Album dropdown
  - Sort options
- **View Toggle**: Grid / List view
- **Product Cards**: 
  - Image với lazy loading
  - Category badge
  - Title
  - Quick view button (modal)
- **Pagination**: Infinite scroll hoặc traditional pagination
- **Loading States**: Skeleton loaders

**File**: `src/app/products/page.tsx`

#### 3.2 Product Detail Page (`/products/[id]`)
- **Image Gallery**: 
  - Main image với zoom
  - Thumbnail strip
  - Lightbox modal
- **Video Player**: Nếu có videoUrl (YouTube/Vimeo embed)
- **Product Info**:
  - Title
  - Category + Album links
  - Description
  - Created/Updated dates
- **Related Products**: Carousel các sản phẩm cùng category
- **Share Buttons**: Facebook, Twitter, Copy link
- **Back Button**: Quay lại danh sách

**File**: `src/app/products/[id]/page.tsx`

---

### **4. ALBUM PAGES**

#### 4.1 Albums Listing Page (`/albums`)
- **Grid Layout**: Responsive 2-3-4 cột
- **Album Cards**: Cover image + Name + Product count
- **Filter**: Theo category của products trong album
- **Search**: Tìm album theo tên

**File**: `src/app/albums/page.tsx`

#### 4.2 Album Detail Page (`/albums/[id]`)
- **Album Header**:
  - Cover image full width
  - Album name
  - Description
  - Product count
- **Products Grid**: Masonry layout với products trong album
- **Product Cards**: Image + Name, click để xem detail
- **Navigation**: Next/Previous album
- **Share Album**: Share button

**File**: `src/app/albums/[id]/page.tsx`

---

### **5. ADDITIONAL PAGES**

#### 5.1 About Page (`/about`)
- **Hero Section**: Fullscreen với background image
- **Story Section**: Nội dung từ homepage-sections
- **Team Section** (optional)
- **Stats Section**: Số liệu thống kê
- **CTA Section**: Call to action

**File**: `src/app/about/page.tsx`

#### 5.2 Contact Page (`/contact`)
- **Contact Form**: Form đầy đủ với validation
- **Contact Information**: Map, địa chỉ, liên hệ
- **Social Proof**: Testimonials hoặc certifications

**File**: `src/app/contact/page.tsx`

---

## 🎨 DESIGN SYSTEM

### **Color Palette**
```css
Primary: #FFDD00 (Yellow)
Dark Background: #1C1C1C, #2C2C2C, #343434
Light Text: #FFFFFF
Gray Text: #9ca3af, #6b7280
Accent: #4B4B4B
```

### **Typography**
- **Headings**: Bold, large sizes
- **Body**: Regular, readable sizes
- **Font**: System fonts hoặc Google Fonts (Poppins, Inter)

### **Spacing**
- **Sections**: py-16, py-20, py-24
- **Containers**: max-w-7xl mx-auto px-4, px-6

### **Effects**
- **Gradients**: `bg-gradient-to-br from-[#343434] to-[#1C1C1C]`
- **Backdrop Blur**: `backdrop-blur-xl`
- **Shadows**: Subtle shadows cho cards
- **Transitions**: Smooth transitions 300ms

---

## 🚀 ANIMATIONS & INTERACTIONS

### **Scroll Animations**
- **Fade In**: Khi scroll vào viewport
- **Slide Up**: Elements slide up khi xuất hiện
- **Parallax**: Background elements scroll chậm hơn
- **Counter Animation**: Số liệu tăng dần

### **Hover Effects**
- **Image Zoom**: Scale(1.1) khi hover
- **Card Lift**: TranslateY(-8px) + Shadow
- **Button**: Background gradient shift

### **Loading States**
- **Skeleton Loaders**: Cho images và content
- **Spinner**: Cho async operations

**Library**: Framer Motion hoặc CSS animations

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

### **Mobile Considerations**
- **Navigation**: Hamburger menu
- **Grid**: 1 cột trên mobile
- **Images**: Optimize size và lazy loading
- **Touch**: Swipe gestures cho carousels

---

## 🔧 TECHNICAL IMPLEMENTATION

### **Dependencies cần thêm**
```json
{
  "framer-motion": "^11.x", // Animations
  "react-intersection-observer": "^9.x", // Scroll animations
  "embla-carousel-react": "^8.x", // Carousel
  "react-player": "^2.x", // Video player
  "next-intl": "^3.x" // i18n (optional)
}
```

### **Components Structure**
```
src/
  components/
    layout/
      Header.tsx
      Footer.tsx
      Navigation.tsx
    sections/
      HeroSection.tsx
      AboutSection.tsx
      FeaturedProducts.tsx
      AlbumsShowcase.tsx
      ServicesSection.tsx
      TestimonialsSection.tsx
      ContactSection.tsx
    products/
      ProductCard.tsx
      ProductGrid.tsx
      ProductDetail.tsx
      ProductGallery.tsx
      RelatedProducts.tsx
    albums/
      AlbumCard.tsx
      AlbumGrid.tsx
      AlbumDetail.tsx
    common/
      Button.tsx
      Card.tsx
      Modal.tsx
      Loading.tsx
      ErrorBoundary.tsx
```

---

## 📋 PRIORITY ROADMAP

### **Phase 1: Foundation (Tuần 1)**
1. ✅ Layout Components (Header, Footer)
2. ✅ Hero Section
3. ✅ Basic Homepage Structure
4. ✅ Global Styles & Theme

### **Phase 2: Content Sections (Tuần 2)**
1. ✅ About Section
2. ✅ Featured Products Section
3. ✅ Albums Showcase Section
4. ✅ Contact Section cải thiện

### **Phase 3: Detail Pages (Tuần 3)**
1. ✅ Products Listing & Detail Pages
2. ✅ Albums Listing & Detail Pages
3. ✅ Related Content

### **Phase 4: Enhancements (Tuần 4)**
1. ✅ Animations & Interactions
2. ✅ SEO Optimization
3. ✅ Performance Optimization
4. ✅ Testing & Bug Fixes

---

## ✅ CHECKLIST

### **Components cần tạo**
- [ ] Header với navigation
- [ ] Footer
- [ ] Hero Section
- [ ] About Section
- [ ] Featured Products Section
- [ ] Albums Showcase Section
- [ ] Services Section
- [ ] Testimonials Section
- [ ] Contact Section
- [ ] Product Card
- [ ] Product Detail
- [ ] Album Card
- [ ] Album Detail
- [ ] Modal/Lightbox
- [ ] Loading States
- [ ] Error Handling

### **Pages cần tạo**
- [ ] Homepage (app/page.tsx) - Refactor
- [ ] Products Listing (/products)
- [ ] Product Detail (/products/[id])
- [ ] Albums Listing (/albums)
- [ ] Album Detail (/albums/[id])
- [ ] About Page (/about)
- [ ] Contact Page (/contact)

### **Features cần implement**
- [ ] Image lazy loading
- [ ] Video embedding (YouTube/Vimeo)
- [ ] Lightbox/Gallery
- [ ] Filter & Search
- [ ] Pagination/Infinite scroll
- [ ] Share functionality
- [ ] Scroll animations
- [ ] Mobile menu
- [ ] Form validation
- [ ] SEO meta tags

---

## 🎯 KẾT QUẢ MONG ĐỢI

Một website portfolio studio hiện đại, đẹp mắt với:
- ✅ UI/UX chuyên nghiệp
- ✅ Responsive hoàn toàn
- ✅ Performance tối ưu
- ✅ SEO friendly
- ✅ Animations mượt mà
- ✅ Tích hợp đầy đủ với CMS

---

## 📝 GHI CHÚ

- Sử dụng Next.js 15 App Router
- Server Components cho data fetching
- Client Components cho interactions
- React Query cho client-side data management
- Tailwind CSS cho styling
- Framer Motion cho animations

