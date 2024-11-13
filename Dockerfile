# Cria a imagem, copia o projeto e expoe a porta
FROM node:20

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3333

CMD ["node", "src/index.js"]
