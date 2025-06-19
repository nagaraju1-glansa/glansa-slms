import React, { Component } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
// import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from 'react-i18next';

import { connect } from "react-redux";
import {
  changeLayout,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changePreloader
} from "../../store/actions";
import withRouter from "../Common/withRouter";

class SidebarContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pathName: this.props.router.location.pathname,
    };

    console.log(this.props);
  }
  

  componentDidMount() {
    this.initMenu();
  }

  UNSAFE_componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {

        if (this.props.type !== prevProps.type) {
            this.initMenu();
        }

    }
    if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
      this.setState({ pathName: this.props.router.location.pathname }, () => {
        this.initMenu();
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  initMenu() {
    new MetisMenu("#side-menu");
    const { pathName } = this.state;


    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    const { t } = this.props;
    const roleId = localStorage.getItem('RoleId');
    const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    return (
      <React.Fragment>
        <div id="sidebar-menu">

          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{t('Menu')}</li>

            <li>
              <Link id="menu-dashboard" to="/dashboard" className="waves-effect">
                <i className="ri-dashboard-line"></i>
                <span className="ms-1">{t('Dashboard')}</span>
              </Link>
            </li>
             {roleId == 'Member' && (
              <>
                <li className="menu-title">{t('Receipts')}</li>

                <li>
                    <Link  id="menu-receipts" to="/#" className="has-arrow waves-effect">
                      <i className=" fas fa-hand-holding-usd"></i>
                      <span className="ms-1">{t('Receipts')}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li><Link to="/savingreceipts">{t('Saving Receipt')}</Link></li>
                      <li><Link to="/loanreceipts">{t('Loan Receipt')}</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link  id="menu-receipts" to="/#" className="has-arrow waves-effect">
                      <i className=" fas fa-hand-holding-usd"></i>
                      <span className="ms-1">{t('Payment')}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li><Link to="/savingspayment">{t('To Saving')}</Link></li>
                      <li><Link to="/loanpayment">{t('To Loan')}</Link></li>
                    </ul>
                  </li>

                   <li>
                      <Link id="menu-loans" to="/#" className="has-arrow waves-effect">
                        <i className="fas fa-money-bill-wave"></i>
                        <span className="ms-1">{t('Loan')}</span>
                      </Link>
                      <ul className="sub-menu">
                        <li><Link to="/loans">{t('Loan List')}</Link></li>
                        {/* <li><Link to="/loanadd">{t('Request Loan')}</Link></li> */}

                      </ul>
                    </li>
              </>
            )}
            {roleId == 1 && (
              <>
              <li>
                <Link id="menu-reports"  to="/roles" className="waves-effect">
                  <i className="fas fa-user"></i>
                  <span className="ms-1">{t('Role')}</span>
                </Link>
              </li>
              <li>
                <Link id="menu-reports"  to="/company" className="waves-effect">
                  <i className="fas fa-building"></i>
                  <span className="ms-1">{t('Company')}</span>
                </Link>
              </li>
              <li>
                <Link id="menu-members" to="/#" className="has-arrow waves-effect">
                  <i className="fas fa-users"></i>
                  <span className="ms-1">{t('Employees')}</span>
                </Link>
                <ul className="sub-menu">
                  <li><Link to="/employees">{t('Employee List')}</Link></li>
                  <li><Link to="/employeeadd">{t('Employee Add')}</Link></li>
                </ul>
              </li>
            </>
            )}
            

           {(roleId == 1 || roleId == 2 || roleId == 3) && (
              <>
              {(storedPermissions.includes("member-list") ||
              storedPermissions.includes("member-add")
              ) && (
            <li>
              <Link id="menu-members" to="/#" className="has-arrow waves-effect">
                <i className="fas fa-users"></i>
                <span className="ms-1">{t('Members')}</span>
              </Link>
              <ul className="sub-menu">
                {(storedPermissions.includes("member-list") ) && (
                  <li><Link to="/members">{t('Members List')}</Link></li>
                )}
                {(storedPermissions.includes("member-add") ) && (
                  <li><Link to="/membersadd">{t('Members Add')}</Link></li>
                )}
                {(storedPermissions.includes("member-withdrawal") ) && (
                  <li><Link to="/withdrawals">{t('Members Withdrawal')}</Link></li>
                )}
              </ul>
            </li>
            )}

            {(storedPermissions.includes("saving-receipt-list") ||
              storedPermissions.includes("loan-receipt-list") ||
              storedPermissions.includes("receipt-add") 
              ) && (
                <>
                  <li className="menu-title">{t('Receipts')}</li>

                <li>
                    <Link  id="menu-receipts" to="/#" className="has-arrow waves-effect">
                      <i className=" fas fa-hand-holding-usd"></i>
                      <span className="ms-1">{t('Receipts')}</span>
                    </Link>
                    <ul className="sub-menu">
                      {(storedPermissions.includes("saving-receipt-list") ) && (
                        <li><Link to="/savingreceipts">{t('Saving Receipt')}</Link></li>
                      )}
                      {(storedPermissions.includes("loan-receipt-list") ) && (
                        <li><Link to="/loanreceipts">{t('Loan Receipt')}</Link></li>
                      )}
                      {(storedPermissions.includes("receipt-add") ) && (
                        <li><Link to="/receiptsadd">{t('Receipt Add')}</Link></li>
                      )}
                    </ul>
                  </li>
                  </>
             )}
             
              {(storedPermissions.includes("payment-add") ||
              storedPermissions.includes("payment-list")
              ) && (
              <>
                <li className="menu-title">{t('Payments')}</li>

                <li>
                  <Link  id="menu-payments" to="/#" className="has-arrow waves-effect">
                    <i className="fas fa-money-bill-wave"></i>
                    <span className="ms-1">{t('Payments')}</span>
                  </Link>
                  <ul className="sub-menu">
                    {(storedPermissions.includes("payment-list") ) && (
                      <li><Link to="/payments">{t('Payments List')}</Link></li>
                    )}
                    {(storedPermissions.includes("payment-add") ) && (
                      <li><Link to="/paymentsadd">{t('Payments Add')}</Link></li>
                    )}

                  </ul>
                </li>
                </>
            )}

            {(storedPermissions.includes("loan-add") ||
              storedPermissions.includes("loan-list")
              ) && (
              <>
                <li className="menu-title">{t('Loan')}</li>
                <li>
                  <Link id="menu-loans" to="/#" className="has-arrow waves-effect">
                    <i className="fas fa-landmark"></i>
                    <span className="ms-1">{t('Loan')}</span>
                  </Link>
                  <ul className="sub-menu">
                    {(storedPermissions.includes("loan-add") ) && (
                      <li><Link to="/loans">{t('Loan List')}</Link></li>
                    )}
                    {(storedPermissions.includes("loan-add") ) && (
                      <li><Link to="/loanadd">{t('Loan Add')}</Link></li>
                    )}
                  </ul>
                </li>
                </>
              )}

              {(storedPermissions.includes("reports")
              ) && (
              <li>
                <Link id="menu-reports"  to="/reports" className="waves-effect">
                  <i className="ri-dashboard-line"></i>
                  <span className="ms-1">{t('Reports')}</span>
                </Link>
              </li>
              )}

              {(storedPermissions.includes("interest-process")
              ) && (
                <li>
                  <Link id="menu-reports"  to="/interestrun" className="waves-effect">
                    <i className="ri-dashboard-line"></i>
                    <span className="ms-1">{t('Interest On Savings')}</span>
                  </Link>
                </li>
                )}
            </>
            )}
           

          </ul>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  return { ...state.Layout };
};


export default withRouter(connect(mapStatetoProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeLayoutWidth,
  changePreloader
})(withTranslation()(SidebarContent)));
