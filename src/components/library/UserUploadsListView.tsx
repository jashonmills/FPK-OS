
import React from 'react';
import { UserUploadedBook } from '@/hooks/useUserUploadedBooks';
import UserUploadItem from './UserUploadItem';

interface UserUploadsListViewProps {
  uploads: UserUploadedBook[];
  onView: (upload: UserUploadedBook) => void;
  validatingPDF: string | null;
}

const UserUploadsListView: React.FC<UserUploadsListViewProps> = ({ uploads, onView, validatingPDF }) => {
  return (
    <div className="space-y-4">
      {uploads.map((upload) => (
        <UserUploadItem
          key={upload.id}
          upload={upload}
          onView={onView}
          viewMode="list"
        />
      ))}
    </div>
  );
};

export default UserUploadsListView;
