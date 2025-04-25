import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import store from '../../store';
import { setCurrentScenarioValue } from '../../store/actions';

import ScreenAccordion from "./screenAccordion";

import "./create-new.css";
import { toTitleCase } from "../../utils";

function Create() {
  const currentScenario = useSelector((state) => state.currentScenario);
  const currentScenarioValue = useSelector((state) => state.currentScenarioValue);

  const [actionsChecked, setActionsChecked] = useState([]);

  useEffect(() => {
    const updatedChecked = currentScenario.map(({ actions }) => actions.map(() => false));
    setActionsChecked(updatedChecked);
  }, []);

  const allActionsSelected = useMemo(() => {
    return actionsChecked.find((screenChecked) => screenChecked.find((actionChecked) => !actionChecked) !== undefined) === undefined;
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
          <img src="../../../src/assets/Home.png" alt="Home" className="sidebar-icon" />
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
                  screenValues={currentScenarioValue[i]}
                  actionsChecked={actionsChecked[i] || [false]}
                  toggleAction={(j) => checkAction(i, j)}
                  toggleScreenActions={() => checkScreenActions(i)}
                  onChange={(j, value) => handleChange(i, j, value)}
                />
              )
            })}
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-secondary me-3">Cancel</button>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Create</button>
          </div>
        </div>
      </div>

      {/* Modal */}
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
                          <input type="checkbox" className="form-check-input me-2 mt-0" id={`${screenNameID}checkbox`} />
                          <label htmlFor={`${screenNameID}checkbox`} className="mb-0 form-label">{toTitleCase(screen.screenName)}</label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;



