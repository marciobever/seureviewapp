import React from 'react';

const Step: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="flex gap-6">
        <div className="flex flex-col items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-500/10 text-orange-300 font-bold rounded-full flex items-center justify-center border-2 border-orange-500/30">
                {number}
            </div>
            <div className="w-px flex-grow bg-slate-700"></div>
        </div>
        <div className="pb-10">
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <div className="text-gray-400 space-y-4">{children}</div>
        </div>
    </div>
);

const TutorialSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <section className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 mb-8">{description}</p>
        <div>
            {children}
        </div>
    </section>
);

const MockSearchForm = () => (
    <div className="flex flex-col md:flex-row gap-3 items-center bg-slate-800/50 p-2 rounded-xl border border-slate-700 shadow-lg mt-4">
        <select disabled className="w-full md:w-auto text-center md:text-left bg-slate-700 border-slate-600 rounded-full py-3 pl-4 pr-8 text-white focus:outline-none">
            <option>Todas as Lojas</option>
        </select>
        <input
            type="text"
            value="Melhor cadeira gamer custo-benefício"
            disabled
            className="w-full md:flex-1 bg-transparent px-6 py-3 text-white placeholder-gray-500"
        />
        <button disabled className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-semibold rounded-full opacity-70">
            Gerar Conteúdo
        </button>
    </div>
);

const MockProductCard = () => (
     <div className="bg-slate-800 border rounded-xl overflow-hidden flex flex-col border-orange-400 shadow-lg shadow-orange-500/10 scale-105 my-4">
      <div className="w-full h-40 bg-slate-700 flex items-center justify-center text-gray-500">
        Imagem do Produto
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-white mb-2 h-12">Nome Completo do Produto Selecionado</h3>
        <div className="flex justify-between items-center mb-2">
            <p className="text-xl font-semibold text-orange-400">R$ 499,90</p>
            <div className="flex items-center text-amber-400">★★★★☆<span className="text-xs text-gray-400 ml-1">4.8</span></div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
            <p>Comissão: <span className="font-semibold text-amber-400">10%</span></p>
            <p className="font-medium">1.2k vendidos</p>
        </div>
        <button disabled className="w-full mt-auto px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg opacity-70">
          Preparar Postagem
        </button>
      </div>
    </div>
);

const MockEditorPanel = () => (
    <div className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-4 my-4">
        <div className="w-full h-32 bg-slate-700 rounded-md flex items-center justify-center text-gray-500">Imagem do Produto</div>
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Título do Post</label>
            <input type="text" disabled value="✨ Cadeira Gamer XYZ: Conforto e Estilo!" className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm" />
        </div>
        <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Corpo do Post</label>
            <textarea disabled rows={4} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white resize-none text-sm">A cadeira que vai transformar suas gameplays! #gamer #setup</textarea>
        </div>
        <button disabled className="w-full text-center px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg opacity-70">
            Copiar Tudo
        </button>
    </div>
);


export const HelpPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-white mb-2">Guia de Início Rápido 🚀</h1>
                <p className="text-lg text-gray-400">Domine as ferramentas do SeuReview AI e automatize seu conteúdo.</p>
            </div>

            <TutorialSection
                title="Gerador de Conteúdo: Passo a Passo"
                description="A principal ferramenta da plataforma. Transforme uma ideia em uma lista de produtos e um post pronto para publicar em 3 passos simples."
            >
                <Step number={1} title="A Busca Inteligente">
                    <p>
                        Tudo começa na página "Gerador de Conteúdo". Escolha uma loja específica ou deixe "Todas as Lojas" para uma busca mais ampla. Depois, descreva o produto que você deseja promover.
                    </p>
                    <p className="font-semibold text-orange-300 bg-orange-500/10 p-3 rounded-md">
                        Dica: Seja específico para obter melhores resultados. Em vez de "notebook", tente "notebook para edição de vídeo até R$ 5000".
                    </p>
                    <MockSearchForm />
                </Step>
                <Step number={2} title="A Escolha do Produto Campeão">
                    <p>
                        A IA irá analisar o mercado e apresentar as 8 melhores opções de produtos de afiliados. Analise os detalhes de cada um:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li><span className="font-semibold text-white">Preço e Comissão:</span> Para calcular seu lucro potencial.</li>
                        <li><span className="font-semibold text-white">Avaliação e Volume de Vendas:</span> Indicadores de popularidade e aceitação do produto.</li>
                    </ul>
                    <p>
                        Quando encontrar o produto ideal, clique em "Preparar Postagem". Ele ficará destacado em laranja.
                    </p>
                    <MockProductCard />
                </Step>
                <Step number={3} title="Edição e Publicação">
                    <p>
                        Ao selecionar um produto, um painel lateral se abrirá com o conteúdo completo gerado pela IA. Nele, você pode:
                    </p>
                     <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Ajustar o título e o corpo do post.</li>
                        <li>Verificar e editar o link de afiliado.</li>
                        <li>Copiar todo o conteúdo com um único clique.</li>
                    </ul>
                    <MockEditorPanel />
                </Step>
                 <div className="flex gap-6"><div className="flex-shrink-0 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">🎉</div><div><h3 className="text-xl font-bold text-white">Pronto!</h3><p className="text-gray-400">Agora é só publicar nas suas redes sociais e começar a converter!</p></div></div>
            </TutorialSection>
            
            <TutorialSection
                title="Outras Ferramentas"
                description="Explore todo o potencial da plataforma."
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Gerador de Reels</h3>
                        <p>Acesse a página "Gerador de Reels", descreva sua ideia para um vídeo curto e a IA cuidará do resto. É perfeito para criar conteúdo dinâmico e aumentar o engajamento.</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold text-white mb-2">Histórico</h3>
                        <p>Perdeu um conteúdo que gerou? Não se preocupe! A página "Histórico" salva automaticamente suas últimas 10 criações, permitindo que você as acesse e copie a qualquer momento.</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold text-white mb-2">Chaves de API (Avançado)</h3>
                        <p>Para uma integração mais robusta, especialmente com a Shopee, você pode inserir suas próprias chaves de API na página "Chaves de API". Isso permite que a IA gere links de afiliado reais e tagueados automaticamente.</p>
                    </div>
                </div>
            </TutorialSection>


        </div>
    );
};