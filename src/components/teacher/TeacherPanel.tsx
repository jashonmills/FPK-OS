import React from 'react';
import TeacherOverview from '@/components/teacher/TeacherOverview';
import TeacherRequests from '@/components/teacher/TeacherRequests';
import TeacherStudents from '@/components/teacher/TeacherStudents';
import TeacherActivity from '@/components/teacher/TeacherActivity';
import TeacherTools from '@/components/teacher/TeacherTools';

export type TeacherTabId = 'overview' | 'requests' | 'students' | 'activity' | 'tools';

interface TeacherPanelProps {
  activeTab: TeacherTabId;
  setActiveTab: (tab: TeacherTabId) => void;
}

const TeacherPanel: React.FC<TeacherPanelProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="space-y-6">
      {activeTab === 'overview' && <TeacherOverview setActiveTab={setActiveTab} />}
      {activeTab === 'requests' && <TeacherRequests />}
      {activeTab === 'students' && <TeacherStudents />}
      {activeTab === 'activity' && <TeacherActivity />}
      {activeTab === 'tools' && <TeacherTools />}
    </div>
  );
};

export default TeacherPanel;
