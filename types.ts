
export interface ProductOption {
  productName: string;
  imageUrl: string;
  price: string;
  rating: number;
  commission: string;
  salesVolume: string; // Ex: "1.5k vendidos"
  productUrl: string; // URL real do produto na loja
}

export interface PostContent {
  socialPostTitle: string;
  socialPostBody: string;
  affiliateUrl: string; // O link final gerado e tagueado
  callToAction: string; // Ex: "Compre agora!", "Clique no link!"
  postTemplates: {
    name: string; // Ex: "Foco em Benefícios", "Urgência"
    body: string;
  }[];
}

export interface HistoryItem {
  id: string;
  product: ProductOption;
  content: PostContent & { productImageUrl: string };
  generatedAt: string;
}

export interface ScheduledPostItem {
  id: string;
  product: ProductOption;
  content: PostContent & { productImageUrl: string };
  scheduledAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  contentCount: number;
}

export interface BlogPost {
    title: string;
    introduction: string;
    sections: {
        heading: string;
        content: string;
    }[];
    conclusion: string;
    seoKeywords: string[];
}

export interface VideoScript {
    title: string;
    hook: string;
    introduction: string;
    mainPoints: string[];
    callToAction: string;
    outro: string;
}


// Fix: Centralized AIStudio interface to resolve global type declaration conflicts by declaring it inside the global scope.
declare global {
    interface AIStudio {
        hasSelectedApiKey: () => Promise<boolean>;
        openSelectKey: () => Promise<void>;
    }
    
    interface Window {
        // FIX: Made aistudio optional to resolve declaration conflict.
        aistudio?: AIStudio;
    }
}
