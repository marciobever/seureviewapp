
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '../App';

interface ProfilePageProps {
    user: User;
    profile: UserProfile;
}

const InputField: React.FC<{ 
    label: string; 
    id: string; 
    type: string; 
    value: string; 
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    disabled?: boolean;
}> = ({ label, id, type, value, onChange, readOnly = false, disabled = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input 
            type={type} 
            id={id}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            disabled={disabled}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
        />
    </div>
);

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, profile }) => {
    const [fullName, setFullName] = useState(profile.full_name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Update state if profile prop changes
    useEffect(() => {
        setFullName(profile.full_name || '');
    }, [profile]);

    const photoURL = profile.avatar_url || user.user_metadata?.avatar_url;
    const displayName = profile.full_name || user.user_metadata?.full_name || user.email;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveStatus(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: fullName, updated_at: new Date().toISOString() })
                .eq('id', user.id);
            
            if (error) throw error;
            
            setSaveStatus({ message: 'Perfil atualizado com sucesso!', type: 'success' });

        } catch (error) {
            console.error("Error updating profile:", error);
            const errorMessage = (error as any).message || "Ocorreu um erro desconhecido.";
            setSaveStatus({ message: `Falha ao atualizar: ${errorMessage}`, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-8">Perfil</h1>
            <form onSubmit={handleUpdateProfile}>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
                    <div className="flex items-center space-x-6 mb-8">
                        <img 
                            className="h-24 w-24 rounded-full object-cover ring-4 ring-slate-700" 
                            src={photoURL || `https://ui-avatars.com/api/?name=${displayName}&background=ea580c&color=fff`} 
                            alt="User avatar" 
                        />
                        <div>
                            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
                            <p className="text-gray-400">{user.email}</p>
                            <button type="button" className="mt-2 text-sm text-orange-400 hover:text-orange-300 font-semibold disabled:opacity-50" disabled>
                                Alterar foto (em breve)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <InputField 
                            label="Nome Completo" 
                            id="fullName" 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <InputField 
                            label="Endereço de E-mail" 
                            id="email" 
                            type="email" 
                            value={user.email || ''} 
                            readOnly 
                            disabled
                        />
                        <InputField 
                            label="Alterar Senha" 
                            id="password" 
                            type="password" 
                            value="************" 
                            readOnly 
                            disabled
                        />
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-slate-700 text-right">
                         {saveStatus && (
                            <div className={`text-sm text-center mb-4 p-3 rounded-md ${saveStatus.type === 'success' ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                                {saveStatus.message}
                            </div>
                        )}
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 disabled:opacity-50">
                            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
