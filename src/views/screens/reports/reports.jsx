import React, { useState, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';

import DefaultLayout from 'src/views/layouts/default';

import './reports.scss';

const Report = () => {
  const [reportURL, setReportURL] = useState(null);

  useEffect(() => {
    if (reportURL) {
      var iframe = document.getElementById('reportiframe');
      iframe.src = reportURL;
    }
  }, [reportURL]);

  return (
    <>
      <DefaultLayout>
        <div className='reports-container position-relative d-flex flex-column gap-4'>
          <p className='reports-heading m-0'>User Reports</p>
          <div className='reports-table-container'>
            <table className='reports-table table table-bordered'>
              <thead>
                <tr>
                  <th>S. No</th>
                  <th>Scenarios</th>
                  <th>Status</th>
                  <th>Executed At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Scenario 1</td>
                  <td>In Progress</td>
                  <td>2023-10-01 10:00 AM</td>
                  <td>
                    <i className="bi bi-arrow-clockwise"></i>
                  </td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>
                    <ul>
                      <li>Scenario 1</li>
                      <li>Scenario 2</li>
                    </ul>
                  </td>
                  <td>Complete</td>
                  <td>2023-10-01 10:00 AM</td>
                  <td>
                    <i className="bi bi-eye-fill text-primary" onClick={() => setReportURL('https://www.google.com/')} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </DefaultLayout>
      <Modal size='xl' centered show={!!reportURL} onHide={() => setReportURL(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Report for Scenario 1, Scenario 2</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <iframe
            id='reportiframe'
            src={reportURL}
            title="Report"
            className="report-iframe"
            width={"100%"}
            height={"100%"}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Report;
