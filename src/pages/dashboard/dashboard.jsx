import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { uploadTS, getUserScenarios, getReports, postReport, viewReport } from "../../http";

import './dashboard.css';
import store from "../../store";
import { setCurrentScenario } from "../../store/actions";

function Dashboard() {
  const navigate = useNavigate();
  const userScenarios = useSelector((state) => state.userScenarios);
  const userReports = useSelector((state) => state.userReports);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedReport, setUploadedReport] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);

  useEffect(() => {
    getUserScenarios();
    getReports();
  }, []);

  const scenarioReport = useMemo(() => {
    if (userReports.length > 0) {
      // Create a map of scenario IDs to their reports
      return userReports.reduce((acc, report) => {
        acc[report.scenarioId] = report;
        return acc;
      }, {});

    }
    return {};
  }, [userReports]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".ts")) {
      setUploadedFile(file);
    } else {
      alert("Only .ts files are allowed.");
    }
  };

  const handleFileSubmit = () => {
    uploadTS(uploadedFile)
      .then((response) => {
        if (response.status === 'success') {
          setUploadedFile(null);
          navigate('/create');
        } else {
          alert("File upload failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again.");
      });
  }

  const handleDuplicateScenario = (scenario) => {
    store.dispatch(setCurrentScenario(
      scenario.jsonMetaData.map((screen) => ({
        ...screen,
        actions: screen.actions.map((action) => ({ ...action, value: '' })),
      }))
    ));
    navigate('/create');
  };

  const handleViewReports = (scenarioName, reportId) => {
    viewReport(scenarioName, reportId);
    navigate('/viewReport');
  };

  const handleReportUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".zip")) {
      setUploadedReport(file);
    } else {
      alert("Only .zip files are allowed.");
    }
  }

  const handleReportSubmit = () => {
    postReport(selectedScenario, uploadedReport)
      .then((response) => {
        if (response.status === 'success') {
          setUploadedReport(null);
          setSelectedScenario(null);
          getUserScenarios();
          getReports();
          document.getElementById("uploadReportModalCloseBtn").click();
        } else {
          alert("Report upload failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error uploading report:", error);
        alert("Error uploading report. Please try again.");
      });
  }

  return (
    <div className="main-section">
      {/* <!---navbar----> */}
      <nav className="navbar px-3 py-2 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src="../../../src/assets/menu.png" alt="menu" className="hamburger-icon me-2" />
        </div>

        <div className="d-flex align-items-center">
          <img src="../../../src/assets/Style-guide-p18.png" alt="notification" className="notification-icon me-3" />
          <img src="../../../src/assets/user_anon.svg" alt="profile" className="profile-img" />
        </div>
      </nav>

      {/* <!----dashboard-section---> */}
      <div className="dashboard-section d-flex gap-5">
        {/* <!----sidebar---> */}
        <div className="sidebar-section">
          <img src="../../../src/assets/Home.png" alt="Home" className="sidebar-icon" />
        </div>

        <div className="scenario-section position-relative">
          <h5 className="scenario-heading mb-4">Scenario Management</h5>

          <div className="row">
            <div className={`col-md-${isFilterVisible ? '9' : '12'}`}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <button className="btn btn-primary me-3" onClick={() => setIsFilterVisible(!isFilterVisible)}>
                    Filter
                  </button>

                  <div className="position-relative">
                    <input type="text" className="form-control" placeholder="Search" />
                    <img src="../../../src/assets/search.png" alt="search-icon" className="search-icon position-absolute" />
                  </div>
                </div>

                <button
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                  data-bs-toggle="modal"
                  data-bs-target="#uploadFileModal"
                >
                  <img src="../../../src/assets/add.png" alt="add-icon" />
                  <span>Create New Scenario</span>
                </button>
              </div>

              <div className="row">
                {userScenarios.map((scenario, index) => (
                  <div className={`col-md-${isFilterVisible ? '4' : '3'} mb-3`} key={index}>

                    <div className='scenario1 position-relative'>
                      <h5 className="scenario-head">{scenario.name}</h5>
                      <div className="d-flex align-items-center mb-2">
                        <p className="scenario-text mb-0">{scenario.jsonMetaData.length} screen(s)</p>
                        <div className="border-center"></div>
                        <p className="scenario-text mb-0">{new Date(scenario.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="scenario-record">
                        <div className="d-flex mt-5">
                          <button className="btn btn-secondary me-3" onClick={() => handleDuplicateScenario(scenario)}>Duplicate</button>
                          {scenarioReport[scenario.id] ? (
                            <button
                              className="btn btn-primary"
                              onClick={() => handleViewReports(scenario.name, scenarioReport[scenario.id].id)}
                            >
                              View Report
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary"
                              onClick={() => setSelectedScenario(scenario.id)}
                              data-bs-toggle="modal"
                              data-bs-target="#uploadReportModal"
                            >
                              Upload Report
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Panel Column */}
            {isFilterVisible && (
              <div className="col-md-3" style={{
                marginTop: '-92px',
                padding: '0px',
                borderLeft: '1px solid #dbcdcd',
              }}>
                <div className="filter-panel">
                  <div className="modal-header mb-2">
                    <h1 className="modal-title fs-5" id="modalTitleLabel">Filters</h1>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setIsFilterVisible(false)}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <label htmlFor="URL" className="form-label mb-2">
                      URL
                    </label>
                    <input
                      type="text"
                      className="form-control mb-3"
                      id="url"
                      placeholder="Enter URL"
                    />
                    <hr />

                    <label htmlFor="browsers" className="form-label mb-2">
                      Browser
                    </label>
                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <input type="radio" id="chrome" name="browser" value="chrome" className="me-2" />
                        <label htmlFor="chrome" className="mb-0">Chrome</label>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <input type="radio" id="firefox" name="browser" value="firefox" className="me-2" />
                        <label htmlFor="firefox" className="mb-0">Firefox</label>
                      </div>

                      <div className="d-flex align-items-center mb-2">
                        <input type="radio" id="safari" name="browser" value="safari" className="me-2" />
                        <label htmlFor="safari" className="mb-0">Safari</label>
                      </div>
                    </div>
                    <hr />
                    <div className="mb-3">
                      <label htmlFor="timeline" className="form-label mb-2">
                        Timeline
                      </label>
                      <select className="form-select">
                        <option>1</option>
                        <option>2</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="fromdate" className="form-label mb-2">
                        From Date
                      </label>
                      <input type="date" placeholder="MM/DD/YYYY" class="form-control mb-2" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="todate" className="form-label mb-2">
                        To Date
                      </label>
                      <input type="date" placeholder="MM/DD/YYYY" class="form-control" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload TS File Modal */}
            <div
              className="modal fade"
              id="uploadFileModal"
              tabIndex="-1"
              aria-labelledby="uploadFileModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title" id="uploadFileModalLabel">
                      Upload TS File
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => setUploadedFile(null)}
                    />
                  </div>

                  <div className="modal-body">
                    {!uploadedFile &&
                      <>
                        <div
                          className="upload-section mb-2"
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file && file.name.endsWith(".ts")) {
                              setUploadedFile(file);
                            } else {
                              alert("Only .ts files are allowed.");
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <img
                            src="../../../src/assets/Vector.png"
                            alt="vector-icon"
                            className="mb-3"
                          />
                          <p className="upload-text mb-2">Drag and drop files here</p>
                          <p className="upload-text mb-2">or</p>
                          <label htmlFor="file-upload" className="btn btn-secondary">
                            Browse files
                          </label>
                          <input
                            type="file"
                            id="file-upload"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                          />
                        </div>

                        <div className="d-flex justify-content-between mb-4">
                          <p className="upload-text">Supported Formats: TS</p>
                          <p className="upload-text">Maximum file size: 80MB</p>
                        </div>
                      </>
                    }

                    {!!uploadedFile &&
                      <div className="upload-pdf d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img
                            src="../../../src/assets/TS.svg"
                            alt="ts-format"
                            className="me-2"
                          />

                          <div className="pdf-text">
                            <p className="mb-0 pdf-text-name">{uploadedFile?.name}</p>
                            <p className="mb-0 pdf-size">
                              {(uploadedFile?.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>

                        <img
                          src="../../../src/assets/delete.png"
                          alt="delete-icon"
                          className="delete-icon"
                          onClick={() => setUploadedFile(null)}
                        />
                      </div>
                    }
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => setUploadedFile(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleFileSubmit}
                      disabled={!uploadedFile}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Report Modal */}
            <div
              className="modal fade"
              id="uploadReportModal"
              tabIndex="-1"
              aria-labelledby="uploadReportModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title" id="uploadReportModal">
                      Upload Report
                    </h1>
                    <button
                      id='uploadReportModalCloseBtn'
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setSelectedScenario(null);
                        setUploadedReport(null);
                      }}
                    />
                  </div>

                  <div className="modal-body">
                    {!uploadedReport &&
                      <>
                        <div
                          className="upload-section mb-2"
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file && file.name.endsWith(".zip")) {
                              setUploadedReport(file);
                            } else {
                              alert("Only .zip files are allowed.");
                            }
                          }}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <img
                            src="../../../src/assets/Vector.png"
                            alt="vector-icon"
                            className="mb-3"
                          />
                          <p className="upload-text mb-2">Drag and drop files here</p>
                          <p className="upload-text mb-2">or</p>
                          <label htmlFor="report-upload" className="btn btn-secondary">
                            Browse files
                          </label>
                          <input
                            type="file"
                            id="report-upload"
                            style={{ display: 'none' }}
                            onChange={handleReportUpload}
                          />
                        </div>

                        <div className="d-flex justify-content-between mb-4">
                          <p className="upload-text">Supported Formats: ZIP</p>
                          <p className="upload-text">Maximum file size: 80MB</p>
                        </div>
                      </>
                    }

                    {!!uploadedReport &&
                      <div className="upload-pdf d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img
                            src="../../../src/assets/Zip.svg"
                            alt="ts-format"
                            className="me-2"
                          />

                          <div className="pdf-text">
                            <p className="mb-0 pdf-text-name">{uploadedReport?.name}</p>
                            <p className="mb-0 pdf-size">
                              {(uploadedReport?.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>

                        <img
                          src="../../../src/assets/delete.png"
                          alt="delete-icon"
                          className="delete-icon"
                          onClick={() => setUploadedReport(null)}
                        />
                      </div>
                    }
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        setSelectedScenario(null);
                        setUploadedReport(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleReportSubmit}
                      disabled={!uploadedReport}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
