# Library Management System - Frontend

A modern, responsive library management system built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Book Management**: Add, edit, delete, and view books
- **Book Borrowing**: Borrow books with quantity validation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching support
- **Real-time Validation**: Form validation with Zod
- **Modern UI**: Built with shadcn/ui components

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Redux Toolkit, RTK Query
- **Forms**: React Hook Form, Zod validation
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update environment variables in `.env`:
```env
VITE_API_BASE_URL=https://your-api-url.com/api
```

5. Start development server:
```bash
npm run dev
```

## 🚀 Deployment to Vercel

### Method 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Method 2: GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `VITE_API_BASE_URL`: Your API base URL
6. Deploy

### Environment Variables for Production

Set these in your Vercel dashboard:

```
VITE_API_BASE_URL=https://fahimxgg-l2-ass-3-db.vercel.app/api
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🏗️ Build Configuration

The project is optimized for production with:

- **Code Splitting**: Automatic vendor and route-based splitting
- **Tree Shaking**: Dead code elimination
- **Minification**: ESBuild minification
- **Asset Optimization**: Optimized images and fonts
- **Caching**: Long-term caching for static assets

## 🔧 Project Structure

```
src/
├── app/           # Redux store and API slice
├── components/    # Reusable UI components
├── pages/         # Page components
├── lib/           # Utility functions
├── hooks/         # Custom React hooks
├── contexts/      # React contexts
└── assets/        # Static assets
```

## 🌐 API Integration

The app connects to a backend API with the following endpoints:

- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book
- `POST /borrow` - Borrow book
- `GET /borrow` - Get borrow summary

## 📱 Responsive Design

The application is fully responsive and works on:

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🎨 Theming

The app supports dark and light themes using:

- CSS custom properties
- `next-themes` for theme switching
- Tailwind CSS dark mode classes

## 🔒 Security Features

- XSS protection headers
- Content type validation
- Frame options security
- HTTPS enforcement in production

## 📄 License

This project is licensed under the MIT License.
