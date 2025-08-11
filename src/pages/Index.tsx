import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { Header } from '@/components/Header';
import { StageLayout } from '@/components/layout/StageLayout';
import { ChatDrawer } from '@/components/mobile/ChatDrawer';
import { UsersDrawer } from '@/components/mobile/UsersDrawer';
import { LoginPage } from '@/components/LoginPage';
import { useTranslation } from 'react-i18next';
import {signal} from '../service/signal'
signal.connect()

const Index = () => {
  const { t, i18n } = useTranslation();
  const lang = useUIStore(s => s.lang);
  const theme = useUIStore(s => s.theme);
  const isAuthenticated = useUIStore(s => s.isAuthenticated);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    i18n.changeLanguage(lang);
  }, [lang, theme, i18n]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Virtual Classroom',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Adobe Connect Clone — Virtual Classroom</title>
        <meta name="description" content="Adobe Connect clone with chat, users, files, quizzes, RTL, and dark mode." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <Header />
      <main role="main">
        <StageLayout />
      </main>

      <ChatDrawer />
      <UsersDrawer />
    </div>
  );
};

export default Index;
