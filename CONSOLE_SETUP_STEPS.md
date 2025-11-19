# AWS Console - Manual CORS Fix Steps

## Problem
Your IAM user (fpkx-app-s3-uploader) only has S3 permissions, not Lambda or API Gateway permissions.

## Solution: Use AWS Console (requires Admin/Root account access)

### Step 1: Deploy Lambda with CORS Headers

1. Open [AWS Lambda Console](https://console.aws.amazon.com/lambda/home?region=us-east-2)
2. Search for function: **fpku-ai-coach-orchestrator-v3**
3. Click on the function name
4. In the **Code** tab, click **Upload from**  → **.zip file**
5. Choose the file: `C:\Users\Jashon\ai-coach-producer\lambda_deployment.zip`
6. Click **Save** or **Deploy**
7. Wait for deployment to complete (you'll see "The function has been successfully updated")

**Alternative: Inline Edit**
1. In the Code editor, select all current code
2. Delete it and paste the contents of `lambda_function.py`
3. Click **Deploy**

### Step 2: Enable CORS on API Gateway

1. Open [API Gateway Console](https://console.aws.amazon.com/apigateway/home?region=us-east-2)
2. Select the API: **AI-Coach-Orchestrator-API**
3. In the left sidebar, click **Develop**
4. Look for **CORS** option or similar
5. Set CORS configuration:
   - **Allowed Origins:** `*`
   - **Allowed Methods:** `OPTIONS, POST`
   - **Allowed Headers:** `Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token`
6. Click **Save**
7. Look for **Deploy** or **Publish** button to apply changes

### Step 3: Test in Browser

1. Open terminal and start local server:
   ```powershell
   cd C:\Users\Jashon\ai-coach-producer
   npm start
   ```

2. Open browser: http://127.0.0.1:8080

3. Click "Generate Audio" button

4. Check browser Console (F12):
   - Should NOT see CORS error
   - Should see "Success! Audio is ready"
   - Audio should play

### Step 4: Verify with Curl (Optional)

```bash
curl -i -X OPTIONS ^
  -H "Origin: http://127.0.0.1:8080" ^
  -H "Access-Control-Request-Method: POST" ^
  -H "Access-Control-Request-Headers: Content-Type" ^
  https://57y3bjg772.execute-api.us-east-2.amazonaws.com/orchestrate
```

Expected response:
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: OPTIONS,POST
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
```

## Files Ready for Upload

- **lambda_deployment.zip** - Contains updated Lambda with CORS (located in your project folder)
- **lambda_function.py** - Source code if you need to manually edit

## Important Notes

- The frontend `index.html` is already configured and ready
- Once Lambda is deployed and API Gateway CORS is enabled, everything should work
- You may need to use your root AWS account or an account with admin privileges to make these changes
