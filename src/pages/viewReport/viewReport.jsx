import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import "./viewReport.css";

function ViewReport() {
  const navigate = useNavigate();
  const currentReport = useSelector((state) => state.currentReport);

  useEffect(() => {
    var iframe = document.getElementById('reportiframe');
    iframe.src = currentReport.reportURL;
  }, [currentReport.reportURL]);

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
          <h5 className="scenario-heading mb-4">{currentReport.scenarioName}</h5>

          <iframe
            id='reportiframe'
            src={currentReport.reportURL}
            title="Report"
            className="report-iframe"
            width={"100%"}
            height={"100%"}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewReport;



