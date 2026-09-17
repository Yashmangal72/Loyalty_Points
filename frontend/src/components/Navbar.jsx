import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/dashboard">BeanPoints</Link>
            </div>

            <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/members">Members</Link>
                <Link to="/counter">Counter</Link>

                <button onClick={logout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;