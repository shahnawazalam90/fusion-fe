import React from "react";
import "./confirmation.css";
function Confirmation() {
    return (
        <>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Launch demo modal</button>
        
        <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title" id="exampleModalLabel">
                        Confirmation
                    </h1>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>

                <div className="modal-body">
                    <label htmlFor="scenario" className="form-label mb-2">
                        Choose the action you want to continue with?
                    </label>
                    <div className="selected-radio">
                        <div className="d-flex align-items-center mb-2">
                            <input
                                className="me-2"
                                type="radio"
                                name="actionOption"
                                id="option1"
                                value="option1"
                            />
                            <label className="form-check-label" htmlFor="option1">
                                Execute with the given inputs
                            </label>
                        </div>

                        <div className="d-flex align-items-center mb-2">
                            <input
                                className=" me-2"
                                type="radio"
                                name="actionOption"
                                id="option1"
                                value="option1"
                            />
                            <label className="form-check-label" htmlFor="option1">
                                Upload a data file for execution
                            </label>
                        </div>
                    </div>

                    <div className="upload-section mb-2">
                        <img
                        src="../../../src/assets/Vector.png"
                        alt="vector-icon"
                        className="mb-3"
                        />
                        <p className="upload-text mb-2">Drag and drop files here</p>
                        <p className="upload-text mb-2">or</p>

                        <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        >
                        Browse files
                        </button>
                    </div>

                    <div className="d-flex justify-content-between mb-4">
                        <p className="upload-text">
                        Supported Formats: PDF, JPG, JPEG, DOC
                        </p>
                        <p className="upload-text">Maximum file size: 80MB</p>
                    </div>

                    <div className="upload-pdf d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                        <img
                            src="../../../src/assets/pdf-format.png"
                            alt="pdf-format"
                            className="pdf-format me-2"
                        />

                        <div className="pdf-text">
                            <p className="mb-0 pdf-text-name">Filename.pdf</p>
                            <p className="mb-0 pdf-size">20MB</p>
                        </div>
                        </div>

                        <img
                        src="../../../src/assets/delete.png"
                        alt="delete-icon"
                        className="delete-icon"
                        />
                    </div>
                </div>

                <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Cancel
                </button>
                <button type="button" className="btn btn-primary">
                    Execute
                </button>
                </div>
            </div>
        </div>
    </div>
    </>
    );
}

export default Confirmation;
