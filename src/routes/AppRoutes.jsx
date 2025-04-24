import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/login/login';
import Create from '../pages/create-new-scenario/create-new';
import Confirmation from '../pages/confirmation/confirmation';
import Download from '../pages/download/download';
import Dashboard from '../pages/dashboard/dashboard';
import Scenario from '../pages/scenario1/scenario1';

function AppRoutes() {
  const user = useSelector((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute user={user}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute user={user}>
              <Create />
            </PrivateRoute>
          }
        />
        <Route
          path="/scenario"
          element={
            <PrivateRoute user={user}>
              <Scenario />
            </PrivateRoute>
          }
        />
        <Route
          path="/confirmation"
          element={
            <PrivateRoute user={user}>
              <Confirmation />
            </PrivateRoute>
          }
        />
        <Route
          path="/download"
          element={
            <PrivateRoute user={user}>
              <Download />
            </PrivateRoute>
          }
        />
        <Route path="/*" element={<Navigate to={user?.token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
