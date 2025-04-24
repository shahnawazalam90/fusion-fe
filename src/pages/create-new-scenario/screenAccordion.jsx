
import React from "react";

import { toTitleCase } from "../../utils";

export default function ScreenAccordion({ screen }) {
  const screenNameID = screen.screenName.replace(/\s+/g, '');

  return (
    <div className="accordion mb-3" id={`${screenNameID}parent`}>
      <div className="accordion-item">
        <h2 className="accordion-header d-flex align-items-center">
          <button
            className="accordion-button d-flex justify-content-between align-items-center"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#${screenNameID}`}
            aria-expanded="true"
            aria-controls={screenNameID}
          >
            <div className="d-flex align-items-center">
              <span className="me-2">
                <img src="../../../src/assets/DownArrow.png" alt="arrow" />
              </span>
              <span className="accordion-name">{toTitleCase(screen.screenName)}</span>
            </div>
          </button>
          <input type="checkbox" className="form-check-input m-0 me-3" />
        </h2>
        <div
          id={screenNameID}
          className="accordion-collapse collapse"
          data-bs-parent={`#${screenNameID}parent`}
        >
          <div className="accordion-body">
            <table className="table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th className="table-heading">Field Name</th>
                  <th className="table-heading">Value</th>
                </tr>
              </thead>
              <tbody>
                {screen.actions.map(({ locator }) => (
                  <tr key={locator}>
                    <th scope="row"><input type="checkbox" /></th>
                    <td className="table-content">{locator.match(/@name='([^']+)'/)[1]}</td>
                    <td>
                      <input type="text" placeholder="Enter text" className="form-control-table" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
