
import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl md:text-6xl">
            Welcome to Our Platform
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your learning journey starts here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
