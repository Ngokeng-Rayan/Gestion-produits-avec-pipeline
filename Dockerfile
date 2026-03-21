# Stage 1: Build dependencies
FROM composer:latest AS composer-builder

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-autoloader \
    --prefer-dist \
    --ignore-platform-reqs

# Copy application code
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize --no-dev

# Stage 2: Production image
FROM php:8.2-fpm

# Arguments
ARG user=laravel
ARG uid=1000

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create system user
RUN useradd -G www-data,root -u $uid -d /home/$user $user && \
    mkdir -p /home/$user && \
    chown -R $user:$user /home/$user

# Set working directory
WORKDIR /var/www

# Copy application from builder stage
COPY --from=composer-builder --chown=$user:$user /app /var/www

# Set proper permissions
RUN chown -R $user:www-data /var/www/storage /var/www/bootstrap/cache && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Switch to user
USER $user

# Expose port 9000 for PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
