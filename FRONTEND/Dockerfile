# Image Node.js
FROM node:20

# Dossier de travail
WORKDIR /app

# Copier package files
COPY package*.json ./

# Installer dépendances
RUN npm install

# Copier le projet
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Lancer React
CMD ["npm", "run", "dev", "--", "--host"]