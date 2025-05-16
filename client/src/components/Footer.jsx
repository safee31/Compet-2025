import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="page-footer" style={{ opacity: 1 }}>
        <div className="footer-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 col-sm-6">
                <p className="mb-0 text-muted">
                  Copyright ©{new Date().getFullYear().toString()}, Shiplyfy. All rights are reserved.
                </p>
              </div>
              <div className="col-sm-6 d-none d-sm-block">
                <ul className="breadcrumb pt-0 pr-0 float-right">
                  <li className="breadcrumb-item mb-0">
                    <Link to={"/"} className="btn-link">
                      Review
                    </Link>
                  </li>
                  <li className="breadcrumb-item mb-0">
                    <Link to={"/"} className="btn-link">
                      Get Start
                    </Link>
                  </li>
                  <li className="breadcrumb-item mb-0">
                    <Link to={"/"} className="btn-link">
                      Docs
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
