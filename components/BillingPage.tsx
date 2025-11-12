import React from 'react';

const CheckIcon = () => (
    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

export const BillingPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Planos e Assinatura</h1>
            <p className="text-gray-400 mb-8">Gerencie seu plano, veja seu histórico de pagamentos e atualize suas informações.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Current Plan */}
                <div className="md:col-span-1 bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white">Seu Plano Atual</h3>
                    <div className="my-4">
                        <p className="text-4xl font-extrabold text-orange-400">PRO</p>
                        <p className="text-gray-400">R$49 / mês</p>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">Sua assinatura está ativa e será renovada em 20/08/2024.</p>
                    <button className="w-full px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg text-sm hover:bg-slate-600">
                        Gerenciar Assinatura
                    </button>
                </div>

                {/* Plan Details */}
                <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recursos do seu plano PRO:</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center"><CheckIcon /><span className="ml-3 text-gray-300">Gerações de review ilimitadas</span></li>
                        <li className="flex items-center"><CheckIcon /><span className="ml-3 text-gray-300">Geração de posts para redes</span></li>
                        <li className="flex items-center"><CheckIcon /><span className="ml-3 text-gray-300">Geração de imagem em alta qualidade</span></li>
                        <li className="flex items-center"><CheckIcon /><span className="ml-3 text-gray-300">Geração de Reels (Beta)</span></li>
                        <li className="flex items-center"><CheckIcon /><span className="ml-3 text-gray-300">Bot de Comentários (Em breve)</span></li>
                        <li className="flex items-center"><CheckIcon /><span className="ml-3 text-gray-300">Suporte prioritário</span></li>
                    </ul>
                     <div className="pt-4 mt-4 border-t border-slate-700 text-right">
                        <button className="px-5 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700">
                           Fazer Upgrade para Agência
                        </button>
                    </div>
                </div>
            </div>

             <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
                 <h3 className="text-lg font-semibold text-white mb-4">Histórico de Pagamentos</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Plano</th>
                                <th scope="col" className="px-6 py-3">Valor</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Recibo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-700">
                                <td className="px-6 py-4">20/07/2024</td>
                                <td className="px-6 py-4">PRO Mensal</td>
                                <td className="px-6 py-4">R$49.00</td>
                                <td className="px-6 py-4"><span className="bg-green-500/10 text-green-400 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Pago</span></td>
                                <td className="px-6 py-4"><a href="#" className="font-medium text-orange-400 hover:underline">Download</a></td>
                            </tr>
                             <tr className="border-b border-slate-700">
                                <td className="px-6 py-4">20/06/2024</td>
                                <td className="px-6 py-4">PRO Mensal</td>
                                <td className="px-6 py-4">R$49.00</td>
                                <td className="px-6 py-4"><span className="bg-green-500/10 text-green-400 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Pago</span></td>
                                <td className="px-6 py-4"><a href="#" className="font-medium text-orange-400 hover:underline">Download</a></td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
             </div>
        </div>
    );
};