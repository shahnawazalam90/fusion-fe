import React from "react";
import "./create-new.css";

function Create() {
    return (
        <div className="main-section">

            {/* <!---navbar----> */}
            <nav className="navbar px-3 py-2 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <img src="../../../src/assets/menu.png" alt="menu" className="hamburger-icon me-2" />
                        </div>
                        
                        <div className="d-flex align-items-center">
                            <img src="../../../src/assets/Style-guide-p18.png" alt="notification" className="notification-icon me-3" />
                            <img src="../../../src/assets/user image only face.png" alt="profile" className="profile-img" />
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
                        <input type="checkbox" className="form-check-input mt-0" />
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
                    <div className="accordion" id="accordionExample">
                        <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                            className="accordion-button d-flex justify-content-between align-items-center"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                            >
                            <div className="d-flex align-items-center">
                                <span className="me-2">
                                <img src="../../../src/assets/DownArrow.png" alt="arrow" />
                                </span>
                                <span className="accordion-name">Screen 1</span>
                            </div>
                            <input type="checkbox" className="form-check-input" />
                            </button>
                        </h2>
                        <div
                            id="collapseOne"
                            className="accordion-collapse collapse"
                            data-bs-parent="#accordionExample"
                        >
                            <div className="accordion-body">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th><input type="checkbox" /></th>
                                    <th className="table-heading">Column 1</th>
                                    <th className="table-heading">Column 2</th>
                                </tr>
                                </thead>
                                <tbody>
                                {[...Array(4)].map((_, index) => (
                                    <tr key={index}>
                                    <th scope="row"><input type="checkbox" /></th>
                                    <td className="table-content">Field Name</td>
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
                                <div className="col-md-4">
                                    <div className="selected-screen-create d-flex align-items-center position-relative">
                                        <input type="checkbox" className="form-check-input me-2 mt-0" id="screen1" />
                                        <label htmlFor="screen1" className="mb-0 form-label">Screen 1</label>

                                        <img
                                        src="../../../src/assets/checked-slected.png"
                                        alt="icon"
                                        className="top-right-img"
                                        />
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



