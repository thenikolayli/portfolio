FROM nginx:latest

# removes default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
# copies custom config in its place
COPY nginx.conf /etc/nginx/conf.d