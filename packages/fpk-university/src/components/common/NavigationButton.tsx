import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps } from '@/components/ui/button';

interface NavigationButtonProps extends ButtonProps {
  to: string;
  external?: boolean;
  children: React.ReactNode;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  to, 
  external = false, 
  children, 
  onClick,
  ...props 
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    
    if (external || to.startsWith('http') || to.startsWith('//')) {
      window.location.href = to;
    } else {
      navigate(to);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
};