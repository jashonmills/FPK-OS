import json

def lambda_handler(event, context):
    # Your existing logic here
    
    # Return response with CORS headers
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',  # or 'http://127.0.0.1:8080'
            'Access-Control-Allow-Headers': 'Content-Type,X-Requested-With',
            'Access-Control-Allow-Methods': 'POST,OPTIONS'
        },
        'body': json.dumps({
            'audio_url': 'your_audio_url_here'
        })
    }