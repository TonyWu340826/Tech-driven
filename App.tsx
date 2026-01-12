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
import { MyBookingsView } from './views/MyBookingsView';
import { AccountLogsView } from './views/AccountLogsView';
import { CompletedClassesView } from './views/CompletedClassesView';
import { BottomNav } from './components/BottomNav';
import { authService, tutorService, bookingService } from './src/services/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [initialDiscoveryCategory, setInitialDiscoveryCategory] = useState<string | undefined>(undefined);
  const [favoriteTutorIds, setFavoriteTutorIds] = useState<string[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [bookingType, setBookingType] = useState<'online' | 'home'>('home');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentView('HOME');
      fetchTutors();
      fetchMyBookings();
    }
  }, []);
  const fetchTutors = async () => {
    try {
      setLoading(true);
      const data = await tutorService.getAll();
      const formattedTutors = (data || []).map((t: any) => {
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

  const fetchMyBookings = async () => {
    try {
      console.log('[DEBUG] Fetching my bookings...');
      const data = await bookingService.getMyBookings();
      console.log('[DEBUG] Raw bookings data received:', data);
      setMyBookings(data || []);
    } catch (error) {
      console.error('[DEBUG] Failed to fetch bookings:', error);
    }
  };

  const handleLoginSuccess = () => {
    setCurrentUser(authService.getCurrentUser());
    setCurrentView('HOME');
    fetchTutors();
    fetchMyBookings();
  };

  const handleTutorClick = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setCurrentView('TUTOR_DETAIL');
  };

  const handleBookClick = (tutor: Tutor, type: 'online' | 'home' = 'home') => {
    setSelectedTutor(tutor);
    setBookingType(type);
    setCurrentView('BOOKING');
  };

  const handleBookingConfirm = () => {
    fetchMyBookings();
    setCurrentView('SCHEDULE');
  };

  const toggleFavorite = (tutorId: string) => {
    setFavoriteTutorIds(prev =>
      prev.includes(tutorId) ? prev.filter(id => id !== tutorId) : [...prev, tutorId]
    );
  };

  const getFavoriteTutors = () => tutors.filter(t => favoriteTutorIds.includes(t.id));

  const handleSearchClick = (category?: string) => {
    setInitialDiscoveryCategory(category);
    setCurrentView('DISCOVERY');
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setCurrentView('CHAT_DETAIL');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentView('LOGIN');
  };

  const handleNavigate = (view: ViewState) => {
    if (view === 'SCHEDULE' || view === 'MY_BOOKINGS' || view === 'ACCOUNT_LOGS' || view === 'COMPLETED_CLASSES') {
      fetchMyBookings();
    }
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'REGISTER':
        return <RegisterView onBack={() => setCurrentView('LOGIN')} onRegisterSuccess={() => setCurrentView('LOGIN')} />;
      case 'LOGIN':
        return <LoginView onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentView('REGISTER')} />;
      case 'HOME':
        return <HomeView user={currentUser} tutors={tutors} onTutorClick={handleTutorClick} onSearchClick={handleSearchClick} />;
      case 'DISCOVERY':
        return <DiscoveryView initialCategory={initialDiscoveryCategory} tutors={tutors} onTutorClick={handleTutorClick} />;
      case 'TUTOR_DETAIL':
        if (!selectedTutor) return null;
        return (
          <TutorDetailView
            tutor={selectedTutor}
            isFavorite={favoriteTutorIds.includes(selectedTutor.id)}
            onBack={() => setCurrentView('HOME')}
            onBook={handleBookClick}
            onToggleFavorite={toggleFavorite}
          />
        );
      case 'BOOKING':
        if (!selectedTutor) return null;
        return <BookingView tutor={selectedTutor} initialType={bookingType} onBack={() => setCurrentView('TUTOR_DETAIL')} onConfirm={handleBookingConfirm} />;
      case 'SCHEDULE':
        const formattedSchedule = (myBookings || []).map(b => {
          // 1. 安全解析日期对象
          let start: Date;
          try {
            const rawS = b.startTime;
            if (rawS instanceof Date) {
              start = rawS;
            } else if (typeof rawS === 'string') {
              const t = new Date(rawS);
              if (isNaN(t.getTime())) {
                start = new Date(rawS.replace(/-/g, '/'));
              } else {
                start = t;
              }
            } else {
              console.warn('[Schedule] Invalid startTime:', rawS);
              start = new Date(0); // Fallback to 1970
            }
          } catch (e) {
            console.error('[Schedule] Error parsing startTime:', b.startTime, e);
            start = new Date(0);
          }

          if (isNaN(start.getTime())) start = new Date(0);

          let end: Date;
          try {
            const rawE = b.endTime;
            if (rawE instanceof Date) {
              end = rawE;
            } else if (typeof rawE === 'string') {
              const t = new Date(rawE);
              if (isNaN(t.getTime())) {
                end = new Date(rawE.replace(/-/g, '/'));
              } else {
                end = t;
              }
            } else {
              end = new Date(0);
            }
          } catch (e) {
            end = new Date(0);
          }

          if (isNaN(end.getTime())) end = new Date(0);

          // 2. 基于本地时间生成 YYYY-MM-DD
          const year = start.getFullYear();
          const month = String(start.getMonth() + 1).padStart(2, '0');
          const day = String(start.getDate()).padStart(2, '0');
          const dateOnly = `${year}-${month}-${day}`;

          return {
            id: String(b.id),
            tutorName: b.tutorName,
            tutorImage: b.tutorImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${b.tutorName}`,
            subject: b.subject,
            status: b.status === 'pending' || b.status === 'approved' ? 'upcoming' : b.status,
            startTime: start.getFullYear() === 1970 ? '--:--' : start.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
            endTime: end.getFullYear() === 1970 ? '--:--' : end.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }),
            date: dateOnly,
            type: b.type
          };
        });
        console.log('[DEBUG] Formatted schedule for view:', formattedSchedule);
        return (
          <ScheduleView
            scheduleItems={formattedSchedule as any}
            onJoinClass={() => setCurrentView('CLASSROOM')}
            onContactTutor={() => setCurrentView('MESSAGES')}
            onRefresh={fetchMyBookings}
          />
        );
      case 'CLASSROOM':
        return <ClassroomView onLeave={() => setCurrentView('SCHEDULE')} />;
      case 'MESSAGES':
        return <MessagesView conversations={MOCK_CONVERSATIONS} onConversationClick={handleConversationClick} />;
      case 'CHAT_DETAIL':
        if (!selectedConversation) return null;
        return <ChatDetailView conversation={selectedConversation} onBack={() => setCurrentView('MESSAGES')} />;
      case 'PROFILE':
        return <ProfileView
          user={currentUser}
          onNavigate={handleNavigate}
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
      case 'MY_BOOKINGS':
        return <MyBookingsView onBack={() => setCurrentView('PROFILE')} />;
      case 'ACCOUNT_LOGS':
        return <AccountLogsView onBack={() => setCurrentView('PROFILE')} />;
      case 'COMPLETED_CLASSES':
        return <CompletedClassesView onBack={() => setCurrentView('PROFILE')} />;
      default:
        return <HomeView user={currentUser} tutors={tutors} onTutorClick={handleTutorClick} onSearchClick={handleSearchClick} />;
    }
  };

  const shouldShowBottomNav = !['LOGIN', 'REGISTER', 'CLASSROOM', 'CHAT_DETAIL', 'BOOKING', 'TUTOR_DETAIL'].includes(currentView);

  return (
    <div className="mx-auto max-w-md bg-background-light dark:bg-background-dark min-h-screen relative shadow-2xl overflow-hidden">
      <div className="pb-20">
        {renderView()}
      </div>
      {shouldShowBottomNav && (
        <BottomNav currentView={currentView} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;