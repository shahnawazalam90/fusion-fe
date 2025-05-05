import { toTitleCase } from "src/utils.js";

import './screenAccordion.scss';
import classNames from "classnames";

export default function ScreenAccordion({
  screen,
  screenNameID,
  screenSelected,
  toggleScreenSelection,
  editEnabled,
  onChange
}) {
  return (
    <div className="accordion" id={`${screenNameID}parent`}>
      <div className="accordion-item">
        <h2 className="accordion-header d-flex align-items-center">
          <button
            className="accordion-button bg-transparent d-flex justify-content-between align-items-center"
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
          {!editEnabled && (
            <input type="checkbox" className="form-check-input m-0 ms-1 me-3" checked={screenSelected} onChange={toggleScreenSelection} />
          )}
        </h2>
        <div
          id={`${screenNameID}accordion`}
          className={classNames("accordion-collapse collapse p-0", {'show': editEnabled})}
          data-bs-parent={`#${screenNameID}parent`}
        >
          <div className="accordion-body border-0 py-2">
            <table className="table m-0">
              <thead>
                <tr>
                  <th className="table-heading">Field Name</th>
                  <th className="table-heading">Value</th>
                </tr>
              </thead>
              <tbody>
                {screen.actions.map(({ raw, options, value }, i) =>
                  <tr key={screenNameID + raw + i}>
                    <td className="table-content">{options?.name}</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Enter text"
                        className="form-control-table w-100"
                        value={editEnabled ? value : ''}
                        disabled={!editEnabled}
                        onChange={({ target: { value } }) => editEnabled ? onChange(i, value) : null}
                      />
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
