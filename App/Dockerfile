FROM node:25-alpine
EXPOSE 3000 3001 3010 3011 3012 3013

WORKDIR /home/app

COPY package.json /home/app/
COPY .env /home/app/

COPY AuthService/build/ /home/app/AuthService/build/
COPY AuthService/package.json /home/app/AuthService/

COPY Kit_ListingMS/build/ /home/app/Kit_ListingMS/build/
COPY Kit_ListingMS/package.json /home/app/Kit_ListingMS/

COPY WishlistMS/build/ /home/app/WishlistMS/build/
COPY WishlistMS/package.json /home/app/WishlistMS/

COPY Shopper/.next/ /home/app/Shopper/.next/
COPY Shopper/package.json /home/app/Shopper/
COPY Shopper/next.config.ts /home/app/Shopper/
COPY Shopper/public/ /home/app/Shopper/public/
COPY Shopper/messages/ /home/app/Shopper/messages/

COPY Seller/backend/build/ /home/app/Seller/backend/build/
COPY Seller/backend/package.json /home/app/Seller/backend/

COPY Seller/frontend/dist/ /home/app/Seller/frontend/dist/
COPY Seller/frontend/package.json /home/app/Seller/frontend/
COPY Seller/frontend/vite.config.ts /home/app/Seller/frontend/

RUN npm run cis

CMD [ "npm", "start" ]
