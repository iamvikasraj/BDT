exports.handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization, Accept, Origin, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Credentials': 'true',
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
    
    // Handle different content types
    let requestBody = body;
    
    if (httpMethod !== 'GET' && body) {
      if (headers['content-type'] && headers['content-type'].includes('application/json')) {
        // For JSON data, parse and reconstruct as FormData if it contains base64 file
        try {
          const jsonData = JSON.parse(body);
          
          if (jsonData.file && jsonData.filename) {
            // This is a file upload with base64 data - convert to FormData
            const formData = new FormData();
            
            // Convert base64 to blob
            const binaryString = atob(jsonData.file);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: jsonData.content_type || 'application/pdf' });
            
            // Add fields to FormData
            formData.append('user_id', jsonData.user_id);
            formData.append('file', blob, jsonData.filename);
            
            if (jsonData.text_input) {
              formData.append('text_input', jsonData.text_input);
            }
            
            requestBody = formData;
            // Don't set Content-Type - let fetch set the boundary
          } else {
            // Regular JSON data
            requestBody = body;
            apiHeaders['Content-Type'] = 'application/json';
          }
        } catch (e) {
          // If JSON parsing fails, treat as regular JSON
          requestBody = body;
          apiHeaders['Content-Type'] = 'application/json';
        }
      } else if (headers['content-type'] && headers['content-type'].includes('multipart/form-data')) {
        // For multipart/form-data, pass the raw body as buffer
        requestBody = Buffer.from(body, 'base64');
        // Don't set Content-Type - let fetch set the boundary
      } else if (headers['content-type'] && headers['content-type'].includes('application/x-www-form-urlencoded')) {
        // For URL-encoded data, parse and reconstruct
        const formData = new URLSearchParams();
        const params = new URLSearchParams(body);
        for (const [key, value] of params) {
          formData.append(key, value);
        }
        requestBody = formData.toString();
        apiHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        // For other types, set the content type
        apiHeaders['Content-Type'] = headers['content-type'] || 'application/json';
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
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization, Accept, Origin, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Credentials': 'true',
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
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization, Accept, Origin, X-Requested-With',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};