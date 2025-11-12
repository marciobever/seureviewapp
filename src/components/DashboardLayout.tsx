
import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import type { Page, UserProfile } from '../App';
import type { User } from '@supabase/supabase-js';
import { FloatingChatBot } from './FloatingChatBot';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onLogout: () => void;
  user: User;
  profile: UserProfile;
}

const SubNavLink: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full text-left text-sm pl-11 pr-4 py-2 rounded-md transition-colors duration-200 ${
            isActive
            ? 'text-orange-300 bg-orange-500/10 font-medium'
            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
        }`}
    >
        {label}
    </button>
);


const NavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
            isActive
            ? 'bg-orange-500/10 text-orange-300 font-semibold'
            : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
        }`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

const CollapsibleNavLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    menuKey: string;
    isActive: boolean;
    openMenu: string | null;
    setOpenMenu: (key: string | null) => void;
    children: React.ReactNode;
}> = ({ icon, label, menuKey, isActive, openMenu, setOpenMenu, children }) => {
    const isOpen = openMenu === menuKey;

    const handleClick = () => {
        setOpenMenu(isOpen ? null : menuKey);
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                    ? 'bg-slate-700/80 text-white'
                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                }`}
            >
                <div className="flex items-center space-x-3">
                    {icon}
                    <span className="font-medium">{label}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="pt-2 pb-1 space-y-1 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};


// Icons
const ContentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ReelsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const BotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const HelpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 1.152-.448 2.21-1.175 3-.728.79-1.825 1.5-1.825 2.5V17m0 2h.01" /></svg>;
const MagicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, profile, children, currentPage, setCurrentPage, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>('generators');

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email;
  const photoURL = profile?.avatar_url || user.user_metadata?.avatar_url;

  useEffect(() => {
    // Open parent menu if a child is active on load
    if (['contentGenerator', 'reelsGenerator', 'blogGenerator', 'videoScriptGenerator'].includes(currentPage)) setOpenMenu('generators');
    else if (['history', 'scheduling', 'campaigns'].includes(currentPage)) setOpenMenu('organization');
    else if (['profile', 'billing'].includes(currentPage)) setOpenMenu('account');
    else if (['apiKeys'].includes(currentPage)) setOpenMenu('settings');
  }, [currentPage]);

  const handleSetPage = (page: Page) => {
      setCurrentPage(page);
      setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 md:flex">
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 md:hidden animate-fade-in"
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-slate-800/80 backdrop-blur-md border-r border-slate-700 p-4 flex flex-col fixed h-full z-40 transition-transform transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-4 pt-2 pl-2">
            <Logo />
        </div>

        <div className="flex items-center space-x-3 p-2 my-4 border-b border-t border-slate-700 py-4">
            <img className="h-10 w-10 rounded-full object-cover" src={photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=0D8ABC&color=fff`} alt="User avatar" />
            <div>
                <p className="font-semibold text-white text-sm truncate">{displayName || 'Usuário'}</p>
                <div className="text-xs text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                    ⚡ {profile.credits} Créditos
                </div>
            </div>
        </div>

        <nav className="flex-grow flex flex-col space-y-2">
            
             <CollapsibleNavLink
                icon={<MagicIcon />}
                label="Geradores IA"
                menuKey="generators"
                isActive={['contentGenerator', 'reelsGenerator', 'blogGenerator', 'videoScriptGenerator'].includes(currentPage)}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
            >
                 <SubNavLink label="Conteúdo Social" isActive={currentPage === 'contentGenerator'} onClick={() => handleSetPage('contentGenerator')} />
                 <SubNavLink label="Artigos de Blog" isActive={currentPage === 'blogGenerator'} onClick={() => handleSetPage('blogGenerator')} />
                 <SubNavLink label="Roteiros de Vídeo" isActive={currentPage === 'videoScriptGenerator'} onClick={() => handleSetPage('videoScriptGenerator')} />
                 <SubNavLink label="Vídeos (Reels)" isActive={currentPage === 'reelsGenerator'} onClick={() => handleSetPage('reelsGenerator')} />
            </CollapsibleNavLink>

             <CollapsibleNavLink
                icon={<FolderIcon />}
                label="Organização"
                menuKey="organization"
                isActive={['history', 'scheduling', 'campaigns'].includes(currentPage)}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
            >
                <SubNavLink label="Histórico" isActive={currentPage === 'history'} onClick={() => handleSetPage('history')} />
                <SubNavLink label="Agendamentos" isActive={currentPage === 'scheduling'} onClick={() => handleSetPage('scheduling')} />
                <SubNavLink label="Campanhas" isActive={currentPage === 'campaigns'} onClick={() => handleSetPage('campaigns')} />
            </CollapsibleNavLink>
            
            <NavLink
                icon={<BotIcon />}
                label="Bot de Comentários"
                isActive={currentPage === 'commentBot'}
                onClick={() => handleSetPage('commentBot')}
            />

            <p className="px-4 pt-6 pb-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">Conta</p>
            
            <CollapsibleNavLink
                icon={<UserIcon />}
                label="Perfil"
                menuKey="account"
                isActive={['profile', 'billing'].includes(currentPage)}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
            >
                <SubNavLink label="Ver Perfil" isActive={currentPage === 'profile'} onClick={() => handleSetPage('profile')} />
                <SubNavLink label="Planos e Assinatura" isActive={currentPage === 'billing'} onClick={() => handleSetPage('billing')} />
            </CollapsibleNavLink>

            <CollapsibleNavLink
                icon={<SettingsIcon />}
                label="Configurações"
                menuKey="settings"
                isActive={currentPage === 'apiKeys'}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
            >
                <SubNavLink label="Chaves de API" isActive={currentPage === 'apiKeys'} onClick={() => handleSetPage('apiKeys')} />
            </CollapsibleNavLink>
        </nav>

        <div className="mt-auto border-t border-slate-700 pt-4 space-y-1">
             <NavLink
                icon={<HelpIcon />}
                label="Ajuda"
                isActive={currentPage === 'help'}
                onClick={() => handleSetPage('help')}
            />
            <NavLink
                icon={<LogoutIcon />}
                label="Sair"
                isActive={false}
                onClick={onLogout}
            />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col">
         {/* Mobile Header */}
        <header className="md:hidden sticky top-0 bg-slate-900/80 backdrop-blur-sm z-20 flex items-center justify-between p-4 border-b border-slate-700">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-300" aria-label="Open sidebar">
                <MenuIcon />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2">
                <Logo />
            </div>
             <div className="w-8"></div> {/* Spacer */}
        </header>
        <div className="flex-grow p-6 md:p-10 overflow-y-auto">
          {children}
        </div>
        <FloatingChatBot />
      </main>
    </div>
  );
};