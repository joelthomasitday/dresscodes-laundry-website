# Dresscode Laundry — Full-Stack Mobile-First Management System

## STEP 1: UI STYLE ANALYSIS

### Typography

- **Font**: Poppins (weights: 300–900)
- **H1**: text-5xl sm:text-6xl xl:text-7xl, font-bold
- **H2**: text-3xl sm:text-4xl, font-bold
- **H3**: text-xl sm:text-2xl, font-semibold
- **Body**: text-base / text-lg
- **Small**: text-sm / text-xs
- **Card titles**: text-2xl, font-semibold

### Colors

- **Primary brand**: `#0d9488` (teal-600), gradient `from-emerald-500 to-emerald-900`
- **Accent green**: `#008c5b`
- **Background**: `#f3f2ef` (warm off-white), `bg-gray-50`, `bg-white`
- **Admin theme**: Dark (`bg-black`, `bg-[#1a1a1a]`, `border-[#2a2a2a]`)
- **Text**: `text-gray-900`, `text-gray-600`, `text-gray-500`
- **Success**: `bg-green-100 text-green-800`, `bg-green-600`
- **Warning**: `bg-yellow-100 text-yellow-800`
- **Info**: `bg-blue-100 text-blue-800`
- **Error**: `text-red-500`, `border-red-500`

### Spacing

- **Section padding**: `py-16 sm:py-24`
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Card padding**: `p-6`
- **Gap**: `gap-4`, `gap-6`, `gap-8`
- **Nav height**: `h-20`

### Buttons

- **Primary**: `bg-gradient-to-r from-emerald-500 to-emerald-600/900 rounded-full`
- **Outline**: `border-gray-300 text-gray-800 bg-transparent rounded-full`
- **Admin**: `bg-green-600 hover:bg-green-700 rounded-lg`
- **Sizes**: default (`h-10 px-4`), sm (`h-9 px-3`), lg (`h-11 px-8`)

### Cards

- **Radius**: `rounded-2xl` / `rounded-3xl`
- **Shadow**: `shadow-md`, `hover:shadow-xl`
- **Glass effect**: `backdrop-blur-sm bg-white/90 border border-white/30`

### Navigation

- **Fixed top**, backdrop blur, slide-out mobile menu from right
- **Mobile**: hamburger → side drawer (w-80)

### Forms

- **Input height**: `h-10` with border styling
- **Validation**: Red borders + error text below
- **Labels**: Using shadcn Label component

---

## STEP 2: MOBILE-FIRST UI RULES (Applied to all new features)

1. Single-column layouts on mobile (<768px)
2. All tap targets ≥ 44px height
3. Card-based lists instead of tables
4. Sticky bottom action buttons on forms
5. Step-based forms (wizard pattern) for complex flows
6. Skeleton loaders for async content
7. Empty state illustrations + CTAs
8. Swipe-friendly interfaces
9. Bottom sheet modals on mobile

---

## STEP 3: TECH STACK

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (jose) with HttpOnly cookies
- **Email**: Nodemailer (Gmail SMTP)
- **File Uploads**: Cloudinary (free tier)

---

## STEP 4: DATABASE SCHEMAS

### User

```
{
  name, email, phone, passwordHash,
  role: 'customer' | 'admin' | 'staff' | 'rider',
  address, avatar,
  isActive: boolean,
  createdAt, updatedAt
}
```

### Order

```
{
  orderNumber (auto-generated),
  customer: { name, phone, email, address },
  services: [{ serviceId, name, quantity, weight, price }],
  status: enum ORDER_STATUS,
  pickupDate, pickupTimeSlot,
  deliveryDate,
  assignedStaff, assignedRider,
  totalAmount,
  notes,
  statusHistory: [{ status, timestamp, updatedBy }],
  createdAt, updatedAt
}
```

### Service

```
{
  name, description, category, price, unit,
  isActive: boolean,
  createdAt, updatedAt
}
```

### Invoice

```
{
  invoiceNumber, orderId,
  customer: { name, phone, email, address },
  items: [{ name, qty, price, total }],
  subtotal, tax, discount, total,
  pdfUrl, status: 'draft' | 'sent' | 'paid',
  createdAt, updatedAt
}
```

### RiderTask

```
{
  riderId, orderId,
  type: 'pickup' | 'delivery',
  status: 'assigned' | 'in_progress' | 'completed',
  customer: { name, phone, address },
  scheduledTime,
  completedTime,
  proofImageUrl,
  notes,
  createdAt, updatedAt
}
```

### Notification

```
{
  userId, orderId, type,
  title, message,
  isRead: boolean,
  channel: 'in_app' | 'email' | 'sms',
  createdAt
}
```

---

## STEP 5: ORDER STATUS FLOW

```
CREATED → PICKUP_SCHEDULED → PICKED_UP → IN_LAUNDRY → READY → OUT_FOR_DELIVERY → DELIVERED
```

---

## STEP 6: FEATURES

### Customer Features

- Guest booking (no login required)
- Service selection & scheduling
- Order tracking with timeline
- Invoice viewing via link

### Admin Features

- JWT-secured login
- Dashboard with analytics cards
- Order management (card-based mobile, table desktop)
- Status updates
- Invoice creation & PDF generation
- Service management

### Staff Features

- View assigned orders
- Update laundry status (IN_LAUNDRY → READY)

### Rider Features

- Pickup/delivery task list
- Update task status
- Upload proof of delivery
- Click-to-call customer

---

## STEP 7: API ROUTES

### Auth

- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Orders

- GET /api/orders (query: status, page, limit)
- POST /api/orders (create guest booking)
- GET /api/orders/[id]
- PATCH /api/orders/[id]/status
- GET /api/orders/track/[orderNumber]

### Services

- GET /api/services
- POST /api/services
- PATCH /api/services/[id]
- DELETE /api/services/[id]

### Invoices

- GET /api/invoices
- POST /api/invoices
- GET /api/invoices/[id]

### Rider Tasks

- GET /api/rider-tasks (query: riderId, status)
- PATCH /api/rider-tasks/[id]

### Notifications

- GET /api/notifications
- PATCH /api/notifications/[id]/read
