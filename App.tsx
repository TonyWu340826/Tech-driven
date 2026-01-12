import React, { useState, useEffect } from 'react';
import { ViewState, Tutor, Conversation } from './types';
import { MOCK_DISCOVERY_TUTORS, SCHEDULE_ITEMS, MOCK_CONVERSATIONS } from './constants';
import { HomeView } from './views/HomeView';
import { TutorDetailView } from './views/TutorDetailView';
import { BookingView } from './views/BookingView';
import { ScheduleView } from './views/ScheduleView';
import { DiscoveryView } from './views/DiscoveryView';
import { ProfileView } from './views/ProfileView';
import { MessagesView } from './views/MessagesView';
import { ChatDetailView } from './views/ChatDetailView';
import { ClassroomView } from './views/ClassroomView';
import { PersonalInfoView } from './views/PersonalInfoView';
import { FavoritesView } from './views/FavoritesView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { BottomNav } from './components/BottomNav';
import { authService, tutorService } from './src/services/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [initialDiscoveryCategory, setInitialDiscoveryCategory] = useState<string | undefined>(undefined);
  // Simple favorite management: storing IDs
  const [favoriteTutorIds, setFavoriteTutorIds] = useState<string[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check auth status
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentView('HOME');
      fetchTutors();
    }
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const data = await tutorService.getAll();
      // Ensure data matches frontend types
      const formattedTutors = data.map((t: any) => {
        let subjects = t.subjects;
        if (typeof subjects === 'string') {
          try { subjects = JSON.parse(subjects); } catch (e) { }
        }
        const subject = Array.isArray(subjects) ? subjects[0] : 'General';

        return {
          ...t,
          id: String(t.id),
          name: t.name,
          image: t.avatar || (t.gender === 'female'
            ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}&backgroundColor=ffdfbf`
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}&backgroundColor=c0aede`),
          price: Number(t.price_per_hour),
          subject: t.subject || subject,
          rating: t.rating ? Number(t.rating) : 5.0,
          reviewCount: t.review_count ? Number(t.review_count) : 0,
          description: t.bio,
          location: t.location || 'Online',
          gender: t.gender
        };
      });
      setTutors(formattedTutors);
    } catch (err) {
      console.error("Failed to fetch tutors", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setCurrentView('HOME');
    fetchTutors();
  };

  const handleTutorClick = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setCurrentView('TUTOR_DETAIL');
  };

  const handleBookClick = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setCurrentView('BOOKING');
  };

  const handleBookingConfirm = () => {
    setCurrentView('SCHEDULE');
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setCurrentView('CHAT_DETAIL');
  }

  const handleSearchClick = (category?: string) => {
    setInitialDiscoveryCategory(category);
    setCurrentView('DISCOVERY');
  }

  const toggleFavorite = (tutor: Tutor) => {
    setFavoriteTutorIds(prev => {
      if (prev.includes(tutor.id)) {
        return prev.filter(id => id !== tutor.id);
      } else {
        return [...prev, tutor.id];
      }
    });
  };

  const getFavoriteTutors = () => {
    // Use fetched tutors + mock discovery (until discovery is real)
    // Actually let's just use the loaded tutors for now
    const allTutors = [...tutors, ...MOCK_DISCOVERY_TUTORS];
    const uniqueTutors = Array.from(new Map(allTutors.map(item => [item.id, item])).values());
    return uniqueTutors.filter(t => favoriteTutorIds.includes(t.id));
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentView('LOGIN');
    setTutors([]);
  };

  const renderView = () => {
    switch (currentView) {
      case 'LOGIN':
        return <LoginView onLogin={handleLoginSuccess} onRegisterClick={() => setCurrentView('REGISTER')} />;
      case 'REGISTER':
        return <RegisterView onRegister={handleLoginSuccess} onLoginClick={() => setCurrentView('LOGIN')} />;
      case 'HOME':
        return <HomeView tutors={tutors} onTutorClick={handleTutorClick} onSearchClick={handleSearchClick} />;
      case 'DISCOVERY':
        return <DiscoveryView tutors={tutors} initialCategory={initialDiscoveryCategory} onBack={() => setCurrentView('HOME')} onTutorClick={handleTutorClick} />;
      case 'TUTOR_DETAIL':
        if (!selectedTutor) return null;
        return <TutorDetailView
          tutor={selectedTutor}
          isFavorite={favoriteTutorIds.includes(selectedTutor.id)}
          onBack={() => setCurrentView('HOME')}
          onBook={handleBookClick}
          onToggleFavorite={toggleFavorite}
        />;
      case 'BOOKING':
        if (!selectedTutor) return null;
        return <BookingView tutor={selectedTutor} onBack={() => setCurrentView('TUTOR_DETAIL')} onConfirm={handleBookingConfirm} />;
      case 'SCHEDULE':
        return <ScheduleView
          scheduleItems={SCHEDULE_ITEMS}
          onJoinClass={() => setCurrentView('CLASSROOM')}
          onContactTutor={() => setCurrentView('MESSAGES')}
        />;
      case 'CLASSROOM':
        return <ClassroomView onLeave={() => setCurrentView('SCHEDULE')} />;
      case 'MESSAGES':
        return <MessagesView conversations={MOCK_CONVERSATIONS} onConversationClick={handleConversationClick} />;
      case 'CHAT_DETAIL':
        if (!selectedConversation) return null;
        return <ChatDetailView conversation={selectedConversation} onBack={() => setCurrentView('MESSAGES')} />;
      case 'PROFILE':
        return <ProfileView
          onNavigate={setCurrentView}
          favoritesCount={favoriteTutorIds.length}
          onLogout={handleLogout}
        />;
      case 'PERSONAL_INFO':
        return <PersonalInfoView onBack={() => setCurrentView('PROFILE')} />;
      case 'FAVORITES':
        return <FavoritesView
          tutors={getFavoriteTutors()}
          onBack={() => setCurrentView('PROFILE')}
          onTutorClick={handleTutorClick}
          onRemove={toggleFavorite}
        />;
      default:
        return <HomeView tutors={tutors} onTutorClick={handleTutorClick} onSearchClick={() => handleSearchClick()} />;
    }
  };

  const shouldShowBottomNav = ['HOME', 'SCHEDULE', 'MESSAGES', 'PROFILE'].includes(currentView);

  return (
    <div className="mx-auto max-w-md bg-background-light dark:bg-background-dark min-h-screen relative shadow-2xl overflow-hidden">
      {renderView()}
      {shouldShowBottomNav && (
        <BottomNav currentView={currentView} onNavigate={setCurrentView} />
      )}
    </div>
  );
};

export default App;