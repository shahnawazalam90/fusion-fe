export const reportStreamHTML = (reportId, apiUrl) => (`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Test Stream - Report ${reportId}</title>
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: Arial, sans-serif;
            background: #f8f9fa;
          }
          .test-stream { 
            max-width: 800px; 
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .status { 
            margin-bottom: 10px;
            padding: 10px;
            background: #e9ecef;
            border-radius: 4px;
          }
          .error { 
            color: #dc3545;
            margin: 10px 0;
            padding: 10px;
            background: #f8d7da;
            border-radius: 4px;
          }
          .output { 
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            max-height: 500px;
            overflow-y: auto;
            border: 1px solid #dee2e6;
          }
          .output-line { 
            margin: 5px 0;
            padding: 5px;
            border-bottom: 1px solid #dee2e6;
          }
          .output-line:last-child {
            border-bottom: none;
          }
        </style>
      </head>
      <body>
        <div class='test-stream'>
          <div class='status'>Status: connecting...</div>
          <div class='error' style='display: none;'></div>
          <div class='output'></div>
        </div>

        <script>
          (function() {
            const reportId = '${reportId}';
            const apiUrl = '${apiUrl}';
            let retryCount = 0;
            const maxRetries = 3;
            const retryDelay = 2000;
            let eventSource = null;

            function updateStatus(status) {
              document.querySelector('.status').textContent = 'Status: ' + status;
            }

            function showError(message) {
              const errorDiv = document.querySelector('.error');
              errorDiv.textContent = message;
              errorDiv.style.display = 'block';
            }

            function appendOutput(message) {
              const outputDiv = document.querySelector('.output');
              const line = document.createElement('div');
              line.className = 'output-line';
              line.textContent = message;
              outputDiv.appendChild(line);
              outputDiv.scrollTop = outputDiv.scrollHeight;
            }

            function connectSSE() {
              if (eventSource) {
                eventSource.close();
              }

              eventSource = new EventSource(apiUrl + '/api/v1/reports/' + reportId + '/stream');

              eventSource.onopen = () => {
                updateStatus('connecting');
                retryCount = 0;
              };

              eventSource.addEventListener('connected', (event) => {
                updateStatus('connected');
                const data = JSON.parse(event.data);
                appendOutput(data.message);
              });

              eventSource.addEventListener('status', (event) => {
                const data = JSON.parse(event.data);
                updateStatus(data.status);
                if (data.status === 'failed') {
                  showError('Test execution failed');
                }
              });

              eventSource.addEventListener('output', (event) => {
                const data = JSON.parse(event.data);
                appendOutput(data.output);
              });

              eventSource.addEventListener('error', (event) => {
                const data = JSON.parse(event.data);
                showError(data.error);
              });

              eventSource.onerror = (error) => {
                console.error('SSE connection error:', error);
                updateStatus('disconnected');
                showError('Connection lost. Reconnecting...');
                
                if (retryCount < maxRetries) {
                  setTimeout(() => {
                    retryCount++;
                    connectSSE();
                  }, retryDelay * Math.pow(2, retryCount));
                } else {
                  showError('Failed to connect after multiple attempts');
                }
              };
            }

            // Start the connection
            connectSSE();

            // Cleanup when window is closed
            window.onbeforeunload = () => {
              if (eventSource) {
                eventSource.close();
              }
            };
          })();
        </script>
      </body>
    </html>
  `);
