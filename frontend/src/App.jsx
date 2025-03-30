import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout Components
import PrivateRoute from "./components/layout/PrivateRoute";
import Navbar from "./components/layout/Navbar";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Workflow Components
import Dashboard from "./components/workflow/Dashboard";
import WorkflowList from "./components/workflow/WorkflowList";
import WorkflowCreate from "./components/workflow/WorkflowCreate";
import WorkflowDetail from "./components/workflow/WorkflowDetail";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/workflows"
              element={
                <PrivateRoute>
                  <WorkflowList />
                </PrivateRoute>
              }
            />
            <Route
              path="/workflows/create"
              element={
                <PrivateRoute>
                  <WorkflowCreate />
                </PrivateRoute>
              }
            />
            <Route
              path="/workflows/:id"
              element={
                <PrivateRoute>
                  <WorkflowDetail />
                </PrivateRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" />
      </div>
    </Router>
  );
}

export default App;
