FROM nginx:alpine

COPY . /usr/share/nginx/html

LABEL org.opencontainers.image.source=https://github.com/dimigomeal/dimigomeal-web