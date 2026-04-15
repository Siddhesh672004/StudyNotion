import { useSelector } from 'react-redux'

const RoleGuard = ({children, role}) => {
    const { user } = useSelector((state) => state.profile);

    return user?.accountType === role ? children : null;
}

export default RoleGuard;
