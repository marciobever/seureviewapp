
import React from 'react';

// Fix: Inlined PartnersBanner component to resolve import error from a missing file.
const ShopeeLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto flex-shrink-0"><path d="M11.996 22.584c-1.332 0-2.328-.3-3.48-.912-1.14-.612-2.1-1.488-2.844-2.628-.756-1.14-1.14-2.484-1.14-4.032 0-2.28.984-4.2 2.952-5.748 1.968-1.548 4.524-2.328 7.68-2.328 1.884 0 3.528.3 4.932.912a8.88 8.88 0 013.48 2.628c.756 1.14 1.14 2.484 1.14 4.032 0 1.296-.3 2.376-.912 3.24-.612.864-1.392 1.5-2.328 1.908-.948.408-1.992.612-3.132.612zm-8.88-5.352c0 .936.192 1.764.576 2.484.384.72.9.1292 1.548 1.728.66.432 1.416.648 2.268.648 1.404 0 2.628-.48 3.672-1.428 1.044-.948 1.572-2.112 1.572-3.492 0-1.728-.624-3.132-1.872-4.2-1.236-1.08-2.88-1.62-4.932-1.62-1.884 0-3.456.456-4.716 1.356-1.26 9-1.884 2.052-1.884 3.456zM21.572.024A2.43 2.43 0 0019.532.6L14.06 4.92l.024.024c.48.456.816.96.996 1.512l.144.096c.336.168.612.396.84.672.228.276.336.564.336.864 0 .3-.108.588-.324.864a1.2 1.2 0 01-.84.48c-.312 0-.6-.108-.852-.324a1.3 1.3 0 01-.492-.84c-.036-.264-.024-.552.024-.864l.06-.18c-.204-.624-.552-1.188-1.044-1.692l-.048-.048L7.004.6a2.43 2.43 0 00-2.04-.576C3.98.192 3.2.756 2.604 1.572.78 3.732-.012 6.6-.012 10.164c0 .3.024.6.06.912.036.312.156.624.36.936.204.312.48.564.816.768.336.204.684.3 1.044.3.408 0 .78-.12 1.116-.36.336-.24.552-.528.648-.864.108-.336.168-.66.168-.972 0-1.344.36-2.52.936-3.528.576-1.008 1.38-1.788 2.4-2.328a7.9 7.9 0 013.12-1.164c.264-.036.516-.06.756-.06s.492.024.756.06c1.116.144 2.136.528 3.06 1.164.924.624 1.668 1.452 2.244 2.484.576 1.032.864 2.196.864 3.492 0 .6.096 1.152.288 1.656.192.504.564.912 1.116 1.224.552.312 1.14.468 1.764.468.384 0 .744-.072 1.08-.216a2.01 2.01 0 00.744-.612c.192-.264.3-.552.348-.864.048-.312.06-.612.06-.9 0-3.216-.732-5.916-2.208-8.1C22.628.756 22.124.264 21.572.024z" fill="currentColor"/></svg>;
const AmazonLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto flex-shrink-0"><path d="M22.131 15.178c-.297 3.53-3.086 5.253-6.634 5.253-1.633 0-3.341-.538-4.636-1.556-.255-.203-.435-.255-.663-.051l-1.121.713c-.128.077-.282.102-.409.025-.154-.076-.23-.23-.18-.383l.636-1.996c.026-.102.026-.204-.025-.306-1.485-2.506-1.02-5.631.944-7.258 2.25-1.895 5.545-2.02 7.784-.46l.563 1.485c.102.256.41.358.637.204l1.485-.97c.23-.153.307-.46.179-.688C19.33 8.35 15.534 6.84 11.53 8.423c-4.425 1.766-6.19 6.262-4.4 10.51 1.045 2.506 3.438 4.097 6.059 4.097 3.199 0 5.61-1.632 5.926-4.637.204-1.97-.69-2.94-2.022-3.898-1.434-1.02-3.414-1.327-4.99-1.046l-2.943.512c-.281.051-.512-.18-.46-.46l.512-2.94c.051-.282-.18-.512-.46-.46L6.3 11.08c-2.304.409-3.757-1.485-2.813-3.585C4.55 5.04 7.27 3.97 9.574 4.58c1.714.46 2.89 1.868 3.148 3.488l-1.047.281c-.282.077-.384.435-.153.637l2.84-2.454c.23-.204.613-.077.663.23l.358 2.304c.051.282.358.46.637.307l2.764-1.79c1.97-.995 4.35-1.328 6.315-.486 2.356 1.02 2.94 3.766 1.818 5.798z" fill="currentColor"/></svg>;
const MercadoLivreLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto flex-shrink-0"><path d="M22.112 10.322c-.62-.31-1.25-.414-1.9-.414H3.801L2.14 2.65C2.089 2.47 1.933 2.36 1.776 2.36H.48C.215 2.36 0 2.575 0 2.84v.207c0 .155.086.302.233.363l1.838.745c.207.086.336.293.284.508l2.585 9.875c.129.517.586.862 1.112.862h12.553c.534 0 .991-.345 1.12-.862l2.362-8.509c.07-.25-.07-.517-.285-.612zm-1.845-.922.259.93H6.77L5.86 6.844h13.254c.483 0 .914.181 1.153.456z" fill="currentColor"/></svg>;
const AliexpressLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto flex-shrink-0"><path d="m19.123 7.512-4.66-4.654a1.037 1.037 0 0 0-1.467 0L8.33 7.512a1.04 1.04 0 0 0-.253.948c.115.352.4.604.757.604H10.5v1.94c0 .356.12.693.336.965l2.456 3.125-2.296 2.92a1.044 1.044 0 0 0-.324.966c.115.351.4.603.756.603h1.664c.356 0 .64-.252.756-.603a1.044 1.044 0 0 0-.324-.966l-2.296-2.92 2.456-3.125a1.035 1.035 0 0 0 .336-.965V9.064h1.664c.356 0 .64-.252.757-.604a1.04 1.04 0 0 0-.253-.948M21.579 0H2.421C1.085 0 0 1.085 0 2.421v19.158C0 22.915 1.085 24 2.421 24h19.158C22.915 24 24 22.915 24 21.579V2.421C24 1.085 22.915 0 21.579 0m-8.915 16.035a2.128 2.128 0 0 1-1.042-.294c-.114.162-.23.32-.352.476a2.12 2.12 0 0 1-2.984 0 2.12 2.12 0 0 1 0-2.984l3.65-4.64-3.65-4.64a2.12 2.12 0 0 1 0-2.984 2.12 2.12 0 0 1 2.984 0c.122.155.238.313.352.476a2.128 2.128 0 0 1 1.042-.294h3.326c.491 0 .943.272 1.168.694a1.232 1.232 0 0 1-.226 1.34L13.78 9.064h3.326c.491 0 .943.272 1.168.694a1.232 1.232 0 0 1-.226 1.34l-3.07 3.072 3.07 3.072a1.232 1.232 0 0 1 .226 1.34 1.229 1.229 0 0 1-1.168.694h-3.326" fill="currentColor"/></svg>;
const TemuLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-auto flex-shrink-0"><path d="M12 0L1.674 3.737v2.072h5.81V24h2.753V5.81h2.753V24h2.754V5.81h5.81V3.737z" fill="currentColor"/></svg>;
const SheinLogo = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto flex-shrink-0"><path d="M12.94 3.48h-1.89c-1.35 0-2.6.43-3.63 1.2-1.31 1-2.03 2.5-2.03 4.14 0 2.75 1.63 4.63 4.6 4.63h1.06v1.43c0 .54-.15.98-.44 1.31-.29.34-.7.51-1.22.51-.59 0-1.05-.16-1.4-.47-.34-.31-.51-.76-.51-1.34H5.6c0 .87.27 1.64.82 2.3.55.67 1.3 1.16 2.24 1.48.94.32 1.93.48 2.97.48 1.4 0 2.65-.29 3.75-.87s1.95-1.4 2.56-2.43c.6-.9.9-2.04.9-3.41V9.01c0-1.3-.23-2.4-.7-3.32-.47-.92-1.1-1.66-1.9-2.22-.8-.56-1.72-.83-2.77-.83zm.18 7.37H12c-1.77 0-2.82-.9-2.82-2.71 0-.96.3-1.7.9-2.22.6-.52 1.38-.78 2.34-.78.96 0 1.76.26 2.39.78.63.52.95 1.26.95 2.22v2.71z" fill="currentColor"/></svg>;

const Logos = () => (
    <>
        <ShopeeLogo />
        <AmazonLogo />
        <MercadoLivreLogo />
        <AliexpressLogo />
        <TemuLogo />
        <SheinLogo />
    </>
)

const PartnersBanner: React.FC = () => {
    return (
        <section>
            <div className="container mx-auto px-4">
                <h3 className="text-center text-gray-500 font-semibold uppercase tracking-widest mb-8">
                    Compatível com as Maiores Plataformas
                </h3>
                <div className="scroller w-full overflow-hidden">
                    <div className="scroller-inner text-gray-500">
                        <Logos />
                        <Logos />
                    </div>
                </div>
            </div>
        </section>
    );
};


interface LandingHeroProps {
  onCTAClick: () => void;
}

const PostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-3-4h.01" /></svg>;
const ArticleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

const FeaturePill: React.FC<{icon: React.ReactNode; label: string}> = ({icon, label}) => (
    <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-4 py-2">
        <div className="text-orange-400">{icon}</div>
        <span className="text-sm font-medium text-gray-300">{label}</span>
    </div>
);

export const Hero: React.FC<LandingHeroProps> = ({ onCTAClick }) => {
  return (
    <section className="min-h-[calc(100vh-5rem)] flex flex-col justify-center text-center">
       <div className="container mx-auto px-4 animate-fade-in-up flex-grow flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight text-glow">
            A Central de Conteúdo IA que <br/> Transforma <span className="text-orange-400">Cliques em Comissões</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Pare de perder tempo. Gere posts virais, artigos de blog otimizados para SEO, roteiros para vídeos, imagens de marketing e automatize suas redes sociais, tudo em um só lugar.
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
            <FeaturePill icon={<PostIcon />} label="Posts Sociais" />
            <FeaturePill icon={<ArticleIcon />} label="Artigos de Blog" />
            <FeaturePill icon={<VideoIcon />} label="Roteiros de Vídeo" />
            <FeaturePill icon={<ImageIcon />} label="Imagens com IA" />
        </div>

        <div className="flex flex-col items-center">
            <button
                onClick={onCTAClick}
                className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transform transition-all duration-300 ease-in-out"
            >
                Comece a Automatizar (Teste Grátis)
            </button>
            <p className="text-sm text-gray-500 mt-4">Não é necessário cartão de crédito.</p>
        </div>
       </div>
       <div className="w-full pb-10">
        <PartnersBanner />
       </div>
    </section>
  );
};
