# Image de base
FROM node:20

# Dossier de travail
WORKDIR /app

# Copier les fichiers dépendances
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier le schema Prisma et generer le client avant le build TypeScript
COPY prisma ./prisma
RUN npx prisma generate

# Copier le reste du projet
COPY . .

# Build application
RUN npm run build

# Exposer port
EXPOSE 3000

# Commande lancement
CMD ["sh", "-c", "npx prisma db push && node dist/src/main"]
