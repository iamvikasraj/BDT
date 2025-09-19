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
    const { httpMethod, path, headers, body, queryStringParameters } = event;
    
    // Extract the target URL from the path
    const targetPath = path.replace('/.netlify/functions/proxy', '');
    let targetUrl = `https://blood-diagnostic-bot-7b4wpufaoq-el.a.run.app${targetPath}`;
    
    // Add query parameters if they exist
    if (queryStringParameters && Object.keys(queryStringParameters).length > 0) {
      const queryString = new URLSearchParams(queryStringParameters).toString();
      targetUrl += `?${queryString}`;
    }
    
    console.log(`Proxying ${httpMethod} request to: ${targetUrl}`);
    
    // Prepare headers for the API request
    const apiHeaders = {
      'X-API-Key': headers['x-api-key'] || 'healthcare-llm-gateway-api-key',
    };
    
    // Only set Content-Type for non-GET requests and if it's not multipart/form-data
    if (httpMethod !== 'GET' && headers['content-type'] && !headers['content-type'].includes('multipart/form-data')) {
      apiHeaders['Content-Type'] = headers['content-type'];
    }
    
    // Parse body for form data
    let requestBody = body;
    if (httpMethod !== 'GET' && body) {
      try {
        // If it's form data, parse it
        if (headers['content-type'] && headers['content-type'].includes('application/x-www-form-urlencoded')) {
          const formData = new URLSearchParams();
          const params = new URLSearchParams(body);
          for (const [key, value] of params) {
            formData.append(key, value);
          }
          requestBody = formData.toString();
        } else if (headers['content-type'] && headers['content-type'].includes('multipart/form-data')) {
          // For multipart/form-data, pass the raw body and don't set Content-Type
          requestBody = body;
          delete apiHeaders['Content-Type']; // Let fetch set the boundary
        }
      } catch (e) {
        console.log('Body parsing error:', e);
        // Use body as-is if parsing fails
      }
    }
    
    // Make the request to your API
    const response = await fetch(targetUrl, {
      method: httpMethod,
      headers: apiHeaders,
      body: httpMethod !== 'GET' ? requestBody : undefined,
    });
    
    const responseData = await response.text();
    
    console.log(`API Response: ${response.status} - ${responseData.substring(0, 200)}...`);
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
      body: responseData,
    };
    
  } catch (error) {
    console.error('Proxy error:', error);
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
