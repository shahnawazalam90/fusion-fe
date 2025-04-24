import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, user }) {
  return user?.token ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
