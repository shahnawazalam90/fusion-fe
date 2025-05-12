import { useEffect, useState } from 'react';

function TestStream({ reportId }) {
  const [status, setStatus] = useState('disconnected');
  const [output, setOutput] = useState([]);
  const [error, setError] = useState(null);
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000;

    const connectSSE = () => {
      if (eventSource) {
        eventSource.close();
      }

      const newEventSource = new EventSource(`/api/v1/reports/${reportId}/stream`);

      newEventSource.onopen = () => {
        if (isMounted) {
          setStatus('connecting');
          retryCount = 0;
        }
      };

      newEventSource.addEventListener('connected', (event) => {
        if (isMounted) {
          setStatus('connected');
          const data = JSON.parse(event.data);
          setOutput(prev => [...prev, data.message]);
        }
      });

      newEventSource.addEventListener('status', (event) => {
        if (isMounted) {
          const data = JSON.parse(event.data);
          setStatus(data.status);
          if (data.status === 'failed') {
            setError('Test execution failed');
          }
        }
      });

      newEventSource.addEventListener('output', (event) => {
        if (isMounted) {
          const data = JSON.parse(event.data);
          setOutput(prev => [...prev, data.output]);
        }
      });

      newEventSource.addEventListener('error', (event) => {
        if (isMounted) {
          const data = JSON.parse(event.data);
          setError(data.error);
        }
      });

      newEventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        if (isMounted) {
          setStatus('disconnected');
          setError('Connection lost. Reconnecting...');
          
          // Attempt to reconnect with exponential backoff
          if (retryCount < maxRetries) {
            setTimeout(() => {
              retryCount++;
              connectSSE();
            }, retryDelay * Math.pow(2, retryCount));
          } else {
            setError('Failed to connect after multiple attempts');
          }
        }
      };

      setEventSource(newEventSource);
    };

    connectSSE();

    return () => {
      isMounted = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [reportId]);

  return (
    <div className="test-stream">
      <div className="status">
        Status: {status}
      </div>
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      <div className="output">
        {output.map((line, index) => (
          <div key={index} className="output-line">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestStream;