import React, { Component } from "react";
import Joyride from "react-joyride";
import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./routes";

// layouts
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";

//Fake backend
// import fakeBackend from './helpers/AuthType/fakeBackend';
import AppRoute from "./routes/route";


//Firebase helper
// import { initFirebaseBackend } from "./helpers/firebase_helper";

// Activating fake backend
// fakeBackend();

// const firebaseConfig = {
// 	apiKey: process.env.REACT_APP_APIKEY,
// 	authDomain: process.env.REACT_APP_AUTHDOMAIN,
// 	databaseURL: process.env.REACT_APP_DATABASEURL,
// 	projectId: process.env.REACT_APP_PROJECTID,
// 	storageBucket: process.env.REACT_APP_STORAGEBUCKET,
// 	messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
// 	appId: process.env.REACT_APP_APPID,
// 	measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// init firebase backend
// initFirebaseBackend(firebaseConfig);

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
	runTour: false,
	key: 0,
	steps: [
		{
			target: '#menu-dashboard',
			content: 'This is your dashboard where you get the overall view.',
		},
		{
			target: '#menu-members',
			content: 'Manage all your members here.',
		},
		{
			target: '#menu-receipts',
			content: 'All receipt-related transactions are available here.',
		},
		{
			target: '#menu-payments',
			content: 'Check and add payment entries here.',
		},
		{
			target: '#menu-loans',
			content: 'Manage loans from this section.',
		},
		{
			target: '#menu-reports',
			content: 'Access reports and analytics here.',
		},
	],
};
		this.getLayout = this.getLayout.bind(this);
		
	}

	/**
   * Returns the layout
   */
	getLayout = () => {
		let layoutCls = VerticalLayout;

		switch (this.props.layout.layoutType) {
			case "horizontal":
				layoutCls = HorizontalLayout;
				break;
			default:
				layoutCls = VerticalLayout;
				break;
		}
		return layoutCls;
	};

componentDidMount() {
    // const checkInterval = setInterval(() => {
        const dashboard = document.querySelector('#menu-dashboard');

        if (dashboard) {
            // clearInterval();

            // Properly trigger tour only after target exists
            this.initializeTour(); // make sure this sets runTour = true
        }
    // }, 500);

    window.startJoyrideTour = () => {
        this.setState(
            { runTour: false },
            () => {
                // Restart the tour reliably by updating key (forces remount)
                this.setState(prevState => ({
                    runTour: true,
                    key: prevState.key + 1
                }));
            }
        );
    };
}

initializeTour() {
    this.setState({
        runTour: true,
        key: this.state.key + 1, // helps if previous runTour was true
    });
}

	render() {
		const Layout = this.getLayout();


		return (
			<React.Fragment>
				
		
				<Joyride
				 key={this.state.key} 
					steps={this.state.steps}
					run={this.state.runTour}
					showSkipButton={true}
					showProgress={true}
					continuous={true}
					styles={{
						options: {
							zIndex: 9999,
							primaryColor: '#4CAF50',
						},
					}}
				/>
				
				<Routes>
					{publicRoutes.map((route, idx) => (
						<Route
							path={route.path}
							element={
								<NonAuthLayout>
									{route.component}
								</NonAuthLayout>
							}
							key={idx}
							exact={true}
						/>
					))}

					{authProtectedRoutes.map((route, idx) => (
						<Route
							path={route.path}
							element={
								<AppRoute>
									<Layout>{route.component}</Layout>
								</AppRoute>}
							key={idx}
							exact={true}
						/>
					))}
				</Routes>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => {
	return {
		layout: state.Layout
	};
};


export default connect(mapStateToProps, null)(App);
