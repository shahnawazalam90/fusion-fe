import React from 'react';
import TestStream from './video';
import { useParams } from 'react-router-dom';
function ReportView() {
  const { reportId } = useParams();
  return (
    <div>
      <h1>Report Execution</h1>
      <TestStream reportId={reportId} />
    </div>
  );
}

export default ReportView;