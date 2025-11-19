# CORS Fix for AI Coach Producer

## Overview
This guide provides step-by-step instructions to fix the CORS (Cross-Origin Resource Sharing) error preventing your frontend from communicating with the AWS Lambda API Gateway endpoint.

## The Problem
Your browser blocks cross-origin requests when the API response lacks proper CORS headers:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

## Solution: Two Approaches

### Approach 1: Update Lambda Function (Recommended)

Your Lambda function (`fpku-ai-coach-orchestrator-v3`) must return CORS headers in all responses.

**File: `lambda_function.py`** (provided separately)

Key changes:
1. Define centralized `CORS_HEADERS` constant
2. Handle `OPTIONS` preflight requests (return 204 with CORS headers)
3. Include CORS headers in all POST responses (success and error)

**To deploy:**

Option A - AWS Console (Manual):
1. Go to AWS Lambda console
2. Select function `fpku-ai-coach-orchestrator-v3`
3. Open Code tab
4. Copy contents of `lambda_function.py` into inline editor
5. Click Deploy
6. Wait for deployment to complete

Option B - AWS CLI:
```bash
# Package the function
zip lambda_deployment.zip lambda_function.py

# Update the function
aws lambda update-function-code \
  --function-name fpku-ai-coach-orchestrator-v3 \
  --zip-file fileb://lambda_deployment.zip \
  --region us-east-2
```

### Approach 2: Enable CORS in API Gateway (Complementary)

Even with Lambda returning CORS headers, API Gateway itself must allow them through.

**To enable CORS in API Gateway Console:**

1. Open [AWS API Gateway Console](https://console.aws.amazon.com/apigateway)
2. Select your API: **AI-Coach-Orchestrator-API**
3. In the left sidebar, click **Develop**
4. Select **CORS** (or look for CORS settings)
5. Configure CORS settings:
   - **Allowed Origins:** `*` (or specific: `http://127.0.0.1:8080`)
   - **Allowed Headers:** `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
   - **Allowed Methods:** `OPTIONS,POST`
6. Click **Save**
7. Look for deployment/publish option and confirm changes are deployed

**To enable CORS via AWS CLI:**
```bash
# For HTTP API (recommended for CORS)
aws apigatewayv2 update-api \
  --api-id YOUR_API_ID \
  --cors-configuration AllowOrigins="*",AllowMethods="OPTIONS,POST",AllowHeaders="Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token" \
  --region us-east-2
```

## Verification

### Step 1: Test with curl (preflight request)
```bash
curl -i -X OPTIONS \
  -H "Origin: http://127.0.0.1:8080" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://57y3bjg772.execute-api.us-east-2.amazonaws.com/orchestrate
```

**Expected response headers:**
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: OPTIONS,POST
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

### Step 2: Start local server
```bash
cd C:\Users\Jashon\ai-coach-producer
npm start
```

### Step 3: Test in browser
1. Open http://127.0.0.1:8080
2. Click "Generate Audio" button
3. Check browser Console (F12):
   - Should NOT see CORS preflight error
   - Should see successful API response
   - Audio should play (if Lambda executes successfully)

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| CORS preflight error | API Gateway not returning CORS headers | Enable CORS in API Gateway OR ensure Lambda returns headers |
| 502 Bad Gateway | Lambda execution error | Check Lambda logs in CloudWatch |
| 404 Not Found | Wrong endpoint URL | Verify API endpoint: `https://57y3bjg772.execute-api.us-east-2.amazonaws.com/` |
| No audio plays | S3 bucket or Polly service issue | Check CloudWatch logs for specific error |

## Files Provided

1. **lambda_function.py** - Updated Lambda with CORS handling
2. **CORS_FIX_GUIDE.md** - This guide
3. **index.html** - Frontend (already updated with correct endpoint)

## Next Steps

1. Deploy Lambda function (Approach 1)
2. Enable CORS in API Gateway (Approach 2)
3. Run curl preflight test
4. Start local server and test in browser

If you hit any issues, check CloudWatch logs for your Lambda function:
- AWS Lambda Console → Select function → Monitor tab → View logs in CloudWatch
