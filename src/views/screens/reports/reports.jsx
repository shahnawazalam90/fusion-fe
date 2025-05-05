import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';

import { notify } from 'src/notify';
import { toTitleCase } from 'src/utils';
import { getReports } from 'src/http/requests';

import DefaultLayout from 'src/views/layouts/default';

import './reports.scss';

const Report = () => {
  const userReports = useSelector((state) => state.userReports);

  const [reportURL, setReportURL] = useState(null);

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    if (reportURL) {
      var iframe = document.getElementById('reportiframe');
      iframe.src = reportURL;
    }
  }, [reportURL]);

  const refreshReports = () => {
    notify.success('Reports have been refreshed');
    getReports();
  };

  return (
    <>
      <DefaultLayout>
        <div className='reports-container position-relative d-flex flex-column gap-4'>
          <p className='reports-heading m-0'>User Reports</p>
          {userReports.length === 0 ? (
            <div className='no-reports-container flex-grow-1 d-flex align-items-center justify-content-center'>
              <p className='no-reports-text'>No reports available</p>
            </div>
          ) : (
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
                  {
                    userReports.map((report, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{report.scenarioIds.join()}</td>
                        <td>{toTitleCase(report.status)}</td>
                        <td>{new Date(report.executedAt).toLocaleString()}</td>
                        <td>
                          {report.status !== 'completed' ? (
                            <i className="bi bi-arrow-clockwise" onClick={refreshReports}></i>
                          ) : (
                            <i className="bi bi-eye-fill text-primary" onClick={() => setReportURL(report.filePath)} />
                          )}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div >
      </DefaultLayout >
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
