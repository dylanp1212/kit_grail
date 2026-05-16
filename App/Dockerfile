FROM node:25-alpine
RUN apk add --no-cache nginx
EXPOSE 3000 3010 3011 3012 3013

WORKDIR /home/app

# Copy package.json files first so npm install is cached unless dependencies change
COPY package.json /home/app/

COPY AuthService/package.json /home/app/AuthService/
COPY Kit_ListingMS/package.json /home/app/Kit_ListingMS/
COPY WishlistMS/package.json /home/app/WishlistMS/
COPY Shopper/package.json /home/app/Shopper/
COPY Seller/backend/package.json /home/app/Seller/backend/
COPY Seller/frontend/package.json /home/app/Seller/frontend/

RUN npm run cis

# Copy build artifacts after install so code changes don't bust the install cache
COPY .env /home/app/

COPY AuthService/build/ /home/app/AuthService/build/

COPY Kit_ListingMS/build/ /home/app/Kit_ListingMS/build/

COPY WishlistMS/build/ /home/app/WishlistMS/build/

COPY Shopper/.next/ /home/app/Shopper/.next/
COPY Shopper/next.config.ts /home/app/Shopper/
COPY Shopper/public/ /home/app/Shopper/public/
COPY Shopper/messages/ /home/app/Shopper/messages/

COPY Seller/backend/build/ /home/app/Seller/backend/build/

COPY Seller/frontend/dist/ /home/app/Seller/frontend/dist/
COPY Seller/frontend/vite.config.ts /home/app/Seller/frontend/

COPY nginx.conf /etc/nginx/nginx.conf

CMD [ "npm", "run", "start-container" ]
