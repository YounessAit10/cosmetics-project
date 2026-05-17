# Serenity - Premium Cosmetics E-Commerce Frontend

A modern, production-ready React e-commerce frontend for cosmetics products with multilingual support (French, English, Arabic), dark mode, and comprehensive shopping features.

## Features

### 🌍 Multilingual Support
- **3 Languages**: English (en), French (fr), Arabic (ar)
- Language switcher in navbar
- RTL support for Arabic
- Persistent language preference (localStorage)

### 🎨 Dark Mode
- Light/Dark theme toggle
- Smooth theme transitions
- Persistent theme preference (localStorage)
- Optimized contrast for both modes

### 📱 Responsive Design
- Mobile-first approach
- Fully responsive across all devices
- Touch-friendly navigation

### 🛒 E-Commerce Features
- Product catalog with filtering
- Product details page
- Shopping cart with quantity management
- Checkout flow
- Mock payment system
- Cart persistence (localStorage)

### 🏗️ Clean Architecture
- Reusable components
- Custom hooks for cart, theme, and language
- Modular folder structure
- Type-safe props

## Tech Stack

- **React** 19.2.5
- **React Router** 6.20.0
- **Tailwind CSS** 3.4.0
- **i18next** 23.7.6 (Internationalization)
- **Lucide React** (Icons)
- **Vite** (Build tool)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   └── Loader.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   ├── Cart.jsx
│   └── Checkout.jsx
├── hooks/              # Custom hooks
│   ├── useCart.js
│   ├── useTheme.js
│   └── useLanguage.js
├── config/             # Configuration files
│   └── i18n.js         # i18next configuration
├── data/               # Mock data
│   └── products.js
├── locales/            # Translation files
│   ├── en.json
│   ├── fr.json
│   └── ar.json
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles (Tailwind)
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### 1. Install Dependencies
```bash
cd FRONTEND
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## Usage

### Language Switching
- Click the language dropdown in the navbar (EN/FR/AR)
- Language preference is saved automatically

### Dark Mode Toggle
- Click the sun/moon icon in the navbar
- Theme preference is saved automatically
- Arabic content automatically uses RTL layout

### Shopping
1. Browse products on `/products`
2. Click a product card for details on `/product/:id`
3. Add items to cart with quantity adjustment
4. View cart at `/cart`
5. Proceed to checkout at `/checkout`

## Custom Hooks

### useCart()
Manages shopping cart state with localStorage persistence
```javascript
const { cart, addToCart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
```

### useTheme()
Manages light/dark mode with localStorage
```javascript
const { isDark, toggleTheme } = useTheme();
```

### useLanguage()
Manages language switching with RTL support
```javascript
const { currentLanguage, changeLanguage, isRTL } = useLanguage();
```

## Key Components

### Navbar
- Logo and branding
- Navigation links
- Language switcher
- Dark mode toggle
- Cart counter with badge

### ProductCard
- Product image with hover effects
- Product name and description
- Price display
- Add to cart button
- Wishlist button (UI only)

### ProductGrid
- Responsive grid layout (1-4 columns)
- Product filtering by category

### Footer
- Company information
- Quick links
- Contact details
- Newsletter subscription

## Data Structure

Products include:
- Multilingual names and descriptions
- Prices
- Images (using Unsplash URLs)
- Categories (skincare, acne, hydration)
- Ingredients lists

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Performance

- Lazy loading with React Router
- Optimized images
- Minimal bundle size (~150KB gzipped)
- Smooth animations with Tailwind CSS

## Future Enhancements

- Backend API integration
- Real payment processing
- User authentication
- Wishlist functionality
- Product reviews and ratings
- Search functionality
- Admin dashboard
- Analytics tracking

## License

MIT

## Support

For issues or feature requests, please create an issue in the repository.

---

**Happy shopping with Serenity! 🌿✨**
