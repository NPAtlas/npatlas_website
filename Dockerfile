FROM php:7.3-apache

RUN a2enmod rewrite

# RUN apt-get update && apt-get install -y libpq-dev && docker-php-ext-install mysqli 
RUN docker-php-ext-install mysqli 

COPY ./sites-enabled/npatlas.conf /etc/apache2/sites-enabled/
