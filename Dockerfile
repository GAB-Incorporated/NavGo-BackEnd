# Cria a imagem, um usuário nao-root, copia o projeto e expoe a porta
FROM node:20

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN chown -R node:node /home/node/app

USER node

RUN npm install

# O user 'node' (nao root) é dono dos arquivos
COPY --chown=node:node . .

EXPOSE 3333

# Inicia
CMD ["node", "src/index.js"]
