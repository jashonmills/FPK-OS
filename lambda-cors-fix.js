// Add this to the beginning of your Lambda handler response:

return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'content-type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS'
    },
    body: JSON.stringify({
        message: "Successfully generated and merged audio!",
        audio_url: audioUrl
    })
};