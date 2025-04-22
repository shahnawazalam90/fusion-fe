import React from "react";
import { useState } from "react";
import './dashboard.css';
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate("/create"); 
    };

    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const toggleFilter = () => {
        setIsFilterVisible(!isFilterVisible);
    };
    const scenariosData = [
        {
            title: 'Scenario 1',
            screens: '10 screens',
            date: 'April 14, 2025'
        },
        {
            title: 'Scenario 2',
            screens: '8 screens',
            date: 'April 15, 2025'
        },
        {
            title: 'Scenario 3',
            screens: '12 screens',
            date: 'April 16, 2025'
        },
        {
            title: 'Scenario 4',
            screens: '6 screens',
            date: 'April 17, 2025'
        },
        {
            title: 'Scenario 5',
            screens: '9 screens',
            date: 'April 18, 2025'
        },
        {
            title: 'Scenario 6',
            screens: '11 screens',
            date: 'April 19, 2025'
        },
        {
            title: 'Scenario 7',
            screens: '7 screens',
            date: 'April 20, 2025'
        },
        {
            title: 'Scenario 8',
            screens: '13 screens',
            date: 'April 21, 2025'
        }
    ];

    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleSelects = (index) => {
        setSelectedIndex(index);
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
                    <img src="../../../src/assets/user image only face.png" alt="profile" className="profile-img" />
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
                                        <button className="btn btn-primary me-3" onClick={toggleFilter}>
                                            Filter
                                        </button>

                                        <div className="position-relative">
                                            <input type="text" className="form-control" placeholder="Search" />
                                            <img src="../../../src/assets/search.png" alt="search-icon" className="search-icon position-absolute" />
                                        </div>
                                    </div>
                                
                                    <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2"   onClick={handleNavigate}>
                                            <img src="../../../src/assets/add.png" alt="add-icon" />
                                            <span>Create New Scenario</span>
                                    </button>
                            </div>

                            <div className="row">
                            {scenariosData.map((scenario, index) => (
                                <div className={`col-md-${isFilterVisible ? '4' : '3'} mb-3`} key={index}>

                                <div className={`scenario1 position-relative ${selectedIndex === index ? 'selected' : ''}`}
                                onClick={() => handleSelects(index)}>
                                <h5 className="scenario-head">{scenario.title}</h5>
                                <div className="d-flex align-items-center mb-2">
                                    <p className="scenario-text mb-0">{scenario.screens}</p>
                                    <div className="border-center"></div>
                                    <p className="scenario-text mb-0">{scenario.date}</p>
                                </div>
                                <div className="scenario-record"></div>
                                {selectedIndex === index && (
                                    <img
                                    src="../../../src/assets/checked-slected.png"
                                    alt="Selected"
                                    className="top-right-img"
                                    />
                                )}
                                </div>
                            </div>
                            ))}
                            </div>

                            <div className="d-flex justify-content-end mt-5">
                                <button className="btn btn-secondary me-3">Save</button>
                                <button className="btn btn-primary me-3">Run</button>
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
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Filters</h1>
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
                                    <hr/>

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
                            <hr/>
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
                                    <input type="date" placeholder="MM/DD/YYYY" class="form-control mb-2"/>
                            </div>
                            <div className="mb-3">
                            <label htmlFor="todate" className="form-label mb-2">
                                    To Date
                                    </label>
                                    <input type="date" placeholder="MM/DD/YYYY" class="form-control"/>
                            </div>
                                    


                            
                       
                        </div>

                            </div>
                           
                        </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
               
        );
}

export default Dashboard;
