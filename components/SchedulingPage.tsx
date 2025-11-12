
import React, { useState, useEffect } from 'react';
import type { ScheduledPostItem } from '../types';

const ScheduledPostCard: React.FC<{ item: ScheduledPostItem; onCancel: (id: string) => void }> = ({ item, onCancel }) => {
    const { product, content, scheduledAt, id } = item;
    const formattedDate = new Date(scheduledAt).toLocaleString('pt-BR', {
        dateStyle: 'full',
        timeStyle: 'short'
    });

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col md:flex-row gap-6 animate-fade-in">
            <div className="flex-shrink-0 md:w-1/4">
                <img src={content.productImageUrl} alt={product.productName} className="w-full h-auto object-cover rounded-md mb-2"/>
                <h3 className="font-semibold text-white text-sm">{product.productName}</h3>
            </div>
            <div className="flex-grow md:w-3/4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="font-bold text-lg text-orange-400">{content.socialPostTitle}</h4>
                        <p className="text-sm text-gray-400">{formattedDate}</p>
                    </div>
                    <span className="bg-blue-500/10 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0">Agendado</span>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap mb-4 line-clamp-3">{content.socialPostBody}</p>
                <div className="text-right">
                    <button 
                        onClick={() => onCancel(id)}
                        className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 font-semibold rounded-lg text-sm hover:bg-red-600/30 hover:text-red-300"
                    >
                        Cancelar Agendamento
                    </button>
                </div>
            </div>
        </div>
    );
};

const CalendarView: React.FC<{ posts: ScheduledPostItem[] }> = ({ posts }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysInMonth = endOfMonth.getDate();

    const days = Array.from({ length: startDay }, (_, i) => <div key={`empty-${i}`} className="border-t border-r border-slate-700"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const postsForDay = posts.filter(p => {
            const postDate = new Date(p.scheduledAt);
            return postDate.getDate() === day &&
                   postDate.getMonth() === currentDate.getMonth() &&
                   postDate.getFullYear() === currentDate.getFullYear();
        });

        days.push(
            <div key={day} className="border-t border-r border-slate-700 p-2 min-h-[120px] flex flex-col">
                <span className={`font-bold ${new Date().toDateString() === date.toDateString() ? 'text-orange-400' : 'text-white'}`}>{day}</span>
                <div className="flex-grow space-y-1 mt-1 overflow-y-auto">
                    {postsForDay.map(post => (
                        <div key={post.id} className="bg-orange-500/20 p-1 rounded text-orange-300 text-xs truncate" title={post.content.socialPostTitle}>
                           {post.content.socialPostTitle}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="px-3 py-1 bg-slate-700 rounded-md hover:bg-slate-600">‹</button>
                <h3 className="text-xl font-bold text-white">{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="px-3 py-1 bg-slate-700 rounded-md hover:bg-slate-600">›</button>
            </div>
            <div className="grid grid-cols-7 border-l border-b border-slate-700">
                {weekDays.map(day => <div key={day} className="text-center font-semibold text-gray-400 py-2 border-t border-r border-slate-700">{day}</div>)}
                {days}
            </div>
        </div>
    );
};


export const SchedulingPage: React.FC = () => {
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPostItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'list' | 'calendar'>('list');

    useEffect(() => {
        try {
            const storedPosts = localStorage.getItem('seu-review-scheduled-posts');
            if (storedPosts) {
                setScheduledPosts(JSON.parse(storedPosts));
            }
        } catch (e) {
            console.error("Failed to load scheduled posts from localStorage", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const cancelSchedule = (id: string) => {
        if (window.confirm("Tem certeza de que deseja cancelar este agendamento?")) {
            const updatedPosts = scheduledPosts.filter(post => post.id !== id);
            localStorage.setItem('seu-review-scheduled-posts', JSON.stringify(updatedPosts));
            setScheduledPosts(updatedPosts);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-t-orange-500 border-slate-700 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Postagens Agendadas</h1>
                    <p className="text-gray-400">Aqui estão todos os seus conteúdos programados.</p>
                </div>
                 <div className="bg-slate-700 p-1 rounded-lg flex">
                    <button onClick={() => setView('list')} className={`px-4 py-1 text-sm font-semibold rounded-md ${view === 'list' ? 'bg-slate-800 text-white' : 'text-gray-400'}`}>Lista</button>
                    <button onClick={() => setView('calendar')} className={`px-4 py-1 text-sm font-semibold rounded-md ${view === 'calendar' ? 'bg-slate-800 text-white' : 'text-gray-400'}`}>Calendário</button>
                </div>
            </div>
            {scheduledPosts.length === 0 ? (
                <div className="text-center bg-slate-800 border border-slate-700 rounded-lg p-12">
                     <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <h3 className="mt-4 text-xl font-semibold text-white">Nenhum Agendamento</h3>
                    <p className="mt-2 text-gray-400">Você ainda não agendou nenhuma postagem. Use a "Central de Conteúdo" para programar suas publicações.</p>
                </div>
            ) : (
                <>
                    {view === 'list' && (
                        <div className="space-y-6">
                            {scheduledPosts.map(item => (
                                <ScheduledPostCard key={item.id} item={item} onCancel={cancelSchedule} />
                            ))}
                        </div>
                    )}
                     {view === 'calendar' && <CalendarView posts={scheduledPosts} />}
                </>
            )}
        </div>
    );
};

export default SchedulingPage;
