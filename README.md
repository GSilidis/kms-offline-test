# offline

Demo project to showcase offline-mode for SPA. Prepared for KMS LH Frontend Team Sync.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Run both front and back in dev mode
```
yarn dev
```

### Build front and run server in prod mode
```
yarn prod
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### NGINX config
In order to properly use service worker, both frontend and api should be served from same origin and in secure environment
Configure NGINX with self-signed certificate and then add config for this app:

```
server {
  listen 443 ssl http2;
  server_name offline.kms.test;
  
  include snippets/self-signed.conf;
  include snippets/ssl-params.conf;

  location / {
    root /home/dir/to/project/dist/;
  }

  location /api/ {
    proxy_pass http://localhost:3000/api/;
    proxy_set_header X-Original-URI $request_uri;
  }
} 
```

## License
All contents in this repository is licensed under MIT license 

Except:
* `/server/data/` - Movies data from Wikipedia (CC BY-SA 3.0)
* `/public/img/movies` - Movie posters from distributors web-sites (Proprietary)
* `/public/img/movies/offline.jpg` - Icon from Google Material icons (Apache 2.0)
