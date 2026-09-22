# RFQ Marketplace

A full-stack B2B Request for Quotation (RFQ) marketplace where buyers can create procurement requests and suppliers can discover RFQs and submit quotations.

## Features

### Buyer

- Register and login securely
- Create RFQs
- Edit RFQs
- Delete RFQs
- View own RFQs
- View quotations received from suppliers
- Form validation
- Loading, empty, and error states

### Supplier

- Register and login securely
- Browse available RFQs
- Search RFQs by product name
- Filter RFQs by delivery location
- View complete RFQ details
- Submit quotations
- View previously submitted quotations
- Form validation
- Loading, empty, and error states

### Authentication & Security

- JWT-based authentication
- Role-based authorization
- Password hashing using bcrypt
- Protected API endpoints
- Protected frontend routes
- Environment variables for sensitive configuration
- Backend request validation
- API error handling

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT
- Passlib
- bcrypt

### Database

- PostgreSQL

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: PostgreSQL

## Project Structure

```text
RFQ-Marketplace/
│
├── README.md
├── .gitignore
│
├── backend/
│   ├── .env
│   ├── requirements.txt
│   ├── database.py
│   │
│   └── app/
│       ├── main.py
│       ├── auth.py
│       │
│       ├── models/
│       │   ├── __init__.py
│       │   ├── user.py
│       │   ├── rfq.py
│       │   └── quotation.py
│       │
│       ├── schemas/
│       │   ├── auth.py
│       │   ├── rfq.py
│       │   └── quotation.py
│       │
│       └── routers/
│           ├── auth.py
│           ├── rfq.py
│           └── quotation.py
│
└── frontend/
    ├── .env
    ├── package.json
    │
    └── src/
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   ├── RFQCard.jsx
        │   └── QuotationList.jsx
        │
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── BuyerDashboard.jsx
        │   ├── SupplierDashboard.jsx
        │   ├── RFQDetails.jsx
        │   ├── QuotationForm.jsx
        │   └── MyQuotations.jsx
        │
        ├── services/
        │   └── api.js
        │
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

## Application Flow

```text
                    RFQ Marketplace
                          |
             +------------+------------+
             |                         |
           Buyer                   Supplier
             |                         |
          Register                  Register
             |                         |
           Login                    Login
             |                         |
      Buyer Dashboard         Supplier Dashboard
             |                         |
        Create RFQ              Browse RFQs
             |                         |
       Edit / Delete           Search / Filter
             |                         |
    View Quotations            View Details
             |                         |
             |                Submit Quotation
             |                         |
             +------------+------------+
                          |
                       PostgreSQL
```

## Database

The application uses PostgreSQL with three main tables.

### Users

Stores buyer and supplier accounts.

Fields:

- `id`
- `name`
- `email`
- `password_hash`
- `role`

### RFQs

Stores buyer procurement requests.

Fields:

- `id`
- `buyer_id`
- `product_name`
- `description`
- `quantity`
- `delivery_location`
- `deadline`
- `created_at`

### Quotations

Stores supplier responses to RFQs.

Fields:

- `id`
- `rfq_id`
- `supplier_id`
- `price`
- `estimated_delivery_time`
- `notes`
- `created_at`

## API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
```

### RFQs

```text
POST   /rfqs
GET    /rfqs
GET    /rfqs/my
GET    /rfqs/{rfq_id}
PUT    /rfqs/{rfq_id}
DELETE /rfqs/{rfq_id}
```

### Quotations

```text
POST /quotations/rfq/{rfq_id}
GET  /quotations/my
GET  /quotations/rfq/{rfq_id}
```

## How to Run

### Prerequisites

Make sure the following are installed:

- Python 3.14+
- Node.js
- npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd RFQ-Marketplace
```

### 2. Create PostgreSQL Database

Make sure PostgreSQL is running.

Create a database named:

```text
rfq_marketplace
```

The backend connects to PostgreSQL using the `DATABASE_URL` environment variable.

### 3. Setup Backend

Open Terminal 1.

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/rfq_marketplace
SECRET_KEY=YOUR_SECRET_KEY
```

Start the backend:

```powershell
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### 4. Setup Frontend

Open a second terminal.

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```powershell
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### 5. Open the Application

Open the following URL in your browser:

```text
http://localhost:5173
```

Register as either:

- Buyer
- Supplier

Then use the corresponding dashboard.

### Running Both Servers

The application requires both the frontend and backend servers to run.

#### Terminal 1 — Backend

```powershell
cd RFQ-Marketplace\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

#### Terminal 2 — Frontend

```powershell
cd RFQ-Marketplace\frontend
npm run dev
```

Application architecture:

```text
Browser
   |
   v
React + Vite
localhost:5173
   |
   | Axios / HTTP
   v
FastAPI
127.0.0.1:8000
   |
   v
PostgreSQL
rfq_marketplace
```

## Environment Variables

### Backend

Create `backend/.env`:

```env
DATABASE_URL=your_postgresql_connection_string
SECRET_KEY=your_jwt_secret
```

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Environment files should not be committed to GitHub.

## Authentication Flow

The application uses JWT authentication.

```text
User
 |
 | Login
 v
FastAPI
 |
 | Validate credentials
 v
JWT Token
 |
 v
React
 |
 | Bearer Token
 v
Protected API
 |
 | Verify JWT
 v
Role Authorization
 |
 v
Requested Resource
```

### Buyer Permissions

```text
Buyer
 ├── Create RFQ
 ├── Edit own RFQ
 ├── Delete own RFQ
 └── View quotations received for own RFQ
```

### Supplier Permissions

```text
Supplier
 ├── Browse RFQs
 ├── Search RFQs
 ├── Filter RFQs
 ├── View RFQ details
 ├── Submit quotation
 └── View own quotations
```

## Validation

The application validates data on both the frontend and backend.

Examples:

- Valid email format
- Password length
- Required fields
- Positive RFQ quantity
- Future RFQ deadline
- Positive quotation price
- Valid buyer/supplier role
- Maximum quotation notes length

Backend validation is implemented using Pydantic schemas.

## Error Handling

The application handles:

- Invalid login
- Duplicate registration
- Unauthorized requests
- Invalid roles
- Missing RFQs
- Invalid quotation requests
- API errors
- Loading states
- Empty states

## Responsive Design

The frontend is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive layouts are implemented for:

- Dashboards
- RFQ cards
- Supplier RFQ grid
- Quotation cards
- Forms
- Authentication pages

## Deployment

### Backend

The FastAPI backend can be deployed using Render.

Configure these environment variables in Render:

```text
DATABASE_URL
SECRET_KEY
```

### Frontend

The React frontend can be deployed using Vercel.

Configure:

```env
VITE_API_URL=https://YOUR-RENDER-BACKEND-URL
```

The frontend then communicates with the deployed FastAPI backend.

### Production Architecture

```text
User Browser
     |
     v
Vercel
React Frontend
     |
     | HTTPS API Requests
     v
Render
FastAPI Backend
     |
     v
PostgreSQL
```

## Future Improvements

Possible future improvements include:

- RFQ status management
- Supplier quotation comparison
- Quote acceptance and rejection
- Email notifications
- File attachments
- Pagination for large RFQ datasets
- Advanced filtering
- Buyer and supplier profiles
- Dashboard analytics
- Database migrations using Alembic

## Author

**Praveen Dane**

B.Tech — Computer Science Engineering (AI & ML)

JNTUH