import React , {useState, useEffect} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { API_BASE_URL, getToken} from '../pages/ApiConfig/ApiConfig';

// const AppRoute = ({
// 	component: Component,
// 	layout: Layout,
// 	isAuthProtected,
// 	...rest
// }) => (
// 		<Route
// 			{...rest}
// 			render={props => {

// 				if (isAuthProtected && !localStorage.getItem("authUser")) {
// 					return (
// 						<Navigate to={{ pathname: "/login", state: { from: props.location } }} />
// 					);
// 				}

// 				return (
// 					<Layout>
// 						<Component {...props} />
// 					</Layout>
// 				);
// 			}}
// 		/>
// 	);


const AppRoute = (props) => {
	const location = useLocation();
	const [authChecked, setAuthChecked] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsValid(false);
      setAuthChecked(true);
      return;
    }

    // Verify token with backend
    fetch(`${API_BASE_URL}/me`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then((data) => {
         console.log(localStorage.getItem('RoleId'));
         const permissions =[];
        if(localStorage.getItem('RoleId') != 'Member') {
          const permissions = data.user.permissions || [];
          localStorage.setItem('permissions', JSON.stringify(permissions));
          setHasPermission(!props.permission || permissions.includes(props.permission));
        }
        setIsValid(true);
        setAuthChecked(true);
       
        console.log(permissions);
        
      })
      .catch(() => {
        sessionStorage.clear();
        setIsValid(false);
        setAuthChecked(true);
      });
  }, [props.permission]);

 if (!authChecked) {
    return <div className="loader">
      <img src="/images/loader-logo.png" alt="loader" />
    </div>; // You can show a loader here
  }

  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  
  if (!hasPermission && localStorage.getItem('RoleId') != 'Member') {
    return <Navigate to="/dashboard" replace />;
  }else{
    return <>{props.children}</>;
  }

  // return <>{props.children}</>;
};

export default AppRoute;

