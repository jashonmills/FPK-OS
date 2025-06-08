
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fpk-purple to-fpk-amber">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">FPK University</h1>
        <p className="text-xl">Redirecting to learner portal...</p>
      </div>
    </div>
  );
};

export default Index;
