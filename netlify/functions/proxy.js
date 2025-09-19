exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    };
  }

  try {
    const { httpMethod, path, headers, body } = event;
    
    // Extract the target URL from the path
    const targetPath = path.replace('/.netlify/functions/proxy', '');
    const targetUrl = `https://blood-diagnostic-bot-7b4wpufaoq-el.a.run.app${targetPath}`;
    
    // Prepare headers for the API request
    const apiHeaders = {
      'X-API-Key': headers['x-api-key'] || 'healthcare-llm-gateway-api-key',
      'Content-Type': headers['content-type'] || 'application/json',
    };
    
    // Make the request to your API
    const response = await fetch(targetUrl, {
      method: httpMethod,
      headers: apiHeaders,
      body: httpMethod !== 'GET' ? body : undefined,
    });
    
    const responseData = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
      body: responseData,
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
