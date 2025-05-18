# Vamos Expeditions Backend

A robust backend system for managing travel expeditions, built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- **User Management**: Complete authentication and authorization system
- **Travel Management**: Handle expeditions, bookings, and itineraries
- **Hotel System**: Manage hotels, rooms, and availability
- **Quotation System**: Generate and manage travel quotes
- **Notification System**: Real-time notifications via Socket.IO
- **Document Generation**: PDF generation for reports and quotations
- **Email Service**: Automated email notifications using templates
- **File Management**: Cloud storage integration with Cloudinary
- **Data Export**: Excel file generation for reports

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Caching**: Redis
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **PDF Generation**: PDFMake
- **Excel Processing**: ExcelJS

## 📁 Project Structure

```
src/
├── app.ts              # Application entry point
├── config/             # Configuration files
├── core/               # Core utilities and adapters
├── data/              # Data layer (database)
├── domain/            # Business logic and entities
├── infrastructure/    # External services integration
└── presentation/      # API routes and controllers
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PNPM package manager
- PostgreSQL database
- Redis server

### Installation

1. Clone the repository
2. Copy `.env.template` to `.env` and configure environment variables
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Sync database schema:
   ```bash
   npx prisma db pull
   npx prisma generate
   ```
5. Seed database with initial data:
   ```bash
   pnpm run seed
   ```
  
6. Start development server:
   ```bash
   pnpm run dev
   ```

## 🔧 Available Scripts

- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm run start:dev`: Build and start in development mode
- `pnpm run start:prod`: Start production server
- `pnpm run seed`: Seed database with initial data
- `pnpm run seed:excel`: Import data from Excel files

## 🔒 Environment Variables

Copy `.env.template` to `.env` and configure:

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT tokens
- `REDIS_URL`: Redis connection string
- `CLOUDINARY_*`: Cloudinary credentials
- `SMTP_*`: Email server configuration

## 🔐 Authentication

The API uses JWT for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

## 👥 User Roles

- `MANAGER_ROLE`: Full system access
- `USER_ROLE`: Limited access to specific features

## 📝 API Documentation

Detailed API documentation is available at `/api/docs` when running the server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.
