import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({children}) => {

    const {token} = useSelector((state) => state.auth);
    const location = useLocation();

    if(token)
        return children
    else
        return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} />

}

export default PrivateRoute
