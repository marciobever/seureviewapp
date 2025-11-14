# Estágio 1: Build da Aplicação
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copia todo o código-fonte do projeto para o contêiner
COPY . .

# >>> AQUI: recebe a key do build e expõe como ENV para o Vite <<<
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Executa o script de build para gerar os arquivos estáticos de produção
RUN npm run build

# Estágio 2: Servir a Aplicação
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
