
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import DualLanguageText from '@/components/DualLanguageText';
import { useTranslation } from 'react-i18next';
import QuoteOfTheDayCard from '@/components/dashboard/QuoteOfTheDayCard';
import WeatherScienceLabCard from '@/components/dashboard/WeatherScienceLabCard';
import APODCard from '@/components/dashboard/APODCard';
import NotificationDemo from '@/components/notifications/NotificationDemo';

const LearnerHome = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return t('dashboard.learner');
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          <DualLanguageText 
            primary={`${getGreeting()}, ${getDisplayName()}!`}
            fallback={`${getGreeting()}, ${getDisplayName()}!`}
          />
        </h1>
        <p className="text-muted-foreground text-lg">
          <DualLanguageText 
            primary={t('dashboard.welcomeMessage')}
            fallback="Ready to continue your learning journey today?"
          />
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Quote of the Day */}
        <div className="lg:col-span-1">
          <QuoteOfTheDayCard />
        </div>

        {/* Weather Science Lab */}
        <div className="lg:col-span-1">
          <WeatherScienceLabCard />
        </div>

        {/* Notification Demo */}
        <div className="lg:col-span-1">
          <NotificationDemo />
        </div>
      </div>

      {/* APOD Section */}
      <div className="mb-8">
        <APODCard />
      </div>
    </div>
  );
};

export default LearnerHome;
