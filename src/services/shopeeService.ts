// src/services/shopeeService.ts
import { supabase } from "./supabase";
import type { ProductOption } from "../types";

const N8N_BASE_URL = "https://n8n.seureview.com.br";

interface ShopeeSearchFilters {
  limit?: number;
  minRating?: number;
  onlyPromo?: boolean;
}

/**
 * Busca produtos na Shopee via n8n (/webhook/shopee_search)
 */
export async function shopeeSearchProducts(params: {
  query: string;
  filters?: ShopeeSearchFilters;
  sort?: "relevance" | "sales";
  country?: string;
}): Promise<ProductOption[]> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Usuário não autenticado.");
  }

  const userId = data.user.id;
  // se você tiver orgId em algum lugar, preenche aqui; por enquanto vazio
  const orgId = "";

  const body = {
    userId,
    orgId,
    query: params.query,
    sort: params.sort ?? "relevance",
    country: params.country ?? "BR",
    filters: {
      limit: params.filters?.limit ?? 24,
      min_rating: params.filters?.minRating ?? 0,
      only_promo: params.filters?.onlyPromo ?? false,
    },
  };

  const resp = await fetch(`${N8N_BASE_URL}/webhook/shopee_search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // se o webhook exigir x-api-key pública, coloca aqui:
      // "x-api-key": import.meta.env.VITE_N8N_PUBLIC_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    console.error("Shopee search error:", txt);
    throw new Error(`Erro ao buscar produtos na Shopee (${resp.status}).`);
  }

  const json = await resp.json();
  const items = json.items ?? []; // o workflow monta isso no "Map for API"

  const products: ProductOption[] = items.map((p: any) => ({
    productName: p.title,
    imageUrl: p.image,
    price: p.price,
    rating: p.rating ?? 0,
    commission: p.commission_percent ?? null,
    salesVolume: p.sales_count ?? null,
    productUrl: p.url,          // url que você vai mostrar na seleção
    // extras se tiver no seu type:
    originalPrice: p.original_price ?? null,
    store: p.store ?? null,
  }));

  return products;
}

/**
 * Gera link de afiliado com SUBID via n8n (/webhook/shopee_subids)
 * e o workflow já cuida de salvar/agendamento no Postgres.
 */
export async function shopeeGenerateAffiliateLink(params: {
  platform: string; // 'facebook' | 'instagram' | etc
  product: {
    id: string;
    title: string;
    price: number;
    rating?: number;
    image?: string;
    url: string;   // url base (da oferta)
  };
}): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Usuário não autenticado.");
  }

  const userId = data.user.id;
  const orgId = "";

  const body = {
    base_url: params.product.url,
    platform: params.platform,
    product: params.product,
    userId,
    orgId,
  };

  const resp = await fetch(`${N8N_BASE_URL}/webhook/shopee_subids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "x-api-key": import.meta.env.VITE_N8N_PUBLIC_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    console.error("Shopee subids error:", txt);
    throw new Error(`Erro ao gerar link com SUBID (${resp.status}).`);
  }

  const json = await resp.json();
  // seu workflow responde em json.items[0].url com o link rastreável
  const url = json.items?.[0]?.url || params.product.url;
  return url;
}
