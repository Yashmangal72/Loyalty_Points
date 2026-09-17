import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/auth/login", form);

            localStorage.setItem("token", response.data.token);

            navigate("/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Login failed"
            );
        }
    };

    return (
        <div className="auth-page">

            <form className="auth-card auth-form" onSubmit={handleSubmit}>

    <h1>Welcome back</h1>

    <p>Sign in to manage your café loyalty programme.</p>

    {error && (
        <div className="error-message">
            {error}
        </div>
    )}

    <label>
        Email
        <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="staff@example.com"
            required
        />
    </label>

    <label>
        Password
        <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
        />
    </label>

    <button type="submit" className="primary-btn">
        Login
    </button>

    <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
    </p>

</form>

        </div>
    );
}

export default Login;