// src/services/geminiService.ts
// IMPLEMENTAÇÃO SEM GEMINI – NÃO IMPORTA @google/genai, NEM USA API KEY

import { supabase } from "./supabase";
import type {
  ProductOption,
  PostContent,
  BlogPost,
  VideoScript,
} from "../types";

/**
 * Busca produtos.
 * - Shopee: usa fluxo via n8n (precisa das keys do usuário em user_api_keys).
 * - Outros providers: IA desativada → erro amigável.
 */
export const searchProductOptions = async (
  productQuery: string,
  provider: string
): Promise<ProductOption[]> => {
  if (!productQuery) {
    throw new Error("Product query is required.");
  }

  // --- fluxo Shopee via n8n ---
  if (provider === "Shopee") {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não autenticado. Por favor, faça login.");
      }

      const { data: userApiKeys, error: dbError } = await supabase
        .from("user_api_keys")
        .select("keys")
        .eq("user_id", user.id)
        .single();

      // Se deu erro diferente de "nenhuma linha encontrada"
      if (dbError && dbError.code !== "PGRST116") {
        throw dbError;
      }

      const shopeeKeys = userApiKeys?.keys as any;

      if (!shopeeKeys?.shopeeAppId || !shopeeKeys?.shopeePassword) {
        throw new Error(
          "Chaves de API da Shopee não encontradas. " +
            "Por favor, adicione suas chaves na página 'Chaves de API' em 'Configurações'."
        );
      }

      const webhookUrl = "https://n8n.seureview.com.br/webhook/shopee_search";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          // orgId: se você tiver org no Supabase, pode preencher aqui depois
          query: productQuery,
          filters: {
            limit: 24,
          },
          sort: "relevance",
          country: "BR",
          // appId/password não precisam ir se o n8n já lê isso do Postgres
        }),
      });

      if (!response.ok) {
        throw new Error(
          `O serviço da Shopee (n8n) retornou um erro: ${response.status}`
        );
      }

      const json = await response.json();

      // n8n pode retornar array direto ou { items: [...] }
      const items = Array.isArray(json)
        ? json
        : Array.isArray(json.items)
        ? json.items
        : [];

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("Nenhum produto encontrado para esta busca.");
      }

      // Mapear o formato do n8n para o ProductOption esperado pela UI
      const products: ProductOption[] = items.map((p: any) => ({
        productName: p.title ?? p.nome ?? "Produto",
        imageUrl: p.image ?? p.image_url ?? "",
        price:
          typeof p.price === "number"
            ? `R$ ${p.price.toFixed(2).replace(".", ",")}`
            : p.price_str ?? "—",
        rating: p.rating ?? 0,
        commission: p.commission_percent
          ? `${p.commission_percent.toFixed(1)}%`
          : p.commission
          ? `${p.commission}%`
          : "—",
        salesVolume: p.sales_count
          ? `${p.sales_count} vendidos`
          : p.vendas
          ? `${p.vendas} vendidos`
          : "",
        productUrl: p.url ?? p.canonicalUrl ?? p.product_link ?? "",
      }));

      return products;
    } catch (error: any) {
      console.error("Error during Shopee product search:", error);
      const errorMessage = error?.message || "Ocorreu um erro desconhecido.";
      throw new Error(
        `Falha ao buscar produtos da Shopee. Detalhes: ${errorMessage}`
      );
    }
  }

  // --- demais providers: IA desligada temporariamente ---
  throw new Error(
    "Os geradores de IA ainda não estão configurados neste ambiente (Gemini desativado). " +
      "Por enquanto, use apenas a opção Shopee com suas chaves de API."
  );
};

/**
 * Etapa 2: Gera conteúdo + shortlink para um produto selecionado, via n8n.
 * Aqui NÃO usamos Gemini; apenas:
 * - chamamos o webhook shopee_subids para gerar link rastreável
 * - montamos uma legenda/CTA simples no front
 */
export const generatePostForProduct = async (
  product: ProductOption,
  provider: string
): Promise<PostContent & { productImageUrl: string }> => {
  if (provider !== "Shopee") {
    throw new Error(
      "No momento, a geração de conteúdo só está disponível para produtos da Shopee."
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado. Por favor, faça login.");
  }

  // Chama o webhook que gera shortlink + salva/agenda no n8n
  const webhookUrl = "https://n8n.seureview.com.br/webhook/shopee_subids";

  const priceNumber = (() => {
    const match = String(product.price)
      .replace(/[^\d,]/g, "")
      .replace(",", ".");
    const n = Number(match);
    return Number.isFinite(n) ? n : undefined;
  })();

  const body = {
    base_url: product.productUrl,
    platform: "instagram", // depois dá pra deixar dinâmico (instagram/facebook/etc)
    product: {
      id: undefined, // se tiver id interno no ProductOption, joga aqui
      title: product.productName,
      price: priceNumber,
      rating: product.rating,
      image: product.imageUrl,
      url: product.productUrl,
    },
    userId: user.id,
    orgId: null, // se tiver org no Supabase, preenche depois
  };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(
      `O serviço de geração de link da Shopee (n8n) retornou um erro: ${res.status}`
    );
  }

  const json = await res.json();

  // Estrutura esperada do n8n (node "Map for API"):
  // {
  //   items: [
  //     {
  //       id, title, price, price_str, rating,
  //       image, marketplace, canonicalUrl, url, links: { [platform]: url }
  //     }
  //   ],
  //   ...
  // }
  const firstItem = Array.isArray(json.items) ? json.items[0] : null;
  const affiliateUrl: string =
    firstItem?.url || firstItem?.links?.instagram || product.productUrl;

  const socialPostTitle = `Oferta Shopee: ${product.productName}`;
  const callToAction = "Clique no link e aproveite essa oferta exclusiva!";

  const socialPostBody = [
    `🔥 ${product.productName}`,
    "",
    product.price ? `💰 Preço: ${product.price}` : "",
    product.rating ? `⭐ Avaliação: ${product.rating.toFixed(1)} / 5` : "",
    "",
    callToAction,
    affiliateUrl ? `👉 ${affiliateUrl}` : "",
    "",
    "#Shopee #Oferta #Promoção #Achadinhos",
  ]
    .filter(Boolean)
    .join("\n");

  const postTemplates: PostContent["postTemplates"] = [
    {
      name: "Foco em Benefícios",
      body: [
        `✨ Descubra por que ${product.productName} está fazendo sucesso na Shopee!`,
        "",
        "• Qualidade incrível pelo melhor preço",
        "• Perfeito para o seu dia a dia",
        "",
        callToAction,
        affiliateUrl ? `👉 ${affiliateUrl}` : "",
        "",
        "#Shopee #Achadinhos #Benefícios",
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      name: "Urgência / Escassez",
      body: [
        `⏰ Últimas unidades de ${product.productName} com preço especial!`,
        "",
        "Não deixe para depois, as melhores ofertas acabam rápido.",
        "",
        callToAction,
        affiliateUrl ? `👉 ${affiliateUrl}` : "",
        "",
        "#Promoção #SóHoje #CorreAproveitar",
      ]
        .filter(Boolean)
        .join("\n"),
    },
    {
      name: "Prova Social",
      body: [
        `📈 ${product.productName} está entre os queridinhos da Shopee!`,
        "",
        "Avaliações positivas e muitos pedidos entregues. Se tanta gente aprovou, tem um motivo 😉",
        "",
        callToAction,
        affiliateUrl ? `👉 ${affiliateUrl}` : "",
        "",
        "#ProvaSocial #MaisVendidos #ShopeeBrasil",
      ]
        .filter(Boolean)
        .join("\n"),
    },
  ];

  const postContent: PostContent = {
    socialPostTitle,
    socialPostBody,
    affiliateUrl,
    callToAction,
    postTemplates,
  };

  return {
    ...postContent,
    productImageUrl: product.imageUrl,
  };
};

/**
 * Funções abaixo ainda são stubs (IA desativada).
 */

export const generateReelsVideo = async (
  _prompt: string
): Promise<string> => {
  throw new Error(
    "Geração de vídeo (Reels) ainda não está configurada (IA desativada)."
  );
};

export const generateMarketingImage = async (
  _prompt: string
): Promise<string> => {
  throw new Error(
    "Geração de imagens de marketing ainda não está configurada (IA desativada)."
  );
};

export const getOptimizationSuggestions = async (
  _title: string,
  _body: string
): Promise<string[]> => {
  return [
    "Otimize o primeiro parágrafo com um gancho mais forte.",
    "Destaque um benefício concreto logo no começo.",
    "Inclua um call-to-action claro no final do texto.",
  ];
};

export const generateBlogPost = async (
  _topic: string
): Promise<BlogPost> => {
  throw new Error(
    "Gerador de artigos de blog ainda não está configurado (IA desativada)."
  );
};

export const generateVideoScript = async (
  _topic: string,
  _videoType: "short" | "long"
): Promise<VideoScript> => {
  throw new Error(
    "Gerador de roteiros de vídeo ainda não está configurado (IA desativada)."
  );
};
export const compareProducts = async (
  _product1: ProductOption,
  _product2: ProductOption
): Promise<string> => {
  // Stub apenas para não quebrar o build.
  // Se algum lugar ainda chamar o comparador, vai aparecer essa mensagem.
  throw new Error(
    "Comparador de produtos foi desativado nesta versão. Use apenas a geração de postagens."
  );
};
