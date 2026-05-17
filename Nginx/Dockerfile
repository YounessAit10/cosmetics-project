FROM nginx:latest

# Supprimer la config par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier notre config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
