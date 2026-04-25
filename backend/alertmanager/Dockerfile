FROM prom/alertmanager:latest

# Installer les certificats CA
USER root
RUN apk add --no-cache ca-certificates

# Revenir à l'utilisateur alertmanager
USER nobody

ENTRYPOINT ["/bin/alertmanager"]
