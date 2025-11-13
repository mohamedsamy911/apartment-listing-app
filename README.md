# 🏠 Apartment Listing App

A full-stack **Next.js 14** web application that allows users to **browse, search, and add apartments for sale** with images, descriptions, and contact information.

This project was built as part of a Software Engineer hiring assignment to demonstrate skills in **modern full-stack development**, including **Next.js (App Router)**, **Prisma ORM**, and **RESTful API design**.

---

## 🚀 Features

- 🔍 **Search & Filter** — Search apartments by name, unit number, or project name.  
- 🏢 **Add Apartments** — Floating action button opens a modal form to add a new apartment.  
- 🖼️ **Image Uploads** — Upload multiple apartment images via `/api/upload`.  
- 💾 **Persistent Storage** — Uses Prisma with PostgreSQL for data management.  
- 🧭 **App Router Ready** — Uses Next.js 14 with `next/navigation`, `use client` components, and dynamic routes.  
- 💅 **Responsive Design** — Built with Tailwind CSS for a clean, modern UI.  
- ⚙️ **Pagination** — Efficient backend pagination for apartment lists.  
- 📚 **API Documentation** — Interactive Swagger documentation available at `/docs`.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 14 (App Router) |
| **Form Handling** | React Hook Form |
| **Form Validation** | Zod |
| **Styling** | Tailwind CSS |
| **Database ORM** | Prisma |
| **Database** | PostgreSQL |
| **Image Handling** | API Route using `FormData` uploads |
| **Icons & UI** | React Icons |
| **Type Safety** | TypeScript |
| **API Documentation** | Swagger UI |
| **Containerization** | Docker & Docker Compose |

---

## 🐳 Quick Start with Docker Compose

### Single Command Setup

```bash
# Clone the repository
git clone https://github.com/mohamedsamy911/apartment-listing-app.git
cd apartment-listing-app

# Start the entire application with one command
docker-compose up --build
```

This will:
- 🐘 Start a PostgreSQL database
- 🔨 Build the Next.js application
- 📦 Install all dependencies
- 🗃️ Run database migrations
- 🚀 Start the development server

Visit the application at → [http://localhost:3000](http://localhost:3000)

### API Documentation

Access the interactive Swagger documentation at:  
📚 [http://localhost:3000/docs](http://localhost:3000/docs)

### Stop the Application

```bash
docker-compose down
```

---

## 🛠️ Manual Setup & Installation

If you prefer to run without Docker:

### 1. Clone the Repository

```bash
git clone https://github.com/mohamedsamy911/apartment-listing-app.git
cd apartment-listing-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and add your database credentials:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/apartmentdb"
```

### 4. Initialize the Database

```bash
npx prisma migrate dev --name init
```

### 5. Run the Development Server

```bash
npm run dev --no-turbo
```

Visit → [http://localhost:3000](http://localhost:3000)

---

## 📚 API Documentation

The application includes comprehensive API documentation powered by Swagger UI:

### 📖 Access Swagger Documentation

Visit: [http://localhost:3000/docs](http://localhost:3000/docs)

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/apartments` | Get paginated apartment list with search |
| `POST` | `/api/apartments` | Create new apartment |
| `GET` | `/api/apartments/{id}` | Get apartment details |
| `POST` | `/api/upload` | Upload images |
| `GET` | `/api/files/{filename}` | Get uploaded files |
| `HEAD` | `/api/files/{filename}` | Check if file exists |
| `GET` | `/api/docs` | Swagger json documentation |

---

## 📁 Project Structure

```bash
└── 📁src
    └── 📁app
        └── 📁apartments
            └── 📁[id]
                ├── page.tsx         # Apartment Details Page
        └── 📁api
            └── 📁apartments
                └── 📁[id]
                    ├── route.ts     # Apartment Details Route
                ├── route.ts         # Apartment List, Search, Pagination and Add Route
            └── 📁docs
                ├── route.ts         # Swagger UI Route
            └── 📁files
                └── 📁[filename]
                    ├── route.ts     # Fetch File Route
            └── 📁upload
                ├── route.ts         # Upload File Route
        └── 📁docs
            ├── components.yaml     # Swagger UI Component
            ├── page.tsx            # Swagger UI Page
        ├── favicon.ico             # Favicon
        ├── globals.css             # Global CSS
        ├── image.png               # App Logo
        ├── layout.tsx              # Layout Component
        ├── page.tsx                # App Page
    └── 📁components
        ├── AddApartmentButton.tsx  # Add Apartment Button
        ├── AddApartmentModal.tsx   # Add Apartment Modal
        ├── ApartmentList.tsx       # Apartment List Component
        ├── ClientLayout.tsx        # Client Layout Component
        ├── Footer.tsx              # Footer Component
        ├── Loading.tsx             # Loading Component
        ├── Navbar.tsx              # Navbar Component
        ├── Pagination.tsx          # Pagination Component
    └── 📁hooks
        ├── useApartments.ts        # Custom Hook for Apartment List
    └── 📁lib
        └── 📁constants
            ├── index.ts           # Default Page and Limit Constants
        └── 📁validations
            ├── Apartment.ts        # Apartment Validation Schema
        ├── prisma.ts              # Prisma Client Instance
        └── swagger.ts              # Swagger UI Configuration
```

---

## 🧩 Key Components

Absolutely! You should definitely update the Key Components section to highlight these important parts of your architecture. Here's the updated section for your README:

---

## 🧩 Key Components & Architecture

### 🏗️ `ApartmentListClient` Component
- **Main listing page** that displays apartments in a responsive grid layout
- **Handles search functionality** with real-time input and submission
- **Manages loading states** with skeleton screens during data fetching
- **Implements error handling** with user-friendly error messages
- **Responsive design** that works seamlessly across all device sizes
- **Integration with custom hook** for state management and data fetching

### 🎣 `useApartments` Custom Hook
- **Centralized data fetching logic** for apartment listings
- **Advanced pagination management** with URL synchronization
- **Smart search functionality** with  race condition prevention
- **Abort controller integration** for canceling outdated requests
- **Comprehensive state management** including loading, error, and data states
- **URL parameter synchronization** that maintains browser history

#### Hook Features:
- **Automatic URL updates** - Search and pagination parameters are reflected in the URL
- **Race condition prevention** - Aborts previous requests when new ones are made
- **Memory leak prevention** - Proper cleanup of abort controllers
- **Type-safe implementation** - Full TypeScript support with detailed interfaces
- **Reusable architecture** - Can be easily adapted for other listing pages

### 🏠 `AddApartmentModal` Component
- **Modal form component** for creating new apartment records
- **Handles image uploads** via `/api/upload` endpoint
- **Form validation** with user-friendly error messages
- **Auto-refresh functionality** after successful submission

### 🪄 `AddApartmentButton` Component
- **Floating Action Button (FAB)** positioned at bottom-right corner
- **Smooth animations** with hover effects and icon rotation
- **Modal trigger** that opens the apartment creation form

### 🧭 `Navbar` Component
- **Top navigation component** with responsive design
- **Global modal control** via `setOpen` prop drilling
- **Brand identity** with logo and application name

### 📄 `Pagination` Component
- **Smart page number calculation** that shows relevant pages based on current position
- **Accessible navigation** with proper ARIA labels and keyboard support
- **Visual indicators** for current page and available navigation

---

## 🔄 Data Flow Architecture

```
User Interaction → useApartments Hook → API Route → Database
       ↓
UI Update ← State Update ← Data Transformation
```

### State Management Flow:
1. **User triggers action** (search, pagination, initial load)
2. **useApartments hook** processes the request with proper error handling
3. **API route** handles data fetching with Prisma ORM
4. **Response data** is transformed and stored in hook state
5. **UI components** re-render with updated data and states
6. **URL is synchronized** to maintain shareable links

---

### 🗃️ `API Routes`

| Route                        | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `POST /api/apartments`       | Create new apartment                             |
| `GET  /api/apartments`       | Fetch paginated apartments (with search support) |
| `GET  /api/apartments/:id`   | Get single apartment details                     |
| `POST /api/upload`           | Handle image uploads                             |
| `GET  /api/files/:filename`  | Get image file                                   |
| `HEAD /api/files/:filename`  | Check if image file exists                       |

---

## ⚙️ Environment Variables

| Variable               | Description                                |
| ---------------------- | ------------------------------------------ |
| `DATABASE_URL`         | Connection string for PostgreSQL |

---

## 🧱 Prisma Schema Example

```prisma
model Apartment {
  id            String   @id @default(uuid())
  name          String
  unitNumber    String
  project       String
  description   String?
  price         Float
  contactNumber String
  imageUrls     String[]
  createdAt     DateTime @default(now())
}
```

## 📸 Screenshots

| Feature        | Preview                                         |
| -------------- | ----------------------------------------------- |
| Apartment List | ![List Screenshot](docs/screenshots/list.png)   |
| Add Modal      | ![Modal Screenshot](docs/screenshots/modal.png) |
| API Docs       | ![Docs Screenshot](docs/screenshots/docs.png)   |

---

## 🧑‍💻 Author

**Mohamed Samy**
Software Engineer — Full Stack Developer
🌐 [mohamedsamy911.github.io](https://mohamedsamy911.github.io)
💼 [LinkedIn](https://www.linkedin.com/in/mohamed-samy-ba0107141/)
📧 [mohamedadel74@gmail.com](mailto:mohamedadel74@gmail.com)

---

## 🪪 License

This project is licensed under the [MIT License](LICENSE).
