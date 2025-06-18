# Stoom - Gaming Marketplace

A modern gaming marketplace built with Next.js 13, TypeScript, and Tailwind CSS. This full-stack application allows users to browse and purchase games, manage their cart, and administrators to manage products and users.

## ✨ Features

- 🎮 Browse and search games by title, category, and price range
- 🛒 Full shopping cart functionality with real-time updates
- 👤 User authentication and profile management
- 🔑 Role-based access control (Admin/User)
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure authentication with NextAuth.js
- 📊 Admin dashboard for user and product management

The shopping cart system is fully implemented and production-ready:

### Features

- **Add to Cart** - Add products from the product catalog
- **Quantity Management** - Increase/decrease item quantities
- **Remove Items** - Remove individual items from cart
- **Real-time Totals** - Automatic price calculations
- **Search Cart** - Filter cart items by product name
- **Responsive Design** - Works on all devices
- **Authentication Required** - Secure, user-specific carts

### Technical Implementation

- **MongoDB Integration** - Cart data persisted in database
- **RESTful API** - GET, POST, DELETE endpoints
- **Type Safety** - Full TypeScript implementation
- **Error Handling** - Comprehensive error management
- **Testing** - 14 automated tests passing
- **Performance** - Optimized with Next.js Image component

### Sample Data

The project includes 5 sample games for testing:

- The Witcher 3: Wild Hunt ($39.99)
- Cyberpunk 2077 ($59.99)
- Minecraft ($26.95)
- Super Mario Odyssey ($49.99)
- Call of Duty: Mobile (Free)

### Team Responsibilities

#### Ormir (Frontend Focus)

- [x] Initial project setup with Next.js and dependencies
- [x] Add basic folder structure and component templates
- [x] Implement header and navigation components
- [x] Create initial page layouts (home, about, contact)
- [x] Add authentication UI components (login/register forms)
- [x] Implement product list and product card components
- [x] Add shopping cart UI and functionality
- [x] Style homepage and product pages with Tailwind
- [x] Implement responsive design across all pages
- [x] Add form validation with react-hook-form
- [x] Write frontend component tests
- [x] Final UI polish and bug fixes

#### Eros (Backend/Integration Focus)

- [x] Setup MongoDB connection and initial config
- [x] Create database models (User, Product)
- [x] Add initial API routes for products CRUD operations
- [x] Implement NextAuth configuration
- [x] Implement user authentication and protected routes
- [x] Add admin panel backend functionality
- [x] Integrate shopping cart with backend
- [x] Setup user profile functionality
- [x] Add API tests and error handling
- [x] Implement search and filtering functionality
- [ ] Setup deployment configuration
- [ ] Update documentation and README

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── Auth/            # Authentication components
│   ├── Cart/            # Shopping cart components
│   ├── Common/          # Shared components
│   ├── Layout/          # Layout components
│   └── Product/         # Product-related components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── lib/                 # Library code, utilities
├── models/              # MongoDB models
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   ├── auth/           # Auth pages
│   └── admin/          # Admin pages
├── styles/             # Global styles
├── types/              # TypeScript types
└── utils/              # Utility functions

public/                 # Static files
├── images/            # Game images
└── icons/             # UI icons
```

## 🔄 API Routes

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/session` - Get current session

### Products

- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[id]` - Update cart item
- `DELETE /api/cart/[id]` - Remove from cart

### Users

- `GET /api/users` - List users (admin)
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user (admin)

## 🔐 OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable OAuth2 and create credentials
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)
5. Add credentials to `.env.local`:
   ```
   GOOGLE_ID=your_client_id
   GOOGLE_SECRET=your_client_secret
   ```

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create a new app or select existing one
3. Set up Facebook Login
4. Add OAuth redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (development)
   - `https://your-domain.com/api/auth/callback/facebook` (production)
5. Add credentials to `.env.local`:
   ```
   FACEBOOK_ID=your_app_id
   FACEBOOK_SECRET=your_app_secret
   ```

## 🚀 Deployment

### Vercel Deployment

1. Fork this repository
2. Create an account on [Vercel](https://vercel.com)
3. Import your forked repository
4. Configure environment variables:
   ```
   MONGODB_URI=your_production_mongodb_uri
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET=your_production_secret
   GOOGLE_ID=your_google_client_id
   GOOGLE_SECRET=your_google_client_secret
   FACEBOOK_ID=your_facebook_app_id
   FACEBOOK_SECRET=your_facebook_app_secret
   ```
5. Deploy!

## 🛠 Tech Stack

### Frontend

- Next.js 13
- TypeScript
- Tailwind CSS
- React Hook Form
- NextAuth.js

### Backend

- MongoDB
- Node.js
- bcrypt for password hashing

### Testing

- Jest
- React Testing Library
- API route testing

### DevOps

- ESLint
- Prettier
- Git
- Vercel deployment

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or later
- MongoDB instance
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/gaming-marketplace.git
cd gaming-marketplace
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Building for Production

```bash
npm run build
npm start
```

## 📸 Screenshots

![Homepage](screenshots/home.png)
_Homepage with featured games_

![Products](screenshots/products.png)
_Product listing with filters_

![Cart](screenshots/cart.png)
_Shopping cart with real-time updates_

![Admin](screenshots/admin.png)
_Admin dashboard_

## 🌐 Live Demo

Visit the live demo at: [https://stoom.vercel.app](https://stoom.vercel.app)

## Commit Guidelines

Use semantic commit messages:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Styling updates
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Example: `feat: add product listing component`
