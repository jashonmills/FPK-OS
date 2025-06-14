
import React from 'react';
import { UserUploadedBook } from '@/hooks/useUserUploadedBooks';
import UserUploadItem from './UserUploadItem';

interface UserUploadsGridViewProps {
  uploads: UserUploadedBook[];
  onView: (upload: UserUploadedBook) => void;
}

const UserUploadsGridView: React.FC<UserUploadsGridViewProps> = ({ uploads, onView }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {uploads.map((upload) => (
        <UserUploadItem
          key={upload.id}
          upload={upload}
          onView={onView}
          viewMode="grid"
        />
      ))}
    </div>
  );
};

export default UserUploadsGridView;
