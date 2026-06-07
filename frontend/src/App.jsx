import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FaSearch } from "./utils/icons";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./components/Home";
import Doctors from "./components/Doctors";
import DoctorDetails from "./components/DoctorDetails";
import BookAppointment from "./components/BookAppointment";
import Appointments from "./components/Appointments";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import Contact from "./components/Contact";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageDoctors from "./components/ManageDoctors";
import ManageAppointments from "./components/ManageAppointments";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/doctors"       element={<Doctors />} />
          <Route path="/doctors/:id"   element={<DoctorDetails />} />
          <Route path="/book"          element={<BookAppointment />} />
          <Route path="/appointments"  element={<Appointments />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          <Route path="/admin/doctors" element={<ProtectedRoute><ManageDoctors /></ProtectedRoute>}/>
          <Route path="/admin/appointments" element={<ProtectedRoute><ManageAppointments /></ProtectedRoute>}/>
          <Route path="/admin-login" element={<AdminLogin />}/>
          <Route path="/about"         element={<About />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="*" element={
            <div className="empty-state" style={{ minHeight: "60vh" }}>
              <div className="empty-state-icon"><FaSearch size={32} /></div>
              <h4>404 - Page Not Found</h4>
              <p>The page you're looking for doesn't exist.</p>
              <Link to="/" className="btn-hc-primary" style={{ marginTop: "16px", display: "inline-flex" }}>
                Back to Home
              </Link>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
