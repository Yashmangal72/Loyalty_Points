import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/register", form);

            localStorage.setItem("token", response.data.token);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to create account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">
                    <p className="eyebrow">BEANPOINTS STAFF</p>

                    <h1>Create account</h1>

                    <p>
                        Create a staff account to access BeanPoints.
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="staff@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Minimum 6 characters"
                            value={form.password}
                            onChange={handleChange}
                            minLength={6}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                </form>

                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </div>

            </div>

        </div>
    );
}

export default Register;