import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

type SubidSettings = {
  shopeeDefaultSubid: string;
  shopeeSubidInstagram: string;
  shopeeSubidFacebook: string;
  shopeeSubidX: string;
  shopeeSubidTiktok: string;
  shopeeSubidWhatsapp: string;
  shopeeSubidWeb: string;
};

const initialState: SubidSettings = {
  shopeeDefaultSubid: "",
  shopeeSubidInstagram: "",
  shopeeSubidFacebook: "",
  shopeeSubidX: "",
  shopeeSubidTiktok: "",
  shopeeSubidWhatsapp: "",
  shopeeSubidWeb: "",
};

export const SubidSettingsPage: React.FC = () => {
  const [values, setValues] = useState<SubidSettings>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error(
            "Você precisa estar logado para configurar os SubIDs."
          );
        }

        const { data, error } = await supabase
          .from("user_api_keys")
          .select("keys")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        const keys = (data?.keys as any) || {};

        setValues({
          shopeeDefaultSubid: keys.shopeeDefaultSubid || "",
          shopeeSubidInstagram: keys.shopeeSubidInstagram || "",
          shopeeSubidFacebook: keys.shopeeSubidFacebook || "",
          shopeeSubidX: keys.shopeeSubidX || "",
          shopeeSubidTiktok: keys.shopeeSubidTiktok || "",
          shopeeSubidWhatsapp: keys.shopeeSubidWhatsapp || "",
          shopeeSubidWeb: keys.shopeeSubidWeb || "",
        });
      } catch (err) {
        console.error(err);
        setStatus({
          type: "error",
          message: "Não foi possível carregar suas configurações de SubID.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const { data, error } = await supabase
        .from("user_api_keys")
        .select("keys")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      const currentKeys = (data?.keys as any) || {};

      const newKeys = {
        ...currentKeys,
        shopeeDefaultSubid: values.shopeeDefaultSubid,
        shopeeSubidInstagram: values.shopeeSubidInstagram,
        shopeeSubidFacebook: values.shopeeSubidFacebook,
        shopeeSubidX: values.shopeeSubidX,
        shopeeSubidTiktok: values.shopeeSubidTiktok,
        shopeeSubidWhatsapp: values.shopeeSubidWhatsapp,
        shopeeSubidWeb: values.shopeeSubidWeb,
      };

      const { error: upsertError } = await supabase
        .from("user_api_keys")
        .upsert({
          user_id: user.id,
          keys: newKeys,
          updated_at: new Date().toISOString(),
        });

      if (upsertError) throw upsertError;

      setStatus({
        type: "success",
        message:
          "SubIDs salvos com sucesso! Eles serão usados automaticamente nos seus links de afiliado.",
      });
    } catch (err: any) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          err?.message ||
          "Ocorreu um erro ao salvar suas configurações de SubID.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-t-orange-500 border-slate-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-2">
        SubIDs & Rastreamento
      </h1>
      <p className="text-gray-400 mb-6">
        Dê um nome simples para cada canal (Instagram, Facebook, X, Web, etc.).
        Nós usamos esses nomes como SubIDs na Shopee, para você saber de onde
        veio cada venda.
      </p>

      <form
        onSubmit={handleSave}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6"
      >
        {status && (
          <div
            className={`text-sm mb-2 p-3 rounded-md ${
              status.type === "success"
                ? "bg-green-500/10 text-green-300"
                : "bg-red-500/10 text-red-300"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-sm text-gray-300 space-y-2">
          <p>
            Exemplo prático:
            <br />
            <span className="text-amber-300">
              @minhaloja (padrão), @minhaloja_ig (Instagram), @minhaloja_fb
              (Facebook), @minhaloja_x (X/Twitter)…
            </span>
          </p>
        </div>

        <div>
          <label
            htmlFor="shopeeDefaultSubid"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Nome padrão da campanha (SubID principal)
          </label>
          <input
            id="shopeeDefaultSubid"
            name="shopeeDefaultSubid"
            type="text"
            value={values.shopeeDefaultSubid}
            onChange={handleChange}
            placeholder="Ex: @minhaloja"
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            Usado quando nenhum canal específico for informado.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="shopeeSubidInstagram"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Instagram
            </label>
            <input
              id="shopeeSubidInstagram"
              name="shopeeSubidInstagram"
              type="text"
              value={values.shopeeSubidInstagram}
              onChange={handleChange}
              placeholder="Ex: @minhaloja_ig"
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="shopeeSubidFacebook"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Facebook
            </label>
            <input
              id="shopeeSubidFacebook"
              name="shopeeSubidFacebook"
              type="text"
              value={values.shopeeSubidFacebook}
              onChange={handleChange}
              placeholder="Ex: @minhaloja_fb"
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="shopeeSubidX"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              X (Twitter)
            </label>
            <input
              id="shopeeSubidX"
              name="shopeeSubidX"
              type="text"
              value={values.shopeeSubidX}
              onChange={handleChange}
              placeholder="Ex: @minhaloja_x"
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="shopeeSubidTiktok"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              TikTok
            </label>
            <input
              id="shopeeSubidTiktok"
              name="shopeeSubidTiktok"
              type="text"
              value={values.shopeeSubidTiktok}
              onChange={handleChange}
              placeholder="Ex: @minhaloja_tt"
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="shopeeSubidWhatsapp"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              WhatsApp
            </label>
            <input
              id="shopeeSubidWhatsapp"
              name="shopeeSubidWhatsapp"
              type="text"
              value={values.shopeeSubidWhatsapp}
              onChange={handleChange}
              placeholder="Ex: @minhaloja_wa"
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="shopeeSubidWeb"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Web / Site / Blog
            </label>
            <input
              id="shopeeSubidWeb"
              name="shopeeSubidWeb"
              type="text"
              value={values.shopeeSubidWeb}
              onChange={handleChange}
              placeholder="Ex: @minhaloja_web"
              className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : "Salvar SubIDs"}
          </button>
        </div>
      </form>
    </div>
  );
};
