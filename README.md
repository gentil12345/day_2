# SmartPark CRPMS — Car Repair Payment Management System

**Company:** SmartPark, Rubavu District, Western Province, Rwanda  
**Assessment:** CATTSS National Integrated Assessment 2024-2025

---

## Project Structure

```
FirstName_LastName_National_Practical_Exam_2025/
├── backend-project/        # Node.js + Express + MongoDB API
│   ├── models/             # Mongoose data models
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Car.js
│   │   ├── ServiceRecord.js
│   │   └── Payment.js
│   ├── routes/             # Express route handlers
│   │   ├── auth.js
│   │   ├── services.js
│   │   ├── cars.js
│   │   ├── serviceRecords.js
│   │   ├── payments.js
│   │   └── reports.js
│   ├── middleware/
│   │   └── auth.js         # Session-based auth middleware
│   ├── server.js           # Express app entry point
│   ├── seed.js             # Database seeder
│   └── .env                # Environment variables
│
└── frontend-project/       # React.js + Tailwind CSS
    └── src/
        ├── components/
        │   └── Navbar.js
        ├── context/
        │   └── AuthContext.js
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Cars.js
        │   ├── Services.js
        │   ├── ServiceRecords.js
        │   ├── Payments.js
        │   └── Reports.js
        ├── api.js
        └── App.js
```

---

## ERD (Entity Relationship Diagram)

```
Services (ServiceCode PK, ServiceName, ServicePrice)
    |
    | 1 : M
    |
ServiceRecord (RecordNumber PK, ServiceDate, PlateNumber FK, ServiceCode FK)
    |
    | 1 : 1
    |
Payment (PaymentNumber PK, AmountPaid, PaymentDate, RecordNumber FK)

Car (PlateNumber PK, type, Model, ManufacturingYear, DriverPhone, MechanicName)
    |
    | 1 : M
    |
ServiceRecord (PlateNumber FK)

User (username PK, password [bcrypt encrypted], role)
```

**Relationships:**
- One Car → Many ServiceRecords (1:M)
- One Service → Many ServiceRecords (1:M)
- One ServiceRecord → One Payment (1:1)

---

## Pre-loaded Services

| Code   | Service Name        | Price (RWF) |
|--------|---------------------|-------------|
| SRV001 | Engine Repair       | 150,000     |
| SRV002 | Transmission Repair | 80,000      |
| SRV003 | Oil Change          | 60,000      |
| SRV004 | Chain Replacement   | 40,000      |
| SRV005 | Disc Replacement    | 400,000     |
| SRV006 | Wheel Alignment     | 5,000       |

---

## Setup & Running

### Prerequisites
- Node.js v18+
- MongoDB (running locally on port 27017)

### Backend Setup

```bash
cd backend-project
npm install
npm run seed      # Seeds services + default admin user
npm run dev       # Start development server (port 5000)
```

### Frontend Setup

```bash
cd frontend-project
npm install
npm start         # Start React app (port 3000)
```

### Default Login Credentials
- **Username:** admin
- **Password:** Admin@2025!

---

## Features

- **Session-based authentication** with bcrypt password encryption
- **Cars** — Register cars with plate number, type, model, year, driver phone, mechanic
- **Services** — Manage repair services and pricing
- **Service Records** — Full CRUD (Create, Read, Update, Delete)
- **Payments** — Record payments linked to service records
- **Reports** — Invoice-style payment report with date filtering and print support
- **Responsive UI** built with Tailwind CSS
