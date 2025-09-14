import React, { useMemo } from 'react';
import { useAuth } from './context/AuthContext';
import type { ActiveModule } from './types';

import NavBar from './components/NavBar';
import ModuleInformat from './components/modules/ModuleInformat';
import ModuleEntrenat from './components/modules/ModuleEntrenat';
import ModuleActivat from './components/modules/ModuleActivat';
import ModulePerfil from './components/modules/ModulePerfil';
import ModuleProgres from './components/modules/ModuleProgres'; // 👈 NOVETAT
import AuthScreen from './screens/AuthScreen';

export default function App(): React.ReactElement {
  const { currentUser, loading } = useAuth();
  const [activeModule, setActiveModule] = React.useState<ActiveModule>("Informa't");

  const CurrentModule = useMemo(() => {
    switch (activeModule) {
      case "Informa't":
        return <ModuleInformat />;
      case "Entrena't":
        return <ModuleEntrenat />;
      case "Activa't":
        return <ModuleActivat profile={currentUser?.profile ?? null} />;
      case "Progrés": // 👈 NOVETAT
        return <ModuleProgres />;
      case 'Perfil':
        return <ModulePerfil />;
      default:
        return <ModuleInformat />;
    }
  }, [activeModule, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 text-brand-dark shadow-sm p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">Connecta&apos;t amb seny</h1>
      </header>

      <main className="flex-grow p-4 md:p-6 pb-24">
        <div className="max-w-4xl mx-auto">
          {CurrentModule}
        </div>
      </main>

      <NavBar activeModule={activeModule} setActiveModule={setActiveModule} />
    </div>
  );
}
