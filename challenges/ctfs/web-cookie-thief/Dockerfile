FROM php:7.4-apache

WORKDIR /var/www/html

COPY src/ /var/www/html/

RUN chown -R www-data:www-data /var/www/html/
RUN chmod -R 755 /var/www/html/

EXPOSE 80 