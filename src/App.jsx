import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminEvents from "./pages/AdminEvents";
import UserDashboard from "./pages/UserDashboard";
import EventDashboard from "./components/EventDashboard";
import MyAccount from "./pages/MyAccount";
import ViewOnMapPage from "./pages/ViewOnMapPage";
import AdminViewBookings from "./pages/AdminViewBookings";
import AddEventOnMap from "./components/AddEventOnMap";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Admin Routes */}
            <Route
              path="/admindashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminusers"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminevents"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminEvents />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-view-bookings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminViewBookings />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/add-event-on-map"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AddEventOnMap />
                </ProtectedRoute>
              }
            />

            {/* User Routes */}
            <Route
              path="/userdashboard"
              element={
                <ProtectedRoute requiredRole="regular">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute requiredRole="regular">
                  <EventDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/view-on-map-page"
              element={
                <ProtectedRoute requiredRoles={["regular", "admin"]}>
                  <ViewOnMapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute requiredRole="regular">
                  <MyAccount />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
