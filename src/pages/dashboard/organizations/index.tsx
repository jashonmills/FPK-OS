import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple redirect to the main organizations hub
const OrganizationsIndex = () => {
  return <Navigate to="/dashboard/organizations" replace />;
};

export default OrganizationsIndex;