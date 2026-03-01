# Feel Studio - Production Platform

Production-ready platform for Feel Studio, a cinematic short film service.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js) with email magic links
- **Payments**: iyzico (with mock provider for development)
- **File Storage**: S3-compatible storage (Supabase Storage recommended)

## Features

- ✅ User authentication with email magic links
- ✅ Product catalog and package tiers
- ✅ Order creation and management flow
- ✅ File uploads (photos/videos)
- ✅ Payment integration (iyzico)
- ✅ User dashboard with order tracking
- ✅ Admin panel for order management
- ✅ Revision request system
- ✅ QR-linked physical gift packages
- ✅ WhatsApp support integration

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose (for local database)
- PostgreSQL database (or use Docker)
- SMTP server for email (or use a service like SendGrid, Resend, etc.)
- (Optional) AWS S3 or Supabase Storage for file uploads
- (Optional) iyzico account for payments

## Setup Instructions

### 1. Clone and Install

```bash
cd iz-studio
npm install
```

### 2. Start Database with Docker

```bash
# Start PostgreSQL database
docker-compose up -d

# Check if database is running
docker-compose ps
```

The database will be available at:
- Host: `localhost`
- Port: `5432`
- Database: `izstudio`
- Username: `izstudio`
- Password: `izstudio123`

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (Docker default)
DATABASE_URL="postgresql://izstudio:izstudio123@localhost:5432/izstudio?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# Email (SMTP)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-password"
SMTP_FROM="noreply@izstudio.com"

# Payment Provider
PAYMENT_PROVIDER="mock" # or "iyzico" for production
IYZICO_API_KEY="" # Required if PAYMENT_PROVIDER=iyzico
IYZICO_SECRET_KEY="" # Required if PAYMENT_PROVIDER=iyzico

# Storage (Optional - for file uploads)
# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_BUCKET_NAME=""

# Or Supabase Storage
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_STORAGE_BUCKET=""
```

### 4. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate

# Seed database with products
npm run db:seed
```

### 5. Create Admin User

After creating your first user account, promote them to admin:

```sql
UPDATE "users" SET role = 'admin' WHERE email = 'your-email@example.com';
```

Or use Prisma Studio:

```bash
npm run db:studio
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
iz-studio/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth routes
│   │   ├── orders/       # Order management
│   │   ├── payment/     # Payment processing
│   │   └── admin/        # Admin APIs
│   ├── auth/             # Authentication pages
│   ├── products/         # Product catalog
│   ├── order/            # Order flow
│   ├── checkout/         # Payment checkout
│   ├── dashboard/        # User dashboard
│   ├── admin/             # Admin panel
│   └── v/                 # Public QR video viewer
├── components/           # React components
├── lib/                  # Utilities and helpers
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── payment.ts        # Payment provider interface
│   └── utils.ts          # Utility functions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seed script
└── middleware.ts         # Route protection
```

## Database Models

- **User**: User accounts with roles (user/admin)
- **Product**: Product catalog (Aşk, Hatıra, Çocuk)
- **PackageTier**: Pricing tiers for each product
- **Order**: Customer orders
- **OrderBrief**: Order details and story information
- **MediaAsset**: Uploaded photos/videos
- **RevisionRequest**: Revision requests from customers
- **DeliveryAsset**: Final delivered video files
- **Shipment**: Physical package tracking
- **QrLink**: QR codes for physical packages

## Order Flow

1. User browses products at `/products`
2. Selects product and tier at `/products/[slug]`
3. Starts order at `/order/start?product=...&tier=...`
4. Fills brief form at `/order/[orderCode]/brief`
5. Uploads media at `/order/[orderCode]/upload`
6. Pays at `/checkout/[orderCode]`
7. Tracks order at `/dashboard/orders/[orderCode]`

## Admin Features

- View and manage all orders at `/admin/orders`
- Update order status and add preview links
- View customer briefs and uploaded media
- Create QR links for physical packages
- Add shipment tracking information
- Internal admin notes

## Payment Integration

The platform includes a payment provider interface. By default, it uses a mock provider for development. To use iyzico:

1. Set `PAYMENT_PROVIDER=iyzico` in `.env.local`
2. Add your iyzico API credentials
3. Implement the `IyzicoPaymentProvider` class in `lib/payment.ts` with the actual iyzico SDK

## File Uploads

Currently uses a mock storage system. To implement real storage:

1. **AWS S3**: Update `app/api/orders/[orderCode]/upload/route.ts` to use AWS SDK
2. **Supabase Storage**: Use Supabase client library
3. Update the `getSignedUploadUrl` function with your storage provider

## QR Links for Physical Packages

Physical packages include QR codes that link to a public video viewer:

- Admin creates QR link via API: `POST /api/admin/orders/[orderCode]/qr`
- Public viewer at `/v/[slug]`
- Optional PIN code protection
- View count tracking

## WhatsApp Support

WhatsApp support buttons are integrated throughout the platform. Update the phone number in `lib/whatsapp.ts`:

```typescript
const WHATSAPP_NUMBER = '+90 5XX XXX XX XX'
```

## Docker Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View logs
docker-compose logs -f postgres

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

## Production Deployment

1. Set up PostgreSQL database (e.g., Supabase, Railway, Neon, or use Docker in production)
2. Configure production environment variables
3. Set up file storage (S3 or Supabase Storage)
4. Configure iyzico payment provider
5. Set up SMTP email service
6. Run database migrations: `npm run db:migrate`
7. Seed products: `npm run db:seed`
8. Build: `npm run build`
9. Start: `npm start`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database (dev)
- `npm run db:migrate` - Run migrations (prod)
- `npm run db:seed` - Seed database with products
- `npm run db:studio` - Open Prisma Studio

## License

Private - Feel Studio
