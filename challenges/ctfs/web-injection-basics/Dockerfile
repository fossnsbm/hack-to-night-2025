FROM php:7.4-apache

# Install SQLite
RUN apt-get update && apt-get install -y sqlite3 && \
    docker-php-ext-install pdo pdo_sqlite

WORKDIR /var/www/html

COPY src/ /var/www/html/

RUN chown -R www-data:www-data /var/www/html/
RUN chmod -R 755 /var/www/html/

EXPOSE 80 