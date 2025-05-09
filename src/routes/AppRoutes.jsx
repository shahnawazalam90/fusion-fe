import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import Login from 'src/views/screens/login';
import Dashboard from 'src/views/screens/dashboard';
import Upload from 'src/views/screens/upload';
import CreateScenario from 'src/views/screens/createScenario';
import Reports from 'src/views/screens/reports';

function AppRoutes() {
  const user = useSelector((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute user={user} children={<Dashboard />} />
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute user={user} children={<Upload />} />
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute user={user} children={<CreateScenario />} />
          }
        />
        <Route
          path="/edit"
          element={
            <PrivateRoute user={user} children={<CreateScenario />} />
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute user={user} children={<Reports />} />
          }
        />
        <Route path="/*" element={<Navigate to={user?.token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
