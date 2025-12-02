import React from 'react';
import StudentOverview from './StudentOverview';
import StudentLearning from './StudentLearning';
import StudentRequests from './StudentRequests';

interface StudentPanelProps {
  activeTab: string;
}

const StudentPanel: React.FC<StudentPanelProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'overview':
      return <StudentOverview />;
    case 'learning':
      return <StudentLearning />;
    case 'requests':
      return <StudentRequests />;
    default:
      return <StudentOverview />;
  }
};

export default StudentPanel;
