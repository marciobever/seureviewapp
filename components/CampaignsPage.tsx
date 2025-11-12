
import React, { useState } from 'react';
import type { Campaign } from '../types';

const mockCampaigns: Campaign[] = [
    { id: '1', name: 'Lançamento de Verão 2024', description: 'Campanha focada em produtos para o verão.', createdAt: '2024-07-15T10:00:00Z', contentCount: 12 },
    { id: '2', name: 'Black Friday Tech', description: 'Promoções de eletrônicos para a Black Friday.', createdAt: '2024-06-28T14:30:00Z', contentCount: 8 },
    { id: '3', name: 'Volta às Aulas', description: 'Materiais escolares e notebooks.', createdAt: '2024-07-20T09:00:00Z', contentCount: 5 },
];


export const CampaignsPage: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
    const [isCreating, setIsCreating] = useState(false);
    
    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Campanhas</h1>
                    <p className="text-gray-400">Organize seu conteúdo em campanhas para melhor acompanhamento.</p>
                </div>
                 <button 
                    onClick={() => setIsCreating(true)}
                    className="px-5 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700"
                 >
                     Criar Nova Campanha
                 </button>
            </div>
            
             {isCreating && (
                <div className="mb-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Nova Campanha</h2>
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome da Campanha</label>
                            <input type="text" id="name" className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                            <textarea id="desc" rows={2} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white" />
                        </div>
                        <div className="flex gap-4">
                            <button className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg text-sm">Salvar</button>
                            <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg text-sm">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}


            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome da Campanha</th>
                            <th scope="col" className="px-6 py-3">Descrição</th>
                            <th scope="col" className="px-6 py-3">Itens de Conteúdo</th>
                            <th scope="col" className="px-6 py-3">Data de Criação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map(campaign => (
                             <tr key={campaign.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                                <td className="px-6 py-4 font-semibold text-white">{campaign.name}</td>
                                <td className="px-6 py-4">{campaign.description}</td>
                                <td className="px-6 py-4 text-center">{campaign.contentCount}</td>
                                <td className="px-6 py-4">{new Date(campaign.createdAt).toLocaleDateString('pt-BR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {campaigns.length === 0 && (
                     <div className="text-center p-12">
                        <h3 className="text-xl font-semibold text-white">Nenhuma Campanha Criada</h3>
                        <p className="mt-2 text-gray-400">Clique em "Criar Nova Campanha" para começar a organizar seu conteúdo.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
