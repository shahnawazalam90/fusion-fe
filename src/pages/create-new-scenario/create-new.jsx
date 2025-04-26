import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import store from '../../store';
import { setCurrentScenarioValue } from '../../store/actions';

import ScreenAccordion from "./screenAccordion";

import "./create-new.css";
import { toTitleCase } from "../../utils";
import { postScenario } from "../../http";

function Create() {
  const navigate = useNavigate();
  const currentScenario = useSelector((state) => state.currentScenario);

  const [actionsChecked, setActionsChecked] = useState([]);
  const [scenarioName, setScenarioName] = useState('');
  const [error, setError] = useState('');
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    const updatedChecked = currentScenario.map(({ actions }) => actions.map(() => false));
    setActionsChecked(updatedChecked);
  }, []);

  const { screensSelected, allActionsSelected } = useMemo(() => {
    const screensSelected = actionsChecked.map((screenChecked) => screenChecked.find((actionChecked) => !actionChecked) === undefined);
    const allActionsSelected = screensSelected.find((screenChecked) => !screenChecked) === undefined;

    return { screensSelected, allActionsSelected };
  }, [actionsChecked]);

  const checkAllActions = () => {
    const updatedChecked = actionsChecked.map((screenActions) => screenActions.map(() => !allActionsSelected));
    setActionsChecked(updatedChecked);
  };

  const checkScreenActions = (parentIndex) => {
    const updatedChecked = [...actionsChecked];
    updatedChecked[parentIndex] = updatedChecked[parentIndex].map(() => !allActionsSelected);
    setActionsChecked(updatedChecked);
  };

  const checkAction = (parentIndex, childIndex) => {
    const updatedChecked = [...actionsChecked];
    updatedChecked[parentIndex] = [...updatedChecked[parentIndex]];

    updatedChecked[parentIndex][childIndex] = !updatedChecked[parentIndex][childIndex];

    setActionsChecked(updatedChecked);
  };

  const handleChange = (parentIndex, childIndex, value) => {
    store.dispatch(setCurrentScenarioValue(parentIndex, childIndex, value));
  };

  const handleSubmit = () => {
    if (!scenarioName) {
      setError('Scenario name is required.');
      return;
    }
    if (!screensSelected.find((screenChecked) => screenChecked)) {
      setError('At least one screen is required.');
      return;
    }
    setError('');

    postScenario(scenarioName, JSON.stringify(currentScenario.filter((_, i) => screensSelected[i])))
      .then((res) => {
        if (res.status === 'success') {
          document.getElementById("createModalCloseBtn").click();
          setFileContent(res.data.jsonMetaData);
          document.getElementById("downloadModalLaunchBtn").click();
        } else {
          setError('Failed to create scenario. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error creating scenario:', error);
        setError('Failed to create scenario. Please try again.');
      });
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(JSON.parse(fileContent), null, 4)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scenarioName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Maybe not necessary, but just in case
    document.getElementById("downloadModalCloseBtn").click();

    navigate('/dashboard');
  };

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

      {/* Dashboard */}
      <div className="dashboard-section d-flex gap-5">
        {/* <!----sidebar---> */}
        <div className="sidebar-section">
          <img src="../../../src/assets/Home.png" alt="Home" className="sidebar-icon" onClick={() => navigate('/dashboard')} />
        </div>

        <div className="scenario-section w-100">
          <h5 className="scenario-heading mb-4">Create New Scenario</h5>

          {/* Select All & Search */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <label className="form-label-checkbox mb-0 me-2">Select All</label>
              <input type="checkbox" className="form-check-input mt-0" checked={allActionsSelected} onChange={() => checkAllActions()} />
            </div>
            <div className="position-relative">
              <input type="text" className="form-control" placeholder="Search" />
              <img
                src="../../../src/assets/search.png"
                alt="search-icon"
                className="search-icon position-absolute"
              />
            </div>
          </div>

          {/* Accordion */}
          <div className="flex-grow-1 overflow-auto">
            {currentScenario.map((screen, i) => {
              const screenNameID = screen.screenName.replace(/\s+/g, '') + i;
              return (
                <ScreenAccordion
                  key={screen.screenName + screen.actions.length}
                  screen={screen}
                  screenNameID={screenNameID}
                  actionsChecked={actionsChecked[i] || [false]}
                  screenSelected={screensSelected[i] || false}
                  toggleAction={(j) => checkAction(i, j)}
                  toggleScreenActions={() => checkScreenActions(i)}
                  onChange={(j, value) => handleChange(i, j, value)}
                />
              )
            })}
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-secondary me-3" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Create</button>
            <button id='downloadModalLaunchBtn' className="d-none" data-bs-toggle="modal" data-bs-target="#downloadModal">Download</button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <div className="modal fade" id="createModal" tabIndex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Create Scenario</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <label htmlFor="scenario" className="form-label mb-2">
                Scenario Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control mb-3"
                id="scenario"
                placeholder="Enter Text"
                value={scenarioName}
                onChange={({ target: { value } }) => setScenarioName(value)}
              />

              <label htmlFor="screens" className="form-label mb-2">
                Selected Screens <span className="text-danger">*</span>
              </label>
              <div className="row">
                <div className="col-md-12">
                  <div className="selected-screen-create d-flex flex-column gap-2 position-relative">
                    {currentScenario.map((screen, i) => {
                      const screenNameID = screen.screenName.replace(/\s+/g, '') + i;
                      return (
                        <div key={screenNameID} className="d-flex align-items-center">
                          <input type="checkbox" className="form-check-input me-2 mt-0" id={`${screenNameID}checkbox`} checked={screensSelected[i] || false} onChange={() => checkScreenActions(i)} />
                          <label htmlFor={`${screenNameID}checkbox`} className="mb-0 form-label">{toTitleCase(screen.screenName)}</label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              {error && <p className="text-danger mt-1">{error}</p>}
            </div>

            <div className="modal-footer">
              <button id="createModalCloseBtn" type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setError('')}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Download Modal */}
      <div className="modal fade" id="downloadModal" tabIndex="-1" aria-labelledby="downloadModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Download</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <label htmlFor="scenario" className="form-label">
                The JSON File is created and is ready to download
              </label>
            </div>

            <div className="modal-footer">
              <button id="downloadModalCloseBtn" type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setError('')}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleDownload}>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;



