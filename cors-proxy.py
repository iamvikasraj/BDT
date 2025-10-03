#!/usr/bin/env python3
"""
Simple CORS Proxy Server for Local Development
This server acts as a proxy to bypass CORS restrictions during development.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.request
import urllib.parse
import json
import sys

class CORSProxyHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()

    def do_GET(self):
        self.proxy_request('GET')

    def do_POST(self):
        self.proxy_request('POST')

    def do_PUT(self):
        self.proxy_request('PUT')

    def do_DELETE(self):
        self.proxy_request('DELETE')

    def proxy_request(self, method):
        try:
            # Handle static file serving first
            if not self.path.startswith('/proxy/'):
                self.serve_static_file()
                return
            
            # Extract the target URL from the path
            target_url = self.path[7:]  # Remove '/proxy/' prefix
            
            # Add https:// if no protocol specified
            if not target_url.startswith('http'):
                target_url = 'https://' + target_url
            
            print(f"Proxying {method} request to: {target_url}")
            
            # Prepare headers
            headers = {}
            for header_name, header_value in self.headers.items():
                if header_name.lower() not in ['host', 'content-length']:
                    headers[header_name] = header_value
            
            # Read request body for POST/PUT requests
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = None
            if content_length > 0:
                post_data = self.rfile.read(content_length)
            
            # Make the request to the target server with timeout
            req = urllib.request.Request(target_url, data=post_data, headers=headers, method=method)
            
            # Set timeout for the request (30 seconds)
            with urllib.request.urlopen(req, timeout=30) as response:
                # Read response
                response_data = response.read()
                
                # Send response headers with CORS
                self.send_response(response.status)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization')
                
                # Copy other headers from the target response
                for header_name, header_value in response.headers.items():
                    if header_name.lower() not in ['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers']:
                        self.send_header(header_name, header_value)
                
                self.end_headers()
                
                # Send response body
                self.wfile.write(response_data)
                
        except Exception as e:
            print(f"Error proxying request: {e}")
            self.send_error(500, f"Proxy error: {str(e)}")

    def serve_static_file(self):
        """Serve static files from the current directory"""
        import os
        import mimetypes
        
        # Map root to index.html
        if self.path == '/':
            file_path = 'index.html'
        else:
            file_path = self.path[1:]  # Remove leading '/'
        
        # Security check - prevent directory traversal
        if '..' in file_path or file_path.startswith('/'):
            self.send_error(403, "Forbidden")
            return
        
        try:
            if os.path.exists(file_path) and os.path.isfile(file_path):
                # Get MIME type
                mime_type, _ = mimetypes.guess_type(file_path)
                if mime_type is None:
                    mime_type = 'application/octet-stream'
                
                # Read and serve the file
                with open(file_path, 'rb') as f:
                    content = f.read()
                
                self.send_response(200)
                self.send_header('Content-Type', mime_type)
                self.send_header('Content-Length', str(len(content)))
                # Add cache-busting headers for development
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, "File not found")
        except Exception as e:
            print(f"Error serving file {file_path}: {e}")
            self.send_error(500, "Internal server error")

    def log_message(self, format, *args):
        # Suppress default logging
        pass

def run_proxy_server(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, CORSProxyHandler)
    print(f"🚀 CORS Proxy Server running on http://localhost:{port}")
    print(f"📡 Proxying requests to: https://blood-diagnostic-bot-7b4wpufaoq-el.a.run.app")
    print(f"🔗 Usage: http://localhost:{port}/proxy/api/v1/health/")
    print("Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run_proxy_server(port)
