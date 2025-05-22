import { ReactNode } from 'react';
import Header from './Header';
import BackgroundCanvas from './BackgroundCanvas';

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div id="page" className="min-h-screen flex flex-col">
      <BackgroundCanvas />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 