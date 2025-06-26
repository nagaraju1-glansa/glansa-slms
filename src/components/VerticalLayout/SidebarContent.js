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

    const menuConfig = [
      // Dashboard
      {
        label: t('Dashboard'),
        icon: 'ri-dashboard-line',
        path: '/dashboard',
        roles: ['all'],
      },

      // Roles (Superadmin only)
      {
        label: t('Role'),
        icon: 'fas fa-user',
        path: '/roles',
        roles: [1],
      },

      // Company (Superadmin only)
      {
        label: t('Company'),
        icon: 'fas fa-building',
        path: '/company',
        roles: [1],
      },

      // Employees (Superadmin only)
      {
        label: t('Employees'),
        icon: 'fas fa-users',
        roles: [1],
        subMenu: [
          { label: t('Employee List'), path: '/employees' },
          { label: t('Employee Add'), path: '/employeeadd' },
        ],
      },

      // Members (permission-based)
      {
        label: t('Members'),
        icon: 'fas fa-users',
        permissions: ['member-list', 'member-add', 'member-withdrawal'],
        subMenu: [
          { label: t('Members List'), path: '/members', permission: 'member-list' },
          { label: t('Members Add'), path: '/membersadd', permission: 'member-add' },
          { label: t('Members Withdrawal'), path: '/withdrawals', permission: 'member-withdrawal' },
        ],
      },

      // Receipts (Member or permission-based)
      {
        label: t('Receipts'),
        icon: 'fas fa-hand-holding-usd',
        roles: ['Member'],
        permissions: ['saving-receipt-list', 'loan-receipt-list', 'receipt-add'],
        subMenu: [
          { label: t('Saving Receipt'), path: '/savingreceipts', permission: 'saving-receipt-list' },
          { label: t('Loan Receipt'), path: '/loanreceipts', permission: 'loan-receipt-list' },
          { label: t('Receipt Add'), path: '/receiptsadd', permission: 'receipt-add' },
        ],
      },

      // Payment (Member role or permission)
      // {
      //   label: t('Payment'),
      //   icon: 'fas fa-hand-holding-usd',
      //   roles: ['Member'],
      //   permissions: ['payment-add', 'payment-list'],
      //   subMenu: [
      //     { label: t('To Saving'), path: '/savingspayment', permission: 'payment-add' },
      //     { label: t('To Loan'), path: '/loanpayment', permission: 'payment-add' },
      //   ],
      // },

      // Loan (Member or permission)
      {
        label: t('Loan'),
        icon: 'fas fa-money-bill-wave',
        roles: ['Member'],
        permissions: ['loan-add', 'loan-list'],
        subMenu: [
          { label: t('Loan List'), path: '/loans', permission: 'loan-list' },
          { label: t('Loan Add'), path: '/loanadd', permission: 'loan-add' },
        ],
      },

      // Payments (non-member with permission)
      {
        label: t('Payments'),
        icon: 'fas fa-money-bill-wave',
        permissions: ['payment-add', 'payment-list'],
        subMenu: [
          { label: t('Payments List'), path: '/payments', permission: 'payment-list' },
          { label: t('Payments Add'), path: '/paymentsadd', permission: 'payment-add' },
        ],
      },

      // Reports
      {
        label: t('Reports'),
        icon: 'ri-dashboard-line',
        path: '/reports',
        permissions: ['reports'],
      },

      // Interest on Savings
      {
        label: t('Interest On Savings'),
        icon: 'ri-dashboard-line',
        path: '/interestrun',
        permissions: ['interest-process'],
      },
    ];



    return (
      <React.Fragment>
        <div id="sidebar-menu">

          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{t('Menu')}</li>

            {/* <li>
              <Link id="menu-dashboard" to="/dashboard" className="waves-effect">
                <i className="ri-dashboard-line"></i>
                <span className="ms-1">{t('Dashboard')}</span>
              </Link>
            </li> */}

            
  {menuConfig.map((item, index) => {
    const numericRoleId = Number(roleId); // ensures you're comparing numbers
    const hasRole = item.roles?.includes('all') || item.roles?.includes(numericRoleId);
    const hasPermission = item.permissions?.some(p => storedPermissions.includes(p));
    
    // show if role matches or permission matches
    if ((hasRole || hasPermission) && roleId != 'Member' && roleId != '0' ) {
      return (
        <li key={index}>
          {item.subMenu ? (
            <>
              <Link to="#" className="has-arrow waves-effect">
                <i className={item.icon}></i>
                <span className="ms-1">{item.label}</span>
              </Link>
              <ul className="sub-menu">
                {item.subMenu.map((sub, subIndex) => {
                  const canShow =
                    !sub.permission || storedPermissions.includes(sub.permission);
                  return canShow ? (
                    <li key={subIndex}>
                      <Link to={sub.path}>{sub.label}</Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </>
          ) : (
            <Link to={item.path} className="waves-effect">
              <i className={item.icon}></i>
              <span className="ms-1">{item.label}</span>
            </Link>
          )}
        </li>
      );
    }

    return null;
  })}

             {roleId == 'Member' && (
              <>
              <li>
                  <Link id="menu-reports" to="/dashboard" className="waves-effect">
                    <i className="fas fa-user"></i>
                    <span className="ms-1">{t('Dashboard')}</span>
                  </Link>
                </li>
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

            {roleId == '0' && (
              <>
               <li>
                  <Link id="menu-reports" to="/dashboard" className="waves-effect">
                    <i className="fas fa-user"></i>
                    <span className="ms-1">{t('Dashboard')}</span>
                  </Link>
                </li>
                <li>
                    <Link id="menu-members" to="/#" className="has-arrow waves-effect">
                      <i className="fas fa-building"></i>
                      <span className="ms-1">{t('Main Companys')}</span>
                    </Link>
                    <ul className="sub-menu">
                      <li><Link to="/glansa-main-companies">{t('Company List')}</Link></li>
                      <li><Link to="/add-main-company">{t('Company Add')}</Link></li>
                    </ul>
                  </li>
                <li>
                  <Link id="menu-reports" to="/company-payments" className="waves-effect">
                    <i className="fas fa-money-bill"></i>
                    <span className="ms-1">{t('Company Payments')}</span>
                  </Link>
                </li>
              </>
            )}
            {/* {roleId == 1 ? (
      <>
        <li>
          <Link id="menu-reports" to="/roles" className="waves-effect">
            <i className="fas fa-user"></i>
            <span className="ms-1">{t('Role')}</span>
          </Link>
        </li>
        <li>
          <Link id="menu-reports" to="/company" className="waves-effect">
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
    ) : (
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
    )} */}
            

           {/* {(roleId == 1 || roleId == 2 || roleId == 3) && (
             
            )}
            */}

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
