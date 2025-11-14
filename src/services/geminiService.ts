import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { supabase } from './supabase';
import type { ProductOption, PostContent, BlogPost, VideoScript } from '../types';

// CORREÇÃO: Usar import.meta.env para projetos Vite e verificar a chave correta.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    // Esta mensagem agora aparecerá no console do navegador se a chave não estiver definida.
    console.error("VITE_GEMINI_API_KEY environment variable is not set.");
}

// CORREÇÃO: Passar a chave da API obtida pelo Vite.
const ai = new GoogleGenAI({ apiKey: apiKey as string });

// --- Function Declarations for robust data extraction ---

const listProductOptionsTool: FunctionDeclaration = {
    name: "listProductOptions",
    description: "Lists the product options found for the user's query.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            products: {
                type: Type.ARRAY,
                description: "An array of 8 product options.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        productName: { type: Type.STRING, description: "The full and exact product name." },
                        imageUrl: { type: Type.STRING, description: "A direct, real URL to the main product image." },
                        price: { type: Type.STRING, description: "The price in BRL, e.g., 'R$ 199,90'." },
                        rating: { type: Type.NUMBER, description: "The numerical rating, e.g., 4.8." },
                        commission: { type: Type.STRING, description: "A realistic affiliate commission percentage, e.g., '7%'." },
                        salesVolume: { type: Type.STRING, description: "The volume of sales, e.g., '2.1k vendidos'." },
                        productUrl: { type: Type.STRING, description: "The full and real URL to the product page." },
                    },
                    required: ["productName", "imageUrl", "price", "rating", "commission", "salesVolume", "productUrl"]
                }
            }
        },
        required: ["products"]
    }
};

const createSocialMediaPostTool: FunctionDeclaration = {
    name: "createSocialMediaPost",
    description: "Creates the social media post content for the selected product.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            socialPostTitle: { type: Type.STRING, description: "A creative and persuasive title for the social media post." },
            socialPostBody: { type: Type.STRING, description: "The main body of the social media post, including hashtags. This will be the default template." },
            affiliateUrl: { type: Type.STRING, description: "The final, tagged affiliate link." },
            callToAction: { type: Type.STRING, description: "A short, compelling call-to-action phrase, like 'Compre agora!' or 'Clique no link para saber mais!'." },
            postTemplates: {
                type: Type.ARRAY,
                description: "An array of 3 alternative post templates, each with a different marketing angle.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The name of the template's angle, e.g., 'Foco em Benefícios', 'Urgência/Escassez', 'Prova Social'." },
                        body: { type: Type.STRING, description: "The full post body for this template, including hashtags." },
                    },
                    required: ["name", "body"]
                }
            }
        },
        required: ["socialPostTitle", "socialPostBody", "affiliateUrl", "callToAction", "postTemplates"]
    }
};

const createBlogPostTool: FunctionDeclaration = {
    name: "createBlogPost",
    description: "Creates a structured, SEO-optimized blog post.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "The SEO-optimized title for the blog post." },
            introduction: { type: Type.STRING, description: "An engaging introductory paragraph." },
            sections: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        heading: { type: Type.STRING, description: "The heading for this section (e.g., H2 or H3)." },
                        content: { type: Type.STRING, description: "The paragraph content for this section." }
                    },
                    required: ["heading", "content"]
                }
            },
            conclusion: { type: Type.STRING, description: "A concluding paragraph with a call-to-action." },
            seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of relevant SEO keywords." }
        },
        required: ["title", "introduction", "sections", "conclusion", "seoKeywords"]
    }
};

const createVideoScriptTool: FunctionDeclaration = {
    name: "createVideoScript",
    description: "Creates a structured script for a short video (Reels/TikTok) or a long video (YouTube).",
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "A catchy title for the video." },
            hook: { type: Type.STRING, description: "The first 3-5 seconds of the video, designed to grab attention." },
            introduction: { type: Type.STRING, description: "A brief introduction of the product or topic." },
            mainPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of key talking points or scenes for the main body of the video." },
            callToAction: { type: Type.STRING, description: "A clear call-to-action for the viewer." },
            outro: { type: Type.STRING, description: "A concluding sentence or phrase." }
        },
        required: ["title", "hook", "introduction", "mainPoints", "callToAction", "outro"]
    }
};


/**
 * Etapa 1: Busca uma lista de opções de produtos com base em uma consulta.
 */
export const searchProductOptions = async (productQuery: string, provider: string): Promise<ProductOption[]> => {
    if (!apiKey) throw new Error("A chave da IA (VITE_GEMINI_API_KEY) não está configurada.");
    if (!productQuery) {
        throw new Error("Product query is required.");
    }

    // --- Secure Shopee Flow via n8n ---
    if (provider === 'Shopee') {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("Usuário não autenticado. Por favor, faça login.");
            }

            const { data: userApiKeys, error: dbError } = await supabase
                .from('user_api_keys')
                .select('keys')
                .eq('user_id', user.id)
                .single();

            if (dbError && dbError.code !== 'PGRST116') { // Ignore "no rows found" error
                throw dbError;
            }

            const shopeeKeys = userApiKeys?.keys as any;
            if (!shopeeKeys?.shopeeAppId || !shopeeKeys?.shopeePassword) {
                throw new Error("Chaves de API da Shopee não encontradas. Por favor, adicione suas chaves na página 'Chaves de API' em 'Configurações'.");
            }

            const webhookUrl = "https://n8n.seureview.com.br/webhook/shopee_search";
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    query: productQuery, 
                    appId: shopeeKeys.shopeeAppId, 
                    password: shopeeKeys.shopeePassword
                }),
            });

            if (!response.ok) {
                throw new Error(`O serviço da Shopee (n8n) retornou um erro: ${response.status}`);
            }

            const products = await response.json();
             if (!Array.isArray(products)) {
                throw new Error("A resposta da busca da Shopee não é um array válido.");
            }
            return products;

        } catch (error: any) {
            console.error("Error during Shopee product search:", error);
            const errorMessage = error.message || "Ocorreu um erro desconhecido.";
            throw new Error(`Falha ao buscar produtos da Shopee. Detalhes: ${errorMessage}`);
        }
    }


    // --- Gemini Flow for other providers ---
    const providerInstruction = provider === 'all'
        ? "Busque em diversas lojas de afiliados populares (como Amazon, Mercado Livre)."
        : `Foque sua busca exclusivamente na loja: "${provider}".`;

    const prompt = `
        Você é um assistente de marketing de afiliados. Um usuário está buscando por: "${productQuery}".
        Sua tarefa é encontrar os 8 melhores e mais vendidos produtos. ${providerInstruction}
        Para cada produto, forneça: nome completo, URL da imagem, preço, avaliação, comissão, volume de vendas e a URL da página do produto.
        Após coletar os dados, chame a ferramenta 'listProductOptions' com os resultados.
    `;


    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                tools: [{ functionDeclarations: [listProductOptionsTool] }],
                toolConfig: {
                    functionCallingConfig: {
                        mode: "ANY",
                        allowedFunctionNames: ["listProductOptions"]
                    }
                }
            }
        });

        const functionCall = response.functionCalls?.[0];

        if (!functionCall || functionCall.name !== 'listProductOptions') {
            throw new Error("A IA não retornou os produtos na estrutura esperada.");
        }

        const products = functionCall.args?.products as ProductOption[];
        if (!products || !Array.isArray(products)) {
            throw new Error("Os dados dos produtos retornados pela IA são inválidos.");
        }
        
        return products;

    } catch (error) {
        console.error("Error calling Gemini API for product search:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to search for products. Details: ${errorMessage}`);
    }
};

/**
 * Etapa 2: Gera o conteúdo detalhado para um produto selecionado.
 */
export const generatePostForProduct = async (product: ProductOption, provider: string): Promise<PostContent & { productImageUrl: string }> => {
    if (!apiKey) throw new Error("A chave da IA (VITE_GEMINI_API_KEY) não está configurada.");
    let prompt: string;
    
    const commonInstructions = `
        Com base nas informações do produto, gere o seguinte conteúdo:
        1.  **Título do Post:** Um título criativo e persuasivo para redes sociais.
        2.  **Corpo do Post (Padrão):** O texto principal da postagem, otimizado para engajamento, com emojis e hashtags relevantes.
        3.  **Call to Action (CTA):** Uma frase curta e direta para incentivar o clique, como "Compre agora!" ou "Clique e confira!".
        4.  **Link de Afiliado Final:** O link de afiliado final e tagueado no campo 'affiliateUrl'.
        5.  **3 Modelos de Post Alternativos:** Crie 3 templates de post, cada um com uma abordagem de marketing diferente:
            - Template 1: Nome 'Foco em Benefícios', corpo destacando como o produto resolve um problema ou melhora a vida do cliente.
            - Template 2: Nome 'Urgência/Escassez', corpo criando um senso de urgência (ex: "estoque limitado", "promoção acaba hoje").
            - Template 3: Nome 'Prova Social', corpo mencionando a popularidade do produto (ex: "o mais vendido", "milhares de clientes satisfeitos").
        
        Após gerar todo o conteúdo, chame a ferramenta 'createSocialMediaPost'.
    `;

    if (provider === 'Shopee') {
        prompt = `
            Você é um emulador da API Oficial de Afiliados da Shopee e um especialista em marketing. Sua tarefa é simular a mutação 'generateShortLink' para o produto: "${product.productName}" e criar conteúdo para ele.
            A URL original do produto é: ${product.productUrl}.
            - **Simule a chamada da API:** Gere um link de afiliado no formato oficial da Shopee (ex: "https://shope.ee/A1b2C3d4E5").
            - **Simule o rastreamento:** Adicione os seguintes parâmetros de rastreamento ao link gerado: \`?sub_id=seureview_app&sub_id2=content_generator&utm_source=seureview&utm_medium=social\`.
            - **Crie o conteúdo:** ${commonInstructions}
        `;
    } else {
        prompt = `
            Você é um especialista em marketing de afiliados. Sua tarefa é gerar conteúdo para o produto: "${product.productName}".
            - Crie um link de afiliado fictício para a URL: "${product.productUrl}".
            - **Crie o conteúdo:** ${commonInstructions}
        `;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                tools: [{ functionDeclarations: [createSocialMediaPostTool] }],
                toolConfig: {
                    functionCallingConfig: {
                        mode: "ANY",
                        allowedFunctionNames: ["createSocialMediaPost"]
                    }
                }
            }
        });

        const functionCall = response.functionCalls?.[0];

        if (!functionCall || functionCall.name !== 'createSocialMediaPost') {
            throw new Error("A IA não retornou o conteúdo do post na estrutura esperada.");
        }

        const postContent = functionCall.args as PostContent;
        if (!postContent) {
            throw new Error("Os dados do post retornados pela IA são inválidos.");
        }

        return { ...postContent, productImageUrl: product.imageUrl };

    } catch (error) {
        console.error("Error calling Gemini API for post generation:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to generate post content. Details: ${errorMessage}`);
    }
};


/**
 * Gera um vídeo curto para Reels.
 */
// NOTE: This part remains unchanged as it doesn't involve user-specific API keys.
import { GoogleGenAI as GoogleGenAIVideo } from "@google/genai";

export const generateReelsVideo = async (prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("A chave da IA (VITE_GEMINI_API_KEY) não está configurada.");
  try {
    // CORREÇÃO: Usar a chave da API do Vite
    const aiVideo = new GoogleGenAIVideo({ apiKey: apiKey as string });
    let operation = await aiVideo.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p', 
        aspectRatio: '9:16'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await aiVideo.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("A API não retornou um link de download para o vídeo.");
    }

    // CORREÇÃO: Usar a chave da API do Vite
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!response.ok) {
        throw new Error(`Falha ao baixar o vídeo. Status: ${response.status}`);
    }
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
  } catch(err) {
      console.error("Error generating video:", err);
      throw err; // Re-throw the original error to be handled by the component
  }
};

/**
 * Gera uma imagem de marketing com Imagen.
 */
export const generateMarketingImage = async (prompt: string): Promise<string> => {
    if (!apiKey) throw new Error("A chave da IA (VITE_GEMINI_API_KEY) não está configurada.");
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating marketing image:", error);
        throw new Error("Falha ao gerar a imagem. Verifique o prompt ou tente novamente mais tarde.");
    }
};

/**
 * Fornece sugestões de otimização para um post.
 */
export const getOptimizationSuggestions = async (title: string, body: string): Promise<string[]> => {
    if (!apiKey) throw new Error("A chave da IA (VITE_GEMINI_API_KEY) não está configurada.");
    const prompt = `
        Analise o seguinte post de afiliado e forneça 3 sugestões curtas e acionáveis para melhorar o engajamento e a conversão.
        Foque em: gancho inicial, clareza dos benefícios e o call-to-action.
        Retorne apenas uma lista de 3 frases.

        Título: "${title}"
        Corpo: "${body}"
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
        });
        // Split response text into an array of suggestions
        return response.text.split('\n').map(s => s.replace(/^[*-]\s*/, '')).filter(Boolean);
    } catch (error) {
        console.error("Error getting optimization suggestions:", error);
        return ["Não foi possível carregar sugestões no momento."];
    }
};

/**
 * Gera um post de blog otimizado para SEO.
 */
export const generateBlogPost = async (topic: string): Promise<BlogPost> => {
    if (!apiKey) throw new Error("A chave da IA (VITE_GEMINI_API_KEY) não está configurada.");
    const prompt = `
        Você é um especialista em SEO e marketing de conteúdo. Sua tarefa é criar um artigo de blog completo e otimizado sobre o tópico: "${topic}".
        O artigo deve ter uma introdução cativante, pelo menos 3 seções principais com títulos informativos (H2/H3), e uma conclusão forte com um call-to-action.
        No final, liste 5-7 palavras-chave relevantes para SEO.
        Estruture sua resposta usando a ferramenta 'createBlogPost'.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using a more powerful model for long-form content
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                tools: [{ functionDeclarations: [createBlogPostTool] }],
                 toolConfig: { functionCallingConfig: { mode: "ANY", allowedFunctionNames: ["createBlogPost"] } }
            }
        });
        const functionCall = response.functionCalls?.[0];
        if (!functionCall || functionCall.name !== 'createBlogPost') {
            throw new Error("A IA não retornou o artigo de blog na estrutura esperada.");
        }
        return functionCall.args as BlogPost;
    } catch (error) {
        console.error("Error generating blog post:", error);
        throw new Error("Falha ao gerar o artigo de blog.");
    }
};

/**
 * Gera um roteiro de vídeo.
 */
export const generateVideoScript = async (topic: string, videoType: 'short' | 'long'): Promise<VideoScript> => {
    if (!apiKey) throw new Error("A chave da IA (VITE_GEMINI_API_KEY) não está configurada.");
    const prompt = `
        Você é um roteirista de vídeos para redes sociais. Crie um roteiro para um vídeo do tipo "${videoType === 'short' ? 'Curto (Reels/TikTok)' : 'Longo (YouTube)'}" sobre o tópico: "${topic}".
        O roteiro deve incluir um título, um gancho forte para os primeiros segundos, uma introdução, os pontos principais a serem abordados, um call-to-action claro e um encerramento.
        Estruture a resposta usando a ferramenta 'createVideoScript'.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                tools: [{ functionDeclarations: [createVideoScriptTool] }],
                 toolConfig: { functionCallingConfig: { mode: "ANY", allowedFunctionNames: ["createVideoScript"] } }
            }
        });
        const functionCall = response.functionCalls?.[0];
        if (!functionCall || functionCall.name !== 'createVideoScript') {
            throw new Error("A IA não retornou o roteiro na estrutura esperada.");
        }
        return functionCall.args as VideoScript;
    } catch (error) {
        console.error("Error generating video script:", error);
        throw new Error("Falha ao gerar o roteiro do vídeo.");
    }
};

/**
 * Compara dois produtos e gera um resumo e uma tabela.
 */
export const compareProducts = async (product1: ProductOption, product2: ProductOption): Promise<string> => {
    if (!apiKey) throw new Error("A chave da IA (VITE_GEMINI_API_KEY) não está configurada.");
    const prompt = `
        Você é um especialista em análise de produtos. Compare os dois produtos a seguir e gere uma resposta em Markdown.

        Produto 1:
        Nome: ${product1.productName}
        Preço: ${product1.price}
        Avaliação: ${product1.rating}
        Vendas: ${product1.salesVolume}

        Produto 2:
        Nome: ${product2.productName}
        Preço: ${product2.price}
        Avaliação: ${product2.rating}
        Vendas: ${product2.salesVolume}

        Sua resposta deve conter:
        1.  Um parágrafo de "Veredito Rápido" resumindo qual produto é melhor para qual tipo de consumidor.
        2.  Uma seção de "Pontos Positivos" para cada produto.
        3.  Uma tabela de comparação (usando sintaxe Markdown) com as características: Preço, Avaliação e Popularidade (vendas).
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
        });
        return response.text;
    } catch (error) {
        console.error("Error comparing products:", error);
        throw new Error("Falha ao comparar os produtos.");
    }
};
