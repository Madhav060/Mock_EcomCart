# Mock E-Commerce Cart - Full Stack Application with Tailwind CSS

A full-stack shopping cart application built with **React**, **Redux Toolkit**, **Node.js**, **Express**, **MongoDB**, and **Tailwind CSS**.

---

## 🚀 Features

- Browse products catalog with beautiful Tailwind UI
- Add/remove items from cart
- Update item quantities dynamically
- Real-time cart total calculation
- Checkout with user information
- Order receipt generation
- Redux Toolkit for state management
- MongoDB for data persistence
- Fully responsive Tailwind design

---

## 🛠️ Tech Stack

**Frontend:**
  - React 18
  - Redux Toolkit
  - React Router
  - Axios
  - Tailwind CSS (Utility-first CSS framework)

**Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - CORS enabled


## 📁 Complete File Structure with Paths

📦 mock-ecom-cart/ [ROOT]
│
├── 📄 README.md [/mock-ecom-cart/README.md]
├── 📄 SETUP_GUIDE.md [/mock-ecom-cart/SETUP_GUIDE.md]
├── 📄 DEPLOYMENT_GUIDE.md [/mock-ecom-cart/DEPLOYMENT_GUIDE.md]
├── 📄 QUICK_START.md [/mock-ecom-cart/QUICK_START.md]
├── 📄 .gitignore [/mock-ecom-cart/.gitignore]
│
├── 📂 backend/ [/mock-ecom-cart/backend/]
│ ├── 📄 package.json [/mock-ecom-cart/backend/package.json]
│ ├── 📄 .env [/mock-ecom-cart/backend/.env]
│ ├── 📄 server.js [/mock-ecom-cart/backend/server.js]
│ ├── 📄 seedData.js [/mock-ecom-cart/backend/seedData.js]
│ │
│ ├── 📂 config/ [/mock-ecom-cart/backend/config/]
│ │ └── 📄 db.js [/mock-ecom-cart/backend/config/db.js]
│ │
│ ├── 📂 models/ [/mock-ecom-cart/backend/models/]
│ │ ├── 📄 Product.js [/mock-ecom-cart/backend/models/Product.js]
│ │ ├── 📄 Cart.js [/mock-ecom-cart/backend/models/Cart.js]
│ │ └── 📄 Order.js [/mock-ecom-cart/backend/models/Order.js]
│ │
│ ├── 📂 controllers/ [/mock-ecom-cart/backend/controllers/]
│ │ ├── 📄 productController.js [/mock-ecom-cart/backend/controllers/productController.js]
│ │ ├── 📄 cartController.js [/mock-ecom-cart/backend/controllers/cartController.js]
│ │ └── 📄 checkoutController.js [/mock-ecom-cart/backend/controllers/checkoutController.js]
│ │
│ └── 📂 routes/ [/mock-ecom-cart/backend/routes/]
│ ├── 📄 productRoutes.js [/mock-ecom-cart/backend/routes/productRoutes.js]
│ ├── 📄 cartRoutes.js [/mock-ecom-cart/backend/routes/cartRoutes.js]
│ └── 📄 checkoutRoutes.js [/mock-ecom-cart/backend/routes/checkoutRoutes.js]
│
└── 📂 frontend/ [/mock-ecom-cart/frontend/]
├── 📄 package.json [/mock-ecom-cart/frontend/package.json]
├── 📄 tailwind.config.js [/mock-ecom-cart/frontend/tailwind.config.js]
├── 📄 postcss.config.js [/mock-ecom-cart/frontend/postcss.config.js]
│
├── 📂 public/ [/mock-ecom-cart/frontend/public/]
│ └── 📄 index.html [/mock-ecom-cart/frontend/public/index.html]
│
└── 📂 src/ [/mock-ecom-cart/frontend/src/]
├── 📄 index.js [/mock-ecom-cart/frontend/src/index.js]
├── 📄 index.css [/mock-ecom-cart/frontend/src/index.css]
├── 📄 App.js [/mock-ecom-cart/frontend/src/App.js]
│
├── 📂 components/ [/mock-ecom-cart/frontend/src/components/]
│ ├── 📄 Navbar.js [/mock-ecom-cart/frontend/src/components/Navbar.js]
│ ├── 📄 ProductCard.js [/mock-ecom-cart/frontend/src/components/ProductCard.js]
│ ├── 📄 ProductList.js [/mock-ecom-cart/frontend/src/components/ProductList.js]
│ ├── 📄 Cart.js [/mock-ecom-cart/frontend/src/components/Cart.js]
│ ├── 📄 CartItem.js [/mock-ecom-cart/frontend/src/components/CartItem.js]
│ ├── 📄 Checkout.js [/mock-ecom-cart/frontend/src/components/Checkout.js]
│ └── 📄 Receipt.js [/mock-ecom-cart/frontend/src/components/Receipt.js]
│
├── 📂 pages/ [/mock-ecom-cart/frontend/src/pages/]
│ ├── 📄 Home.js [/mock-ecom-cart/frontend/src/pages/Home.js]
│ ├── 📄 CartPage.js [/mock-ecom-cart/frontend/src/pages/CartPage.js]
│ └── 📄 CheckoutPage.js [/mock-ecom-cart/frontend/src/pages/CheckoutPage.js]
│
├── 📂 redux/ [/mock-ecom-cart/frontend/src/redux/]
│ ├── 📄 store.js [/mock-ecom-cart/frontend/src/redux/store.js]
│ └── 📂 slices/ [/mock-ecom-cart/frontend/src/redux/slices/]
│ ├── 📄 productSlice.js [/mock-ecom-cart/frontend/src/redux/slices/productSlice.js]
│ └── 📄 cartSlice.js [/mock-ecom-cart/frontend/src/redux/slices/cartSlice.js]
  └── 📄 authSlice.js [/mock-ecom-cart/frontend/src/redux/slices/authSlice.js]
│
└── 📂 services/ [/mock-ecom-cart/frontend/src/services/]
└── 📄 api.js [/mock-ecom-cart/frontend/src/services/api.js]


#


## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)  
- MongoDB (Local or MongoDB Atlas)  
- npm or yarn

---

### Backend Setup

```bash
# Navigate to backend
cd mock-ecom-cart/backend

# Install dependencies
npm install

# Setup environment variables (.env)
# Default Mongo URI: mongodb://localhost:27017/ecom-cart

# Start backend server
npm run dev

### Frontend Setup
# Open new terminal
cd mock-ecom-cart/frontend

# Install dependencies (includes Tailwind CSS)
npm install

# Start React app
npm start


## 🎨 Tailwind CSS Setup

The project comes pre-configured with:
- ✅ Tailwind CSS v3
- ✅ PostCSS & Autoprefixer
- ✅ Custom color palette
- ✅ Responsive breakpoints
- ✅ Utility classes throughout

All components use Tailwind utility classes - no custom CSS files needed!

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get cart items and total
- `POST /api/cart` - Add item (body: `{productId, quantity}`)
- `PUT /api/cart/:id` - Update quantity (body: `{quantity}`)
- `DELETE /api/cart/:id` - Remove item

### Checkout
- `POST /api/checkout` - Process checkout (body: `{customerName, customerEmail}`)
- `GET /api/checkout/:id` - Get order by ID

## 📸 Screenshots

Add screenshots to `frontend/public/screenshots/`:
- products.png
- cart.png
- checkout.png
- receipt.png

## 🎬 Demo Video

[[Add your Loom/YouTube link here](https://drive.google.com/file/d/1aGJ_LPyzxp81VGpmzSiFNVXmZKfo6Vw3/view?usp=drivesdk)]

## 👨‍💻 Developer

[Your Name]
- GitHub: [Madhav060](https://github.com/Madhav060)
- Email: madhavthakur9625@gmai.com

## 📄 License

MIT License


#  Backend .env 
MONGO_URI=your_mongodb_connection_string

# A strong, random string used to sign tokens
JWT_SECRET=your_super_secret_key_123!@#

# The port your backend server will run on
PORT=5000