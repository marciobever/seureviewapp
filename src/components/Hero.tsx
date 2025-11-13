import React from 'react';

// ==== LOGOS DAS PLATAFORMAS ===================================

const AmazonLogo = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0"
  >
    <path
      d="M7 9.5C7 6.8 8.9 5 11.6 5c2.6 0 4.3 1.5 4.3 3.9v4.2c0 .4-.3.7-.7.7h-1.1c-.4 0-.7-.3-.7-.7v-.4c-.6.8-1.5 1.2-2.6 1.2-2 0-3.8-1.4-3.8-3.9zm6.2.1c0-1.2-.8-2-2-2-1.2 0-2 0.9-2 2.1 0 1.3.8 2.1 2 2.1 1.2 0 2-.9 2-2.2z"
      fill="currentColor"
    />
    <path
      d="M6 17.5c0-.3.3-.6.6-.5 4.1 1.3 6.7 1.1 10.7-.3.3-.1.6.1.6.4 0 .2-.1.4-.3.5-4.2 2.4-7.6 2.6-11.3.9-.2-.1-.3-.3-.3-.5z"
      fill="currentColor"
    />
    <path
      d="M17.2 17.3c-.1-.2 0-.5.3-.6l1.7-.5c.3-.1.6.2.6.5 0 .9-.5 1.7-1.3 2-.3.2-.6 0-.7-.3z"
      fill="currentColor"
    />
  </svg>
);

const ShopeeLogo = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0"
  >
    <path
      d="M9.5 7V6.5A2.5 2.5 0 0 1 12 4a2.5 2.5 0 0 1 2.5 2.5V7h1.8c.4 0 .7.3.7.7l-.8 8.3a1.5 1.5 0 0 1-1.5 1.4H7.3a1.5 1.5 0 0 1-1.5-1.4L5 7.7c0-.4.3-.7.7-.7zm1.5 0h2V6.5c0-.6-.4-1-1-1-.6 0-1 .4-1 1z"
      fill="currentColor"
    />
    <path
      d="M10 11.2c0-.6.4-1 1-1h2c.6 0 1 .4 1 1s-.4 1-1 1h-1v.3c.6.1 1 .5 1 1.1 0 .7-.6 1.3-1.5 1.3H10v-1.2h1.4c.2 0 .3-.1.3-.2 0-.1-.1-.2-.3-.2H11c-.6 0-1-.4-1-1z"
      fill="currentColor"
    />
  </svg>
);

const MercadoLivreLogo = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0"
  >
    <ellipse
      cx="12"
      cy="12"
      rx="7"
      ry="4.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M8.5 11.5 10 13l1.5-1.5L13 13l1.5-1.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AliexpressLogo = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0"
  >
    <rect
      x="5.5"
      y="6.5"
      width="13"
      height="11"
      rx="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M8 12.5c.6.8 1.6 1.3 2.6 1.3s2-.5 2.6-1.3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const TemuLogo = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0"
  >
    <rect
      x="5"
      y="7"
      width="14"
      height="10"
      rx="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <path
      d="M9 9.5h6M12 9.5v5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

const SheinLogo = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0"
  >
    <path
      d="M8.5 8.2c.6-.5 1.5-.9 2.7-.9 1.8 0 3 .8 3 2.2 0 1.2-.8 1.8-2.3 2L11 11.7c-.8.1-1.2.3-1.2.7 0 .4.4.7 1.1.7.7 0 1.3-.2 1.9-.7l1.1 1.4c-.8.7-1.9 1.1-3.1 1.1-2 0-3.3-1-3.3-2.5 0-1.2.8-1.9 2.3-2.1l1-.1c.8-.1 1.2-.3 1.2-.7 0-.4-.4-.6-1-.6-.7 0-1.3.2-1.9.7z"
      fill="currentColor"
    />
  </svg>
);

// item com logo grande + label embaixo
const LogoItem: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col items-center justify-center mx-3 md:mx-4 min-w-[80px] md:min-w-[96px]">
    <div className="text-gray-200 opacity-80 hover:opacity-100 transform hover:scale-105 transition-all duration-200 drop-shadow-[0_0_12px_rgba(15,23,42,0.9)]">
      {children}
    </div>
    <span className="mt-2 text-[11px] md:text-xs tracking-wide uppercase text-gray-500">
      {label}
    </span>
  </div>
);

const LogosRow = () => (
  <>
    <LogoItem label="Amazon">
      <AmazonLogo />
    </LogoItem>
    <LogoItem label="Shopee">
      <ShopeeLogo />
    </LogoItem>
    <LogoItem label="Mercado Livre">
      <MercadoLivreLogo />
    </LogoItem>
    <LogoItem label="AliExpress">
      <AliexpressLogo />
    </LogoItem>
    <LogoItem label="Temu">
      <TemuLogo />
    </LogoItem>
    <LogoItem label="Shein">
      <SheinLogo />
    </LogoItem>
  </>
);

// Banner de parceiros com scroller
const PartnersBanner: React.FC = () => {
  return (
    <section className="mt-8">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-gray-500 font-semibold uppercase tracking-[0.35em] mb-6 text-[0.65rem] md:text-xs">
          Compatível com as Maiores Plataformas
        </h3>
        <div className="scroller w-full overflow-hidden">
          <div
            className="scroller-inner flex items-center py-4"
            style={{ gap: '1.4rem' }} // controla o espaçamento horizontal real
          >
            <LogosRow />
            <LogosRow />
          </div>
        </div>
      </div>
    </section>
  );
};

// ==== HERO PRINCIPAL =====================================================

interface LandingHeroProps {
  onCTAClick: () => void;
}

const PostIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-3-4h.01"
    />
  </svg>
);

const ArticleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const VideoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const ImageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const FeaturePill: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
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
          A Central de Conteúdo IA que <br />
          Transforma <span className="text-orange-400">Cliques em Comissões</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          Pare de perder tempo. Gere posts virais, artigos de blog otimizados
          para SEO, roteiros para vídeos, imagens de marketing e automatize
          suas redes sociais, tudo em um só lugar.
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
          <p className="text-sm text-gray-500 mt-4">
            Não é necessário cartão de crédito.
          </p>
        </div>
      </div>

      <div className="w-full pb-10">
        <PartnersBanner />
      </div>
    </section>
  );
};
