# Healthcare Management System

A full-stack Healthcare Management System with **JWT Authentication**, **Role-Based Access Control (RBAC)**, doctor management, and appointment booking.

---

## Tech Stack

|    Layer     |               Technology                       |
|--------------|------------------------------------------------|
| **Frontend** | React 18 + Vite, Axios, React Router v6        |
| **Backend**  | Spring Boot 3.5, Spring Security, JWT          |
| **Database** | MySQL 8                                        |
| **Auth**     | JWT (JSON Web Tokens) + BCrypt password hashing|

---

## Roles & Access

|        Role        |        Register At        |                       Access                        |
|--------------------|---------------------------|-----------------------------------------------------|
| **PATIENT**        | `/register` → Patient tab | Book & view own appointments                        |
| **ADMIN (Doctor)** | `/register` → Doctor tab  | Full admin dashboard, manage doctors & appointments |

### Default Admin Account
> Created automatically on first server startup
```
Email:    admin@healthcare.com
Password: admin123
```

---

## Setup & Installation

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8
- Maven 3.8+

---

### 1. Database Setup

Create the database in MySQL:
```sql
CREATE DATABASE healthcare;
```

The application will create the required tables automatically via schema on startup.

---

### 2. Backend Setup

**Clone and configure:**
```bash
cd backend/src/main/resources
cp application.properties application-local.properties
```

Edit `application-local.properties` with your values:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/healthcare
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
jwt.secret=your_jwt_secret_key_at_least_32_chars
jwt.expiration=86400000
```

**Run the backend:**
```bash
cd backend
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

### Auth
| Method | Endpoint                    | Description                   |
|--------|-----------------------------|-------------------------------|
| `POST` | `/api/auth/register`        | Register a new Patient        |
| `POST` | `/api/auth/register-doctor` | Register a new Doctor (Admin) |
| `POST` | `/api/auth/login`           | Login (returns JWT token)     |

### Appointments
| Method | Endpoint              | Role   | Description                     |
|--------|-----------------------|--------|---------------------------------|
| `GET`  | `/api/appointments`   | ADMIN  | Get all appointments            |
| `GET`  | `/api/appointments/my`| PATIENT| Get current user's appointments |
| `POST` | `/api/appointments`   | PATIENT| Book an appointment             |

### Doctors
| Method  | Endpoint            | Role  | Description      |
|---------|---------------------|-------|------------------|
| `GET`   | `/api/doctors`      | Public| List all doctors |
| `POST`  | `/api/doctors`      | ADMIN | Add a doctor     |
| `DELETE`| `/api/doctors/{id}` | ADMIN | Remove a doctor  |

---

## Project Structure

```
healthcare/
├── backend/
│   └── src/main/java/com/siddhi/healthcare/
│       ├── controller/        # REST controllers
│       ├── model/             # Entity models + DTOs
│       ├── repository/        # JDBC repositories
│       └── security/          # JWT filter, config, seeder
├── frontend/
│   └── src/
│       ├── components/        # React components & pages
│       ├── utils/             # Shared utilities & icons
│       └── App.jsx            # Routes & layout
└── README.md
```

---

## Security Notes

- Passwords are hashed using **BCrypt**
- JWTs expire after **24 hours**
- All protected routes require `Authorization: Bearer <token>` header
- The Axios interceptor automatically attaches the token on every request
- **Never commit** `application-local.properties` or `.env` files

---

## Screenshots

| Page               | Description                                   |
|--------------------|-----------------------------------------------|
| `/register`        | Patient & Doctor registration with tab toggle |
| `/login`           | JWT-based login for both roles                |
| `/appointments`    | Patient's personal appointment history        |
| `/admin-dashboard` | Full admin panel for doctors & appointments   |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License - free to use and modify.
