# Set EB BUCKET as env variable and log in to ECR
EB_BUCKET=elasticbeanstalk-us-west-2-436925851720
aws configure set default.region us-west-2
eval $(aws ecr get-login --no-include-email --region us-west-2)
docker --version

# Build docker image based on production Dockerfile
docker image build -t vartanovs/zip-to-msa-api -f prod.Dockerfile .

# Push built image to ECR
docker tag vartanovs/zip-to-msa-api:latest 436925851720.dkr.ecr.us-west-2.amazonaws.com/zip-to-msa-api:$TRAVIS_COMMIT
docker push 436925851720.dkr.ecr.us-west-2.amazonaws.com/zip-to-msa-api:$TRAVIS_COMMIT
# Replace <VERSION> in Dockerrun file with Travis SHA
sed -i='' "s/<VERSION>/$TRAVIS_COMMIT/" Dockerrun.aws.json
# Zip modified Dockerrun with any ebextensions
zip -r zip-to-msa-api-prod-deploy.zip Dockerrun.aws.json .ebextensions
# Upload zip file to s3 bucket
aws s3 cp zip-to-msa-api-prod-deploy.zip s3://$EB_BUCKET/zip-to-msa-api-prod-deploy.zip
# Create a new application version with new Dockerrun
aws elasticbeanstalk create-application-version --application-name zip-to-msa-api --version-label $TRAVIS_COMMIT --source-bundle S3Bucket=$EB_BUCKET,S3Key=zip-to-msa-api-prod-deploy.zip
# Update environment to use new version number
aws elasticbeanstalk update-environment --environment-name zip-to-msa-api-prod --version-label $TRAVIS_COMMIT
