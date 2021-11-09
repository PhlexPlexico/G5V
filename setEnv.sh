#/bin/bash

sed -i "s|REPLACEDBYDOCKER|$CADDY_URL|g" Caddyfile
sed -i "s|PROXY_URL_REPLACE|$CADDY_PROXY_URL|g" Caddyfile
sed -i "s|API_END_POINT|$CADDY_API_ENDPOINT|g" Caddyfile