#!/bin/sh

# Parcourt les variables VITE_ de l'environnement Docker et remplace les placeholders dans les fichiers JS/CSS
for var in $(env | grep ^VITE_ | sed 's/=.*//'); do
  value=$(printenv $var)
  echo "Injecting $var with value $value"
  find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|__${var}__|${value}|g" {} +
done

exec "$@"
