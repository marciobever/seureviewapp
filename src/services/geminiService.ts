// src/services/geminiService.ts
// STUB TEMPORÁRIO SEM GEMINI – NÃO IMPORTA @google/genai, NEM USA API KEY

import { supabase } from "./supabase";
import type { ProductOption, PostContent, BlogPost, VideoScript } from "../types";

/**
 * Busca produtos.
 * - Shopee: continua usando seu fluxo via n8n (precisa das keys do usuário).
 * - Outros providers: IA desativada → erro amigável.
 */
export const searchProductOptions = async (
  productQuery: string,
  provider: string
): Promise<ProductOption[]> => {
  if (!productQuery) {
    throw new Error("Product query is required.");
  }

  // --- fluxo Shopee via n8n continua funcionando normalmente ---
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
          query: productQuery,
          appId: shopeeKeys.shopeeAppId,
          password: shopeeKeys.shopeePassword,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `O serviço da Shopee (n8n) retornou um erro: ${response.status}`
        );
      }

      const products = await response.json();
      if (!Array.isArray(products)) {
        throw new Error("A resposta da busca da Shopee não é um array válido.");
      }
      return products;
    } catch (error: any) {
      console.error("Error during Shopee product search:", error);
      const errorMessage = error.message || "Ocorreu um erro desconhecido.";
      throw new Error(
        `Falha ao buscar produtos da Shopee. Detalhes: ${errorMessage}`
      );
    }
  }

  // --- demais providers: IA desligada temporariamente ---
  throw new Error(
    "Os geradores de IA ainda não estão configurados neste ambiente (Gemini desativado)."
  );
};

/**
 * As funções abaixo estão stubadas: não chamam Gemini.
 * Assim o app compila/roda, mas você não depende da chave.
 */

export const generatePostForProduct = async (
  product: ProductOption,
  _provider: string
): Promise<PostContent & { productImageUrl: string }> => {
  throw new Error(
    "Geração automática de conteúdo ainda não está configurada (Gemini desativado)."
  );
};

export const generateReelsVideo = async (_prompt: string): Promise<string> => {
  throw new Error(
    "Geração de vídeo (Reels) ainda não está configurada (Gemini desativado)."
  );
};

export const generateMarketingImage = async (
  _prompt: string
): Promise<string> => {
  throw new Error(
    "Geração de imagens de marketing ainda não está configurada (Gemini desativado)."
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

export const generateBlogPost = async (_topic: string): Promise<BlogPost> => {
  throw new Error(
    "Gerador de artigos de blog ainda não está configurado (Gemini desativado)."
  );
};

export const generateVideoScript = async (
  _topic: string,
  _videoType: "short" | "long"
): Promise<VideoScript> => {
  throw new Error(
    "Gerador de roteiros de vídeo ainda não está configurado (Gemini desativado)."
  );
};

export const compareProducts = async (
  _product1: ProductOption,
  _product2: ProductOption
): Promise<string> => {
  throw new Error(
    "Comparador de produtos ainda não está configurado (Gemini desativado)."
  );
};
