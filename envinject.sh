#!/bin/bash
echo "Importing Env Variable..."
export DB_USERNAME=$(aws ssm get-parameters --names "DB_USERNAME" --query "Parameters[0].Value")
# echo $DB_USERNAME
export DB_PASSWORD=$(aws ssm get-parameters --names "DB_PASSWORD" --query "Parameters[0].Value")
export SECRET=$(aws ssm get-parameters --names "SECRET" --query "Parameters[0].Value")
# export SWAGGERURL_DEV=$(aws ssm get-parameters --names "SWAGGERURL_DEV" --query "Parameters[0].Value")
# $(aws ssm get-parameters --names "DB_PASSWORD" | jq -r '.Parameters| .[] | "export " + .Name + "=" + .Value + ""')
# $(aws ssm get-parameters --names "SECRET" | jq -r '.Parameters| .[] | "export " + .Name + "=" + .Value + ""')
# $(aws ssm get-parameters --names "SWAGGERURL_DEV" | jq -r '.Parameters| .[] | "export " + .Name + "=" + .Value + ""')
echo "FROM node:16" > Dockerfile


# sed -i '' "s#DB_USERNAME=[^ ]*#DB_USERNAME=${DB_USERNAME}#" Dockerfile
# sed -i '' "s#DB_PASSWORD=[^ ]*#DB_PASSWORD=${DB_PASSWORD}#" Dockerfile
# sed -i '' "s#SECRET=[^ ]*#SECRET=${SECRET}#" Dockerfile
# sed -i '' "s#SWAGGERURL_DEV=[^ ]*#SWAGGERURL_DEV=${SWAGGERURL_DEV}#" Dockerfile

echo "ENV DB_USERNAME="${DB_USERNAME} >> Dockerfile
echo "ENV DB_PASSWORD="${DB_PASSWORD} >> Dockerfile

echo "ARG NODE_ENV=development" >> Dockerfile

echo "ENV SECRET="${SECRET} >> Dockerfile
echo "ENV SWAGGERURL_DEV=http://localhost:3000/api/v1/" >> Dockerfile
echo "ENV SWAGGERURL_PRD=https://nddhjoc145.execute-api.ap-southeast-2.amazonaws.com/api/v1/" >> Dockerfile

echo "WORKDIR /usr/src/app" >> Dockerfile



echo "COPY . ." >> Dockerfile
echo "RUN npm install -g npm@8.5.1" >> Dockerfile
echo "RUN npm install --global yarn" >> Dockerfile
echo "RUN yarn" >> Dockerfile

echo "EXPOSE 3000" >> Dockerfile
echo "CMD [ \"yarn\", \"dev\" ]" >> Dockerfile

# docker build -t quicklearnerbe:2.0 .

# docker run -d -p 3000:3000 --name qlbe quicklearnerbe:1.0

# rm Dockerfile