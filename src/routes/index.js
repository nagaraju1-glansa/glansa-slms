import React from "react";
import { Navigate } from "react-router-dom";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import Dashboard from "../pages/Dashboard/index";
import Member from "../pages/Member/Members";
import SavingReceiptslist from "../pages/Receipts/SavingReceiptsList";
import LoanReceiptslist from "../pages/Receipts/LoanReceiptslist";
import MembersAdd from "../pages/Member/MembersAdd";
// PaymentsAdd
import PaymentsAdd from "../pages/Payments/PaymentsAdd";
import PaymentsList from "../pages/Payments/PaymentsList";
import LoanList from "../pages/Loan/LoanList";
import LoanListAdd from "../pages/Loan/LoanAdd";
import ReceiptsAdd from "../pages/Receipts/ReceiptsAdd";
import Reports from "../pages/Reports/Reports";
import MembershipWithdrawalForm from "../pages/withdrawal/MembershipWithdrawalForm";
import Withdrawals from "../pages/withdrawal/Withdrawals";
// LoanInstallmentsList
import LoanInstallmentsList from "../pages/Loan/LoanInstallmentsList";
import InterestRun from "../pages/InterestRun/InterestRun";
import Profile from "../pages/Profile/Profile";
import Company from "../pages/Company/Company";
import Memberview from "../pages/Member/MemberView";
import EmployeeAdd from "../pages/Employee/EmployeeAdd";
import Employees from "../pages/Employee/Employees";

import SavingsPaymentPage from "../pages/Razor/SavingsPaymentPage";
import RoleManager from "../pages/RoleManager/RoleManager";
import Role from "../pages/RoleManager/Role";
import EmployeeView from "../pages/Employee/EmployeeView";
import LoanPaymentPage from "../pages/Razor/LoanPaymentPage";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoanView from "../pages/Loan/LoanView";
import ResetPasswordPage from "../pages/Authentication/ResetPasswordPage";
import GlansaLogin from "../pages/Authentication/GlansaLogin";
import GlansaMainCompanies from "../pages/Glansa/GlansaMainCompanies";
import AddMainCompany from "../pages/Glansa/AddMainCompany";
import CompanyPayments from "../pages/Glansa/CompanyPayments";
import CompanySubscriptionAdd from "../pages/Glansa/CompanySubscriptionAdd";
const authProtectedRoutes = [

	{ path: "/members", component: <Member /> , permission: "member-list"},			 ,
	{ path: "/membersadd", component: <MembersAdd />, permission: "member-add" },
	{ path: "/membersedit/:id", component: <MembersAdd /> , permission: "member-edit" },
	{ path: "/memberview/:id", component: <Memberview /> ,  permission: "member-view"},

	{ path: "/savingreceipts", component: <SavingReceiptslist /> , permission: "loan-receipt-list"},
	{ path: "/loanreceipts", component: <LoanReceiptslist /> , permission: "saving-receipt-list"},
	{ path: "/receiptsadd", component: <ReceiptsAdd /> , permission: "receipt-add"},
	
	// PaymentsAdd
	{ path: "/paymentsadd", component: <PaymentsAdd /> , permission: "payment-add"},
	{ path: "/payments", component: <PaymentsList /> , permission: "payment-list"},

	{ path: "/loans", component: <LoanList /> , permission: "loan-list"},
	{ path: "/loanadd", component: <LoanListAdd /> , permission: "loan-add"},
	{ path: "/loanedit/:id", component: <LoanListAdd /> , permission: "loan-edit"},
	{ path: "/loan-installments/:id/:mno", component: <LoanInstallmentsList /> ,  },
	{ path: "/loanview/:id", component: <LoanView /> , permission: "loan-view"},

	
	{ path: "/withdrawaladd", component: <MembershipWithdrawalForm /> , permission: "withdrawal-add"},
	{ path: "/withdrawals", component: <Withdrawals /> , permission: "withdrawal-list"},
	{ path: "/withdrawaledit/:id", component: <MembershipWithdrawalForm /> },

	{ path: "/interestrun", component: <InterestRun /> },

	{ path: "/reports", component: <Reports /> },

	{ path: "/profile", component: <Profile /> },

	{ path: "/company", component: <Company /> },
	
	{ path: "/employeeadd", component: <EmployeeAdd /> },
	{ path: "/employees", component: <Employees /> },
	{ path: "/employeedit/:id", component: <EmployeeAdd /> },
	{ path: "/employeeview/:id", component: <EmployeeView /> },

	{ path: "/savingspayment", component: <SavingsPaymentPage /> },
	{ path: "/loanpayment", component: <LoanPaymentPage /> },

	{ path: "/rolemanager", component: <RoleManager /> },
	{ path: "/roles", component: <Role /> },
	{ path: "/glansa-main-companies", component: <GlansaMainCompanies /> },
	{ path: "/add-main-company", component: <AddMainCompany /> },
	{ path: "/dashboard", component: <Dashboard /> },
	{ path: "/company-payments", component: <CompanyPayments /> },
	{ path: "/company-subscription-add", component: <CompanySubscriptionAdd /> },

	{ path: "/home", component: <LandingPage /> },

	// this route should be at the end of all other routes
	{ path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
	{ path: "/logout", component: <Logout /> },
	{ path: "/login", component: <Login /> },
	{ path: "/glansa-login", component: <GlansaLogin /> },
	{ path: "/forgot-password", component: <ForgetPwd /> },
	{ path: "/home", component: <LandingPage /> },
	{ path: "/", exact: true, component: <Navigate to="/home" /> },
	{ path: "/reset-password", component: <ResetPasswordPage /> },

	// { path: "/register", component: <Register /> },
	// { path: "/lock-screen", component: <AuthLockScreen /> },

	// // Authentication Inner
	// { path: "/auth-login", component: <Login1 /> },
	// { path: "/auth-register", component: <Register1 /> },
	// { path: "/auth-recoverpw", component: <ForgetPwd1 /> },

	// { path: "/maintenance", component: <Maintenance /> },
	// { path: "/comingsoon", component: <CommingSoon /> },
	// { path: "/404", component: <Error404 /> },
	// { path: "/500", component: <Error500 /> },
];

export { authProtectedRoutes, publicRoutes };
