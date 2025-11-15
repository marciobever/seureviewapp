import React, { useState, useEffect, useCallback } from 'react';
import type { ProductOption, PostContent, HistoryItem, ScheduledPostItem } from '../types';
import { generatePostForProduct, getOptimizationSuggestions } from '../services/geminiService';
import { ImageGeneratorModal } from './ImageGeneratorModal';

type Tab = 'editor' | 'automation' | 'scheduling';

interface PostEditorPanelProps {
  product: ProductOption;
  onClose: () => void;
  provider: string;
}

const PanelLoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-12 h-12 border-4 border-t-orange-500 border-slate-700 rounded-full animate-spin"></div>
    <p className="text-gray-400 mt-4">Preparando a Central de Conteúdo...</p>
  </div>
);

/**
 * Fallback simples quando o generatePostForProduct falhar.
 * Usa só os dados do produto para montar uma legenda padrão.
 */
const buildFallbackContent = (
  product: ProductOption,
): PostContent & { productImageUrl: string } => {
  const priceLine = product.price ? `💰 Preço: ${product.price}` : '';
  const ratingLine = product.rating ? `⭐ Avaliação: ${product.rating.toFixed(1)} / 5` : '';
  const affiliateUrl = product.productUrl || '';

  const baseLines = [
    `🔥 ${product.productName}`,
    '',
    priceLine,
    ratingLine,
    '',
    'Clique no link e aproveite essa oferta exclusiva!',
    affiliateUrl ? `👉 ${affiliateUrl}` : '',
    '',
    '#Shopee #Oferta #Promoção #Achadinhos',
  ].filter(Boolean);

  const body = baseLines.join('\n');

  return {
    socialPostTitle: `Oferta Shopee: ${product.productName}`,
    socialPostBody: body,
    callToAction: 'Clique no link e aproveite essa oferta exclusiva!',
    affiliateUrl,
    postTemplates: [
      {
        name: 'Modelo Padrão',
        body,
      },
    ],
    productImageUrl: product.imageUrl,
  };
};

export const PostEditorPanel: React.FC<PostEditorPanelProps> = ({
  product,
  onClose,
  provider,
}) => {
  const [content, setContent] =
    useState<(PostContent & { productImageUrl: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('editor');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Automation state
  const [botKeyword, setBotKeyword] = useState('QUERO');
  const [botReply, setBotReply] = useState('');

  // Scheduling state
  const [scheduleDate, setScheduleDate] = useState('');

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      // Tenta usar o fluxo normal (n8n)
      const result = await generatePostForProduct(product, provider);

      // Se deu certo, usa o resultado
      setContent(result);

      setBotReply(
        `Olá! Vi que você tem interesse no ${product.productName}. 😊\n\n` +
          `Você pode encontrar mais detalhes e comprar com desconto através deste link: ${result.affiliateUrl}\n\n` +
          'Qualquer dúvida, é só chamar!',
      );

      // Salva no histórico local
      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        product,
        content: result,
        generatedAt: new Date().toISOString(),
      };
      const storedHistory = localStorage.getItem('seu-review-history');
      const history: HistoryItem[] = storedHistory ? JSON.parse(storedHistory) : [];
      const updatedHistory = [newHistoryItem, ...history].slice(0, 10);
      localStorage.setItem('seu-review-history', JSON.stringify(updatedHistory));

      // Sugestões de otimização
      try {
        const optimizationSuggestions = await getOptimizationSuggestions(
          result.socialPostTitle,
          result.socialPostBody,
        );
        setSuggestions(optimizationSuggestions);
      } catch (e) {
        console.error('Erro ao buscar sugestões de otimização:', e);
      }
    } catch (err) {
      console.error('Erro ao gerar conteúdo do produto:', err);

      const msg =
        err instanceof Error ? err.message : 'Falha inesperada ao gerar o conteúdo.';
      setError(
        `Não foi possível gerar automaticamente o conteúdo pelo serviço. ` +
          `Você ainda pode editar o texto abaixo normalmente.\n\nDetalhes: ${msg}`,
      );

      // Fallback: monta um conteúdo simples só com os dados do produto
      const fallback = buildFallbackContent(product);
      setContent(fallback);

      setBotReply(
        `Olá! Vi que você tem interesse no ${product.productName}. 😊\n\n` +
          `Você pode encontrar mais detalhes e comprar com desconto através deste link: ${
            fallback.affiliateUrl || fallback.productImageUrl || ''
          }\n\n` +
          'Qualquer dúvida, é só chamar!',
      );

      // Tentativa de sugestões com o fallback (se der erro, só loga)
      try {
        const optimizationSuggestions = await getOptimizationSuggestions(
          fallback.socialPostTitle,
          fallback.socialPostBody,
        );
        setSuggestions(optimizationSuggestions);
      } catch (e) {
        console.error('Erro ao buscar sugestões com fallback:', e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [product, provider]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleContentChange = (field: keyof PostContent, value: string) => {
    if (content) {
      setContent({ ...content, [field]: value });
    }
  };

  const handleTemplateChange = (
    index: number,
    field: 'name' | 'body',
    value: string,
  ) => {
    if (content) {
      const updatedTemplates = [...content.postTemplates];
      updatedTemplates[index] = { ...updatedTemplates[index], [field]: value };
      setContent({ ...content, postTemplates: updatedTemplates });
    }
  };

  const applyTemplate = (templateBody: string) => {
    handleContentChange('socialPostBody', templateBody);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Conteúdo copiado!');
  };

  const handleSaveAutomation = () => {
    alert(
      `Automação salva (simulação).\n\n` +
        `- Palavra-gatilho: "${botKeyword}"\n` +
        `- Resposta: "${botReply}"\n\n` +
        '(Esses dados depois irão para o webhook do n8n.)',
    );
  };

  const handleSchedulePost = () => {
    if (!scheduleDate || !content) {
      alert('Por favor, selecione uma data e hora para o agendamento.');
      return;
    }

    const newScheduledItem: ScheduledPostItem = {
      id: new Date().toISOString(),
      product,
      content,
      scheduledAt: scheduleDate,
    };

    try {
      const storedScheduledPosts = localStorage.getItem('seu-review-scheduled-posts');
      const scheduledPosts: ScheduledPostItem[] = storedScheduledPosts
        ? JSON.parse(storedScheduledPosts)
        : [];

      const updatedScheduledPosts = [...scheduledPosts, newScheduledItem].sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );

      localStorage.setItem(
        'seu-review-scheduled-posts',
        JSON.stringify(updatedScheduledPosts),
      );
      alert(
        `Post agendado com sucesso para ${new Date(scheduleDate).toLocaleString(
          'pt-BR',
        )}!\nVocê pode ver seus agendamentos em Perfil > Agendamentos.`,
      );
      onClose();
    } catch (error) {
      console.error('Failed to save scheduled post to localStorage', error);
      alert('Ocorreu um erro ao salvar o agendamento.');
    }
  };

  const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
        activeTab === tab
          ? 'text-orange-400 border-orange-400'
          : 'text-gray-400 border-transparent hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40 animate-fade-in" onClick={onClose}></div>

      {/* painel lateral */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-lg bg-slate-800 border-l border-slate-700 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out animate-fade-in">
        {/* header */}
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white truncate">Central de Conteúdo</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* tabs */}
        <div className="flex-shrink-0 border-b border-slate-700 flex">
          <TabButton tab="editor" label="✍️ Editor" />
          <TabButton tab="automation" label="🤖 Automação" />
          <TabButton tab="scheduling" label="🗓️ Agendamento" />
        </div>

        {/* conteúdo */}
        <div className="p-6 overflow-y-auto flex-grow">
          {/* loading inicial */}
          {isLoading && !content && <PanelLoadingSpinner />}

          {content && (
            <>
              {/* alerta de erro pequenininho, se houve falha na IA/n8n */}
              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-200 text-xs px-3 py-2 rounded-md whitespace-pre-line">
                  🤖💥 {error}
                </div>
              )}

              {/* card do produto */}
              <div className="bg-slate-900/50 rounded-lg p-4 text-center relative mb-6">
                <img
                  src={content.productImageUrl}
                  alt={product.productName}
                  className="w-full h-48 object-contain rounded-md mb-2"
                />
                <h3 className="font-semibold text-white line-clamp-2">
                  {product.productName}
                </h3>
                <p className="text-sm text-orange-400 mt-1">{product.price}</p>
                <button
                  onClick={() => setIsImageModalOpen(true)}
                  className="absolute top-3 right-3 text-xs bg-slate-700/80 text-white px-3 py-1 rounded-full hover:bg-slate-600 backdrop-blur-sm"
                >
                  Gerar Imagem com IA ✨
                </button>
              </div>

              {/* TAB: EDITOR */}
              {activeTab === 'editor' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Título do Post
                    </label>
                    <input
                      type="text"
                      value={content.socialPostTitle}
                      onChange={(e) =>
                        handleContentChange('socialPostTitle', e.target.value)
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Corpo do Post
                    </label>
                    <textarea
                      value={content.socialPostBody}
                      onChange={(e) =>
                        handleContentChange('socialPostBody', e.target.value)
                      }
                      rows={8}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white resize-y"
                    />
                  </div>

                  {suggestions.length > 0 && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 space-y-2">
                      <h4 className="font-semibold text-amber-300 text-sm">
                        💡 Sugestões de Otimização
                      </h4>
                      <ul className="list-disc list-inside text-xs text-amber-200 space-y-1">
                        {suggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300">
                      Modelos de Post Alternativos
                    </label>
                    {content.postTemplates.map((template, index) => (
                      <div
                        key={index}
                        className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <input
                            type="text"
                            value={template.name}
                            onChange={(e) =>
                              handleTemplateChange(index, 'name', e.target.value)
                            }
                            className="font-semibold bg-transparent text-orange-300 focus:outline-none focus:bg-slate-800 rounded px-2 py-1"
                          />
                          <button
                            onClick={() => applyTemplate(template.body)}
                            className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full hover:bg-orange-700"
                          >
                            Aplicar
                          </button>
                        </div>
                        <textarea
                          value={template.body}
                          onChange={(e) =>
                            handleTemplateChange(index, 'body', e.target.value)
                          }
                          rows={4}
                          className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white resize-y text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Chamada para Ação (CTA)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={content.callToAction}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2 text-orange-300 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Link de Afiliado
                    </label>
                    <input
                      type="text"
                      value={content.affiliateUrl}
                      onChange={(e) =>
                        handleContentChange('affiliateUrl', e.target.value)
                      }
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB: AUTOMAÇÃO */}
              {activeTab === 'automation' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-white">
                    Bot de Comentários e DMs
                  </h3>
                  <p className="text-sm text-gray-400">
                    Configure respostas automáticas para comentários nos seus posts. Essas
                    configurações depois podem ser enviadas para o seu workflow no n8n.
                  </p>

                  <div>
                    <label
                      htmlFor="keyword"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Palavra-gatilho no comentário
                    </label>
                    <input
                      type="text"
                      id="keyword"
                      value={botKeyword}
                      onChange={(e) => setBotKeyword(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ex: QUERO, EUQUERO, LINK
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="reply"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Mensagem automática na DM
                    </label>
                    <textarea
                      id="reply"
                      value={botReply}
                      onChange={(e) => setBotReply(e.target.value)}
                      rows={6}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white resize-y"
                    />
                  </div>
                </div>
              )}

              {/* TAB: AGENDAMENTO */}
              {activeTab === 'scheduling' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold text-white">
                    Agendamento de Postagem
                  </h3>
                  <p className="text-sm text-gray-400">
                    Programe este post para ser publicado mais tarde. Neste primeiro momento,
                    o agendamento é salvo localmente; depois ligamos isso ao n8n.
                  </p>

                  <div>
                    <label
                      htmlFor="schedule"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Data e Hora da Postagem
                    </label>
                    <input
                      type="datetime-local"
                      id="schedule"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    />
                  </div>

                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">
                      Prévia do Conteúdo a Agendar:
                    </h4>
                    <p className="text-sm text-gray-400 italic line-clamp-3">
                      <strong>{content.socialPostTitle}</strong> – {content.socialPostBody}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* footer */}
        <footer className="p-4 border-t border-slate-700 flex-shrink-0">
          {content && (
            <>
              {activeTab === 'editor' && (
                <button
                  onClick={() =>
                    copyToClipboard(
                      `${content.socialPostTitle}\n\n${content.socialPostBody}\n\n${content.callToAction}\n${content.affiliateUrl}`,
                    )
                  }
                  className="w-full text-center px-4 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Copiar Conteúdo
                </button>
              )}
              {activeTab === 'automation' && (
                <button
                  onClick={handleSaveAutomation}
                  className="w-full text-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar Automação
                </button>
              )}
              {activeTab === 'scheduling' && (
                <button
                  onClick={handleSchedulePost}
                  className="w-full text-center px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Agendar Postagem
                </button>
              )}
            </>
          )}
        </footer>
      </aside>

      {isImageModalOpen && content && (
        <ImageGeneratorModal
          productName={product.productName}
          onClose={() => setIsImageModalOpen(false)}
          onImageGenerated={(newImageUrl) => {
            setContent((prev) =>
              prev ? { ...prev, productImageUrl: newImageUrl } : null,
            );
            setIsImageModalOpen(false);
          }}
        />
      )}
    </>
  );
};
