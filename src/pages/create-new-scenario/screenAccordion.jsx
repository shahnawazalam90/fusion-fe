
import React, { useMemo } from "react";

import { toTitleCase } from "../../utils";

export default function ScreenAccordion({ screen, screenNameID, screenValues, actionsChecked, toggleAction, toggleScreenActions, onChange }) {
  const allActionsSelected = useMemo(() => {
    return actionsChecked.find((actionChecked) =>  !actionChecked) === undefined;
  }, [actionsChecked]);

  const getFieldName = (locator) => {
    if (locator.includes("]")) {
      const startIndex = locator.lastIndexOf("=") + 1;
      const endIndex = locator.lastIndexOf("]");
      const fieldName = locator.substring(startIndex, endIndex);
      return fieldName;
    }

    return locator;
  };

  return (
    <div className="accordion mb-3" id={`${screenNameID}parent`}>
      <div className="accordion-item">
        <h2 className="accordion-header d-flex align-items-center">
          <button
            className="accordion-button d-flex justify-content-between align-items-center"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#${screenNameID}accordion`}
            aria-expanded="true"
            aria-controls={`${screenNameID}accordion`}
          >
            <div className="d-flex align-items-center">
              <span className="me-2">
                <img src="../../../src/assets/DownArrow.png" alt="arrow" />
              </span>
              <span className="accordion-name">{toTitleCase(screen.screenName)}</span>
            </div>
          </button>
          <input type="checkbox" className="form-check-input m-0 ms-1 me-3" checked={allActionsSelected} onChange={toggleScreenActions} />
        </h2>
        <div
          id={`${screenNameID}accordion`}
          className="accordion-collapse collapse"
          data-bs-parent={`#${screenNameID}parent`}
        >
          <div className="accordion-body">
            <table className="table">
              <thead>
                <tr>
                  <th><input type="checkbox" checked={allActionsSelected} onChange={toggleScreenActions} /></th>
                  <th className="table-heading">Field Name</th>
                  <th className="table-heading">Value</th>
                </tr>
              </thead>
              <tbody>
                {screen.actions.map(({ locator }, i) =>
                  <tr key={locator + i}>
                    <th scope="row"><input type="checkbox" checked={actionsChecked[i] || false} onChange={() => toggleAction(i)} /></th>
                    <td className="table-content">{getFieldName(locator)}</td>
                    <td>
                      <input type="text" placeholder="Enter text" className="form-control-table" value={screenValues?.[i] || ''} onChange={({ target: { value } }) => onChange(i, value)} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
