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
import RoleBasedRoute from "./RoleBasedRoute"; // import it



const authProtectedRoutes = [

	{ path: "/members", component: <RoleBasedRoute allowedRoles={[1,2,3]}>
									<Member /> 
								</RoleBasedRoute>},
	{ path: "/savingreceipts", component: <SavingReceiptslist /> },
	{ path: "/loanreceipts", component: <LoanReceiptslist /> },
	{ path: "/membersadd", component: <MembersAdd /> },
	{ path: "/membersedit/:id", component: <MembersAdd /> },
	// PaymentsAdd
	{ path: "/paymentsadd", component: <PaymentsAdd /> },
	{ path: "/payments", component: <PaymentsList /> },

	{ path: "/loans", component: <LoanList /> },
	{ path: "/loanadd", component: <LoanListAdd /> },
	{ path: "/loanedit/:id", component: <LoanListAdd /> },
	{ path: "/loan-installments/:id/:mno", component: <LoanInstallmentsList /> },



	{ path: "/receiptsadd", component: <ReceiptsAdd /> },

	{ path: "/reports", component: <Reports /> },

	{ path: "/withdrawaladd", component: <MembershipWithdrawalForm /> },
	{ path: "/withdrawals", component: <Withdrawals /> },
	{ path: "/withdrawaledit/:id", component: <MembershipWithdrawalForm /> },
	{ path: "/interestrun", component: <InterestRun /> },

	{ path: "/profile", component: <Profile /> },
	{ path: "/company", component: <Company /> },
	{ path: "/memberview/:id", component: <Memberview /> },
	{ path: "/employeeadd", component: <EmployeeAdd /> },
	{ path: "/employees", component: <Employees /> },
	{ path: "/employeedit/:id", component: <EmployeeAdd /> },





	{ path: "/dashboard", component: <Dashboard /> },

	// this route should be at the end of all other routes
	{ path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
	{ path: "/logout", component: <Logout /> },
	{ path: "/login", component: <Login /> },
	{ path: "/forgot-password", component: <ForgetPwd /> },
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
