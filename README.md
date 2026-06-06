# Healthcare Management System

A full-stack Healthcare Management System built using **Spring Boot, React, and MySQL**. The application allows patients to browse doctors, book appointments, contact the healthcare center, and enables administrators to manage doctors, appointments, and inquiries through a dedicated dashboard.

## Features

### Patient Features

* View available doctors
* Search doctors by specialization
* View doctor details
* Book appointments
* View appointment information
* Contact healthcare support through contact form
* Responsive user interface

### Admin Features

* Secure Admin Login
* Dashboard Analytics
* Manage Doctors

  * Add Doctor
  * Edit Doctor
  * Delete Doctor
* Manage Appointments

  * View Appointments
  * Edit Appointment
  * Delete Appointment
  * Update Appointment Status
* Manage Contact Messages

  * View Messages
  * Delete Messages
* Logout Functionality

### Appointment Status Management

Appointments can have the following statuses:

* PENDING
* CONFIRMED
* CANCELLED

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS3

### Backend

* Spring Boot
* Spring Web
* JDBC Template

### Database

* MySQL

### Version Control

* Git
* GitHub

## Project Structure

```text
healthcare-management-system
│
├── healthcare-ui/              # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── src/main/java/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   ├── service/
│   └── HealthcareApplication.java
│
├── src/main/resources/
│   └── application.properties
│
└── pom.xml
```

## Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Doctors Page

![Doctors Page](screenshots/doctors.png)

### Appointment Booking

see folder strcture you anted it
not looking so good too basics its internship full stack java project so think according that
I did ui but see in this contact s page joh hai uske cntacts jane chahiye na admin ke pas toh waisi koi backend frontend connection hi nhi ki joh contact kare woh jaye admin ke pas dashboard pe woh bhi chaiye import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StatCard from "../components/StatCard";
import "./Dashboard.css";

function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8080/api/doctors"),
      axios.get("http://localhost:8080/api/appointments"),
    ])
      .then(([dRes, aRes]) => {
        setDoctors(dRes.data);
        setAppointments(aRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const uniquePatients = [...new Set(appointments.map((a) => a.patientName))].length;
  const recentAppts = appointments.slice(-5).reverse();

  const specializations = doctors.reduce((acc, d) => {
    if (d.specialization) acc[d.specialization] = (acc[d.specialization] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-header__inner">
            <div>
              <span className="badge-pill" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                📊 Admin Panel
              </span>
              <h1 className="section-title mt-2" style={{ color: "white" }}>Dashboard</h1>
              <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "4px" }}>
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <Link to="/book" className="btn-hc-white">
              + New Appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: "80px" }}>
        {loading ? (
          <div className="spinner-wrapper">
            <div className="hc-spinner" />
            <span style={{ color: "var(--gray-600)" }}>Loading dashboard...</span>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="dashboard-stats">
              <StatCard icon="👨‍⚕️" label="Total Doctors" value={doctors.length} color="blue" trend="Active" />
              <StatCard icon="📅" label="Total Appointments" value={appointments.length} color="green" trend="All time" />
              <StatCard icon="😊" label="Unique Patients" value={uniquePatients} color="purple" trend="Registered" />
              <StatCard icon="🏥" label="Specializations" value={Object.keys(specializations).length} color="orange" trend="Available" />
            </div>

            {/* Main Grid */}
            <div className="dashboard-main-grid">
              {/* Recent Appointments */}
              <div className="hc-card dashboard-appts">
                <div className="dashboard-section-header">
                  <h5>Recent Appointments</h5>
                  <Link to="/appointments" className="dashboard-see-all">View All →</Link>
                </div>
                {recentAppts.length === 0 ? (
                  <div className="empty-state" style={{ padding: "40px 20px" }}>
                    <div className="empty-state-icon">📅</div>
                    <h4>No appointments yet</h4>
                  </div>
                ) : (
                  <div className="dashboard-appts-list">
                    {recentAppts.map((appt, i) => (
                      <div key={appt.id} className="dashboard-appt-row">
                        <div className="dashboard-appt-num">#{appt.id}</div>
                        <div className="dashboard-appt-info">
                          <strong>{appt.patientName}</strong>
                          <span>Doc ID: {appt.doctorId}</span>
                        </div>
                        <div className="dashboard-appt-date">{appt.appointmentDate}</div>
                        <span className={badge-pill ${["badge-success","badge-primary","badge-warning"][i % 3]}}>
                          {["Confirmed","Active","Pending"][i % 3]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="dashboard-right">
                {/* Specialization breakdown */}
                <div className="hc-card dashboard-spec">
                  <div className="dashboard-section-header">
                    <h5>Doctors by Specialization</h5>
                    <Link to="/doctors" className="dashboard-see-all">View All →</Link>
                  </div>
                  {Object.keys(specializations).length === 0 ? (
                    <p style={{ color: "var(--gray-400)", fontSize: "0.9rem", textAlign: "center", padding: "20px" }}>No data</p>
                  ) : (
                    <div className="dashboard-spec-list">
                      {Object.entries(specializations).map(([spec, count]) => (
                        <div key={spec} className="dashboard-spec-row">
                          <span className="dashboard-spec-name">{spec}</span>
                          <div className="dashboard-spec-bar-wrap">
                            <div
                              className="dashboard-spec-bar"
                              style={{ width: ${(count / doctors.length) * 100}% }}
                            />
                          </div>
                          <span className="dashboard-spec-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div className="hc-card dashboard-quick">
                  <h5 className="mb-3" style={{ fontWeight: 800, color: "var(--dark)" }}>Quick Actions</h5>
                  <div className="dashboard-quick-grid">
                    {[
                      { icon: "📅", label: "Book Appointment", to: "/book", color: "blue" },
                      { icon: "👨‍⚕️", label: "View Doctors", to: "/doctors", color: "green" },
                      { icon: "📋", label: "Appointments", to: "/appointments", color: "purple" },
                      { icon: "📞", label: "Contact Us", to: "/contact", color: "orange" },
                    ].map((action) => (
                      <Link key={action.to} to={action.to} className="dashboard-quick-btn">
                        <span className="dashboard-quick-icon">{action.icon}</span>
                        <span>{action.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard; this is dashboard.jsx in src components floder for that how could we connect db and admin page to like we did for doctors and patiens wiase

Perfect. 👍

Abhi jo warning aa rahi hai:

LF will be replaced by CRLF

ye error nahi hai, Windows par normal Git warning hai. Ignore kar sakti ho.

Ab check karo:

git status

Agar sab staged hai toh output kuch aisa aayega:

Changes to be committed:

Uske baad:

git commit -m "Initial Healthcare Management System"

Commit successful ho jaye toh:

GitHub repo create karo

Example:

healthcare-management-system

Phir GitHub ke commands:

git branch -M main

git remote add origin https://github.com/YOUR_USERNAME/healthcare-management-system.git

git push -u origin main

Ek aur cheez check kar lo push se pehle:

Open:

.gitignore

Aur ensure karo ki ye entries hain:

target/
node_modules/
dist/
.env
.idea/
.vscode/

Agar nahi hain toh add kar do.

Tumhara project ab basically placement-ready stage par hai:

✅ Spring Boot Backend
✅ React Frontend
✅ MySQL Database
✅ Doctor CRUD
✅ Appointment CRUD
✅ Contact Management
✅ Admin Login
✅ Dashboard Analytics
✅ Protected Routes
✅ Production Build Passing

Ab next milestone:

GitHub → Vercel (Frontend) → Render/Railway (Backend) → Public Live URL

Pehle git commit chalao. Agar koi error aaye toh uska screenshot/output bhej dena.

PS D:\healthcare> git status
On branch main
Your branch is up to date with 'origin/main'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   .gitignore
        modified:   src/main/resources/application.properties

PS D:\healthcare> 

Acha, iska matlab tumne pehle kabhi GitHub se connect karke push kiya tha. 😊

Dekho:

On branch main
Your branch is up to date with 'origin/main'.

Ye line batati hai ki:

Git repository already GitHub se connected hai.
origin/main exist karta hai.
Bas tumhare latest changes commit hone baaki hain.

Ab next command:

git commit -m "Removed DB credentials and updated gitignore"

Agar commit successful ho jaye toh:

git push

Bas.

Push hone ke baad verify:

git status

Expected:

On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean

Ek baar push ho jaye toh GitHub repository ka link bhej dena (agar share karna comfortable ho), ya repository public/private hai bata dena.

Uske baad hum:

Frontend Deployment (Vercel)
React app deploy
Environment variables set
Build settings verify
Backend Deployment (Render)
Spring Boot deploy
MySQL connect
API URL update
Final Production Testing
Book appointment
Admin login
CRUD operations
Contact form

Aur phir tumhare paas resume aur placement ke liye ek live project URL hoga. 🚀

https://github.com/siddhipawar424/healthcare-management-system check it

Siddhi, repo URL mil gaya:

healthcare-management-system repository

Main GitHub repository ka direct code tree reliably access nahi kar paaya (GitHub search ne exact repo contents expose nahi kiye), isliye line-by-line audit nahi kar sakta. Lekin jo tumne yahan code aur features share kiye hain us basis par:

Current Project Status

✅ Spring Boot Backend
✅ React + Vite Frontend
✅ MySQL Integration
✅ Doctor CRUD (Add/Edit/Delete)
✅ Appointment CRUD
✅ Appointment Status (Pending/Confirmed/Cancelled)
✅ Contact Form + Contact Message Management
✅ Admin Login + Logout
✅ Protected Admin Dashboard
✅ Search & Filters
✅ Production Build Passing (npm run build)
✅ GitHub Repository Created

For a typical campus placement project, this is already stronger than many CRUD-only projects.

Before Deployment
1. README.md Improve Karo

Recruiters pehla ye dekhte hain.

README mein add karo:

Features
Tech Stack
Project Structure
Screenshots
Installation Steps
API Endpoints
Future Enhancements
2. Screenshots Upload Karo

GitHub README mein screenshots:

Home Page
Doctors Page
Appointment Booking
Admin Dashboard
Manage Doctors
Manage Appointments

Ye project ko instantly professional bana deta hai.

3. Remove Secrets

Ensure GitHub mein password nahi hai.

Current best practice:

spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
Deployment Recommendation (Free)
Frontend

Use:

Vercel

React + Vite projects ke liye easiest.

Backend

Use:

Render

Spring Boot deploy karne ke liye simple.

Database

Use:

Railway

Ya Render PostgreSQL.

Resume Rating

Current state:

7.5–8.5/10 placement project

Agar ye add kar do:

JWT Authentication
Better README
Screenshots
Live Deployment

toh:

8.5–9/10 placement project

ho sakta hai.

Mere hisaab se ab next priority
README polish
Screenshots
Deploy frontend
Deploy backend
JWT (optional if time permits)

JWT se pehle deployment kar lena. Live URL hona placement ke time JWT se zyada valuable hota hai.

ok give me readme file to add before deployment

You can replace your current README.md with the following. It's written in a professional style suitable for GitHub and placements.

Healthcare Management System
Healthcare Management System

A full-stack Healthcare Management System built using Spring Boot, React, and MySQL. The application allows patients to browse doctors, book appointments, contact the healthcare center, and enables administrators to manage doctors, appointments, and inquiries through a dedicated dashboard.

Features
Patient Features
View available doctors
Search doctors by specialization
View doctor details
Book appointments
View appointment information
Contact healthcare support through contact form
Responsive user interface
Admin Features
Secure Admin Login
Dashboard Analytics
Manage Doctors
Add Doctor
Edit Doctor
Delete Doctor
Manage Appointments
View Appointments
Edit Appointment
Delete Appointment
Update Appointment Status
Manage Contact Messages
View Messages
Delete Messages
Logout Functionality
Appointment Status Management

Appointments can have the following statuses:

PENDING
CONFIRMED
CANCELLED
Tech Stack
Frontend
React
Vite
React Router
Axios
CSS3
Backend
Spring Boot
Spring Web
JDBC Template
Database
MySQL
Version Control
Git
GitHub
Project Structure
healthcare-management-system
│
├── healthcare-ui/              # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── src/main/java/
│   ├── controller/
│   ├── model/
│   ├── repository/
│   ├── service/
│   └── HealthcareApplication.java
│
├── src/main/resources/
│   └── application.properties
│
└── pom.xml
Screenshots
Home Page

(Add Screenshot Here)

Doctors Page

(Add Screenshot Here)

Appointment Booking

(Add Screenshot Here)

Admin Dashboard

(Add Screenshot Here)

Manage Doctors

(Add Screenshot Here)

Manage Appointments

(Add Screenshot Here)

Database Schema
Doctor
Field	Type
id	INT
name	VARCHAR
specialization	VARCHAR
experience	INT
fees	DECIMAL
Appointment
Field	Type
id	INT
patient_name	VARCHAR
doctor_id	INT
appointment_date	DATE
status	VARCHAR
Contact Message
Field	Type
id	INT
name	VARCHAR
email	VARCHAR
subject	VARCHAR
message	TEXT
Installation
Clone Repository
git clone https://github.com/siddhipawar424/healthcare-management-system.git
cd healthcare-management-system
Backend Setup

Configure database in:

src/main/resources/application.properties

Run Spring Boot application:

mvn spring-boot:run

Backend runs on:

http://localhost:8080
Frontend Setup

Navigate to frontend folder:

cd healthcare-ui

Install dependencies:

npm install

Start development server:

npm run dev

Frontend runs on:

http://localhost:5173
API Endpoints
Doctors
GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/{id}
DELETE /api/doctors/{id}
Appointments
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/{id}
DELETE /api/appointments/{id}
PATCH  /api/appointments/{id}/status
Contact Messages
GET    /api/contact
POST   /api/contact
DELETE /api/contact/{id}
Future Enhancements
JWT Authentication
Role-Based Access Control
Email Notifications
Doctor Availability Scheduling
Patient Portal
Medical Records Management
Online Payments
Deployment with Docker
Learning Outcomes

Through this project, I gained practical experience in:

Building REST APIs with Spring Boot
React Component Architecture
CRUD Operations
MySQL Database Design
API Integration using Axios
State Management with React Hooks
Admin Dashboard Development
Full-Stack Application Development
Author

Siddhi Pawar

GitHub:
https://github.com/siddhipawar424

After this, add 4–6 screenshots and your README will look much more professional when recruiters open the repository.

screenshot add kaise kare so it would be visible in github

GitHub README mein screenshot dikhane ka easiest method ye hai:

Step 1: Screenshots lo

Project run karo aur screenshots lo:

Home Page
Doctors Page
Book Appointment
Admin Dashboard
Manage Doctors
Manage Appointments
Step 2: GitHub repo mein folder banao

Repository ke root mein ek folder banao:

screenshots

Example:

healthcare-management-system
│
├── screenshots
│   ├── home.png
│   ├── doctors.png
│   ├── booking.png
│   ├── dashboard.png
│   ├── manage-doctors.png
│   └── manage-appointments.png
│
├── healthcare-ui
├── src
└── README.md
Step 3: Screenshots upload karo

VS Code mein:

git add .
git commit -m "Added project screenshots"
git push
Step 4: README mein images add karo

README ke Screenshots section ko replace karo:

## Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Contact Page

![Contact](screenshots/contact.png)

### Doctors Page

![Doctors Page](screenshots/doctors.png)

### Appointment Booking

![Appointment](screenshots/appointment.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admin_dashboard.png)

### Manage Doctors

![Manage Doctor](screenshots/manage_doctor.png)

### Manage Appointments

![Manage Appointment](screenshots/manage_appointment.png)

## Database Schema

### Doctor

| Field          | Type    |
| -------------- | ------- |
| id             | INT     |
| name           | VARCHAR |
| specialization | VARCHAR |
| experience     | INT     |
| fees           | DECIMAL |

### Appointment

| Field            | Type    |
| ---------------- | ------- |
| id               | INT     |
| patient_name     | VARCHAR |
| doctor_id        | INT     |
| appointment_date | DATE    |
| status           | VARCHAR |

### Contact Message

| Field   | Type    |
| ------- | ------- |
| id      | INT     |
| name    | VARCHAR |
| email   | VARCHAR |
| subject | VARCHAR |
| message | TEXT    |

## Installation

### Clone Repository

```bash
git clone https://github.com/siddhipawar424/healthcare-management-system.git
cd healthcare-management-system
```

### Backend Setup

Configure database in:

```properties
src/main/resources/application.properties
```

Run Spring Boot application:

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend Setup

Navigate to frontend folder:

```bash
cd healthcare-ui
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## API Endpoints

### Doctors

```http
GET    /api/doctors
POST   /api/doctors
PUT    /api/doctors/{id}
DELETE /api/doctors/{id}
```

### Appointments

```http
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/{id}
DELETE /api/appointments/{id}
PATCH  /api/appointments/{id}/status
```

### Contact Messages

```http
GET    /api/contact
POST   /api/contact
DELETE /api/contact/{id}
```

## Future Enhancements

* JWT Authentication
* Role-Based Access Control
* Email Notifications
* Doctor Availability Scheduling
* Patient Portal
* Medical Records Management
* Online Payments
* Deployment with Docker

## Learning Outcomes

Through this project, I gained practical experience in:

* Building REST APIs with Spring Boot
* React Component Architecture
* CRUD Operations
* MySQL Database Design
* API Integration using Axios
* State Management with React Hooks
* Admin Dashboard Development
* Full-Stack Application Development

## Author

**Siddhi Pawar**

GitHub:
https://github.com/siddhipawar424
