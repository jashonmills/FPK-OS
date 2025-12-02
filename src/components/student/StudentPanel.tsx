import React from 'react';
import StudentOverview from './StudentOverview';
import StudentLearning from './StudentLearning';
import StudentRequests from './StudentRequests';

interface StudentPanelProps {
  activeTab: string;
  orgId?: string;
}

const StudentPanel: React.FC<StudentPanelProps> = ({ activeTab, orgId }) => {
  switch (activeTab) {
    case 'overview':
      return <StudentOverview orgId={orgId} />;
    case 'learning':
      return <StudentLearning orgId={orgId} />;
    case 'requests':
      return <StudentRequests orgId={orgId} />;
    default:
      return <StudentOverview orgId={orgId} />;
  }
};

export default StudentPanel;
