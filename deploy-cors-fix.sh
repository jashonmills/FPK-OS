#!/bin/bash

# Deploy Lambda function with CORS support
echo "Updating Lambda function..."
zip lambda-function.zip lambda_function.py
aws lambda update-function-code \
    --function-name YOUR_LAMBDA_FUNCTION_NAME \
    --zip-file fileb://lambda-function.zip \
    --region us-east-2

# Update API Gateway to enable CORS
echo "Enabling CORS on API Gateway..."
aws apigateway put-method \
    --rest-api-id 57y3bjg772 \
    --resource-id YOUR_RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region us-east-2

aws apigateway put-method-response \
    --rest-api-id 57y3bjg772 \
    --resource-id YOUR_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters method.response.header.Access-Control-Allow-Headers=false,method.response.header.Access-Control-Allow-Methods=false,method.response.header.Access-Control-Allow-Origin=false \
    --region us-east-2

aws apigateway put-integration \
    --rest-api-id 57y3bjg772 \
    --resource-id YOUR_RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates application/json='{"statusCode": 200}' \
    --region us-east-2

aws apigateway put-integration-response \
    --rest-api-id 57y3bjg772 \
    --resource-id YOUR_RESOURCE_ID \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters method.response.header.Access-Control-Allow-Headers="'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",method.response.header.Access-Control-Allow-Methods="'POST,OPTIONS'",method.response.header.Access-Control-Allow-Origin="'*'" \
    --region us-east-2

# Deploy API
echo "Deploying API..."
aws apigateway create-deployment \
    --rest-api-id 57y3bjg772 \
    --stage-name prod \
    --region us-east-2

echo "CORS fix deployed!"