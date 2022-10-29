FROM node:16
ARG DB_USERNAME
ARG DB_PASSWORD
ARG SECRET
ARG GOOGLE_CLIENT_ID
ARG SWAGGERURL_PRD
ARG SES_IAM_USER_ACCESS_KEY
ARG SES_IAM_USER_SECRET_ACCESS_KEY
ARG SENDER_EMAIL_ADDRESS
ARG PRODUCTION_URL

# ENV DB_USERNAME=$DB_USERNAME
# ENV DB_PASSWORD=$DB_PASSWORD
# ENV NODE_ENV=development
# ENV SECRET=$SECRET
# ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
# ENV SWAGGERURL_DEV=$SWAGGERURL_PRD
# ENV SWAGGERURL_PRD=$SWAGGERURL_PRD
# ENV SES_IAM_USER_ACCESS_KEY=$SES_IAM_USER_ACCESS_KEY
# ENV SES_IAM_USER_SECRET_ACCESS_KEY=$SES_IAM_USER_SECRET_ACCESS_KEY
# ENV SENDER_EMAIL_ADDRESS=$SENDER_EMAIL_ADDRESS
# ENV PRODUCTION_URL=$PRODUCTION_URL
# ENV DEVELOPMENT_URL=$PRODUCTION_URL
ENV DB_USERNAME=braincells
ENV DB_PASSWORD=braincells2022
ENV NODE_ENV=development
ENV SECRET=password2022
ENV GOOGLE_CLIENT_ID=521832905941-48org8ocra0oeig9pe2r50fe4e7vqvjh.apps.googleusercontent.com
ENV SWAGGERURL_DEV=http://localhost:3000/api/v1/
ENV SWAGGERURL_PRD=https://nddhjoc145.execute-api.ap-southeast-2.amazonaws.com/api/v1/
ENV SENDER_EMAIL_ADDRESS=info@quicklearner.io
ENV PRODUCTION_URL=https://quicklearner.io
ENV DEVELOPMENT_URL=http://localhost:3001


WORKDIR /usr/src/app
COPY . .
RUN npm install -g npm@8.5.1
RUN npm install yarn
RUN npm install -g babel-cli
RUN yarn
RUN yarn babel
EXPOSE 3000
CMD [ "node", "dist/index.js" ]
