# Estágio 1: Build da Aplicação
# Usamos uma imagem Node.js para compilar o projeto Vite/React
FROM node:20-alpine AS build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de gerenciamento de pacotes
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código-fonte do projeto para o contêiner
COPY . .

# Executa o script de build para gerar os arquivos estáticos de produção
RUN npm run build

# Estágio 2: Servir a Aplicação
# Usamos uma imagem leve do Nginx para servir os arquivos estáticos
FROM nginx:stable-alpine

# Copia a configuração personalizada do Nginx que criamos
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do estágio de 'build' para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80 para permitir o tráfego web
EXPOSE 80

# Inicia o servidor Nginx em modo 'foreground' para manter o contêiner rodando
CMD ["nginx", "-g", "daemon off;"]
