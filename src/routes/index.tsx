import { Route, Routes } from 'react-router-dom';

/**
 * Screen Employees
 */
import Employees from '../pages/employees/employees';

const AppRoutes = () => {
    return (
        <Routes>
            <Route 
                path='/'
                element={<Employees />}
            />
        </Routes>
    )
}

export default AppRoutes;