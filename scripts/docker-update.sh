# 1. Remove image from local environment
# 2. Rebuild image with updated package.json
# 3. Push image to Docker Hub

echo -e "\033[1;33m'CTRL + Z' to kill this script\033[0m"

echo -e "\033[1;36mRemoving existing image from local environment...\033[0m"
docker image rm vartanovs/zip-to-msa-api --force
echo -e "\033[1;36mRebuilding image with updated package.json...\033[0m"
docker build -t vartanovs/zip-to-msa-api -f Dockerfile .
echo -e "\033[1;36mPushing image to Docker Hub...\033[0m"
docker push vartanovs/zip-to-msa-api
echo -e "\033[1;32mDone!\033[0m"
