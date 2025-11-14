import React, { useState } from 'react';
import type { ProductOption } from '../types';
import { PostEditorPanel } from './PostEditorPanel';
import { ComparisonModal } from './ComparisonModal';

interface ProductCardProps {
  product: ProductOption;
  onSelect: () => void;
  onDeselect: () => void;
  isSelected: boolean;
  isComparisonMode: boolean;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-amber-400 text-xs">
          ★
        </span>
      ))}
      {halfStar && <span className="text-amber-400 text-xs">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-600 text-xs">
          ☆
        </span>
      ))}
      <span className="text-[11px] text-gray-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

const SalesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-3.5 w-3.5 mr-1 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
  </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onDeselect,
  isSelected,
  isComparisonMode,
}) => {
  const cardClasses = `
    bg-slate-800 border rounded-xl overflow-hidden flex flex-col
    transform transition-all duration-200 shadow-md cursor-pointer
    ${isSelected
      ? 'border-orange-400 shadow-lg shadow-orange-500/20 scale-[1.01]'
      : 'border-slate-700 hover:scale-[1.01] hover:border-orange-500/40'
    }
  `;

  const handleClick = () => {
    if (isSelected) {
      onDeselect();
    } else {
      onSelect();
    }
  };

  return (
    <div className={cardClasses} onClick={handleClick}>
      {/* Imagem um pouco menor */}
      <div className="w-full h-40 bg-slate-700 flex items-center justify-center relative">
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              'https://via.placeholder.com/300x200?text=Imagem+Indisponível';
          }}
        />
        {isComparisonMode && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center bg-slate-900/60 border border-slate-500">
            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
          </div>
        )}
      </div>

      {/* Conteúdo mais compacto */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-white mb-2 flex-grow min-h-[40px] line-clamp-3">
          {product.productName}
        </h3>

        <div className="flex justify-between items-center mb-1.5">
          <p className="text-lg font-semibold text-orange-400">{product.price}</p>
          <StarRating rating={product.rating} />
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
          <p>
            Comissão:{' '}
            <span className="font-semibold text-amber-400">{product.commission}</span>
          </p>
          <div className="flex items-center">
            <SalesIcon />
            <span className="font-medium truncate max-w-[90px]">
              {product.salesVolume}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card's onClick
            onSelect();
          }}
          className="w-full mt-auto px-3 py-1.5 bg-orange-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-orange-700 transition-colors disabled:opacity-30"
          disabled={isComparisonMode}
        >
          {isComparisonMode ? 'Selecione 2 para comparar' : 'Preparar Postagem'}
        </button>
      </div>
    </div>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center items-center space-x-2 mt-10"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 bg-slate-700 text-sm text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
      >
        Anterior
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`w-8 h-8 text-sm font-semibold rounded-md transition-colors ${
            currentPage === number
              ? 'bg-orange-600 text-white'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 bg-slate-700 text-sm text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600"
      >
        Próximo
      </button>
    </nav>
  );
};

interface ProductSelectionPageProps {
  options: ProductOption[];
  onBack: () => void;
  provider: string;
}

export const ProductSelectionPage: React.FC<ProductSelectionPageProps> = ({
  options,
  onBack,
  provider,
}) => {
  const [selectedProductForPost, setSelectedProductForPost] =
    useState<ProductOption | null>(null);
  const [comparisonProducts, setComparisonProducts] = useState<ProductOption[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isComparisonMode, setIsComparisonMode] = useState(false);

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(options.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOptions = options.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectForPost = (product: ProductOption) => {
    if (isComparisonMode) return;
    setSelectedProductForPost(product);
  };

  const handleSelectForComparison = (product: ProductOption) => {
    setComparisonProducts((prev) => {
      if (prev.length < 2) {
        return [...prev, product];
      }
      // Replace the second product if two are already selected
      return [prev[0], product];
    });
  };

  const handleDeselectForComparison = (product: ProductOption) => {
    setComparisonProducts((prev) =>
      prev.filter((p) => p.productUrl !== product.productUrl),
    );
  };

  const toggleComparisonMode = () => {
    setIsComparisonMode((prev) => !prev);
    setComparisonProducts([]);
  };

  return (
    <div className="animate-fade-in">
      {/* container mais estreito para não “explodir” no dashboard */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1">
            Selecione um Produto
          </h2>
          <p className="text-sm md:text-base text-gray-400">
            Escolha um para gerar conteúdo, ou ative o modo de comparação.
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-xs md:text-sm text-gray-400">
              Modo de Comparação
            </span>
            <button
              onClick={toggleComparisonMode}
              className={`relative inline-flex items-center h-5 md:h-6 rounded-full w-10 md:w-11 transition-colors ${
                isComparisonMode ? 'bg-orange-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block w-3.5 h-3.5 md:w-4 md:h-4 transform bg-white rounded-full transition-transform ${
                  isComparisonMode ? 'translate-x-5 md:translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {isComparisonMode && (
          <div className="text-center mb-5 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
            <p className="text-sm text-white font-semibold mb-1">
              Modo de Comparação Ativo
            </p>
            <p className="text-xs text-gray-400">
              Selecione dois produtos para comparar suas características lado a lado.
            </p>
            {comparisonProducts.length === 2 && (
              <button
                onClick={() => setIsComparing(true)}
                className="mt-3 px-5 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-700"
              >
                Comparar Produtos Selecionados
              </button>
            )}
          </div>
        )}

        {/* Grid um pouco mais “apertado” */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[420px]">
          {currentOptions.map((product, index) => (
            <ProductCard
              key={product.productUrl || index}
              product={product}
              onSelect={() =>
                isComparisonMode
                  ? handleSelectForComparison(product)
                  : handleSelectForPost(product)
              }
              onDeselect={() => handleDeselectForComparison(product)}
              isSelected={
                (isComparisonMode &&
                  comparisonProducts.some(
                    (p) => p.productUrl === product.productUrl,
                  )) ||
                (!isComparisonMode &&
                  selectedProductForPost?.productUrl === product.productUrl)
              }
              isComparisonMode={isComparisonMode}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <div className="text-center mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-slate-700 text-sm md:text-base text-white font-semibold rounded-full shadow-md hover:bg-slate-600 transition-colors"
          >
            ← Voltar para a Busca
          </button>
        </div>
      </div>

      {selectedProductForPost && (
        <PostEditorPanel
          product={selectedProductForPost}
          onClose={() => setSelectedProductForPost(null)}
          provider={provider}
        />
      )}
      {isComparing && comparisonProducts.length === 2 && (
        <ComparisonModal
          product1={comparisonProducts[0]}
          product2={comparisonProducts[1]}
          onClose={() => setIsComparing(false)}
        />
      )}
    </div>
  );
};
