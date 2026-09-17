import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Members() {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: ""
    });

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const loadMembers = async () => {
        try {
            setError("");

            const response = await api.get("/members", {
                params: {
                    search,
                    page,
                    size: 10,
                    sortBy: "name",
                    direction: "asc"
                }
            });

            setMembers(response.data);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to load members."
            );
        }
    };

    useEffect(() => {
        loadMembers();
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (page === 0) {
            loadMembers();
        } else {
            setPage(0);
        }
    };

    const handleFormChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateMember = async (e) => {
        e.preventDefault();

        setFormError("");
        setLoading(true);

        try {
            await api.post("/members", {
                name: form.name,
                phone: form.phone,
                email: form.email || null
            });

            setForm({
                name: "",
                phone: "",
                email: ""
            });

            setShowForm(false);
            setPage(0);

            await loadMembers();

        } catch (err) {
            setFormError(
                err.response?.data?.error ||
                "Unable to create member."
            );
        } finally {
            setLoading(false);
        }
    };

    const totalPages = members.totalPages ?? 0;
    const content = members.content ?? [];

    return (
        <div className="app-layout">

            <Navbar />

            <main className="page-container">

                <div className="page-header">

                    <div>
                        <p className="eyebrow">CUSTOMERS</p>

                        <h1>Members</h1>

                        <p>
                            Search and manage your café loyalty members.
                        </p>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={() => {
                            setShowForm(!showForm);
                            setFormError("");
                        }}
                    >
                        {showForm ? "Cancel" : "+ New Member"}
                    </button>

                </div>


                {showForm && (
                    <div className="section-card member-form-card">

                        <div className="section-heading">
                            <h2>Register a member</h2>

                            <p className="section-description">
                                Create a customer profile before recording
                                their purchases.
                            </p>
                        </div>

                        {formError && (
                            <div className="error-message">
                                {formError}
                            </div>
                        )}

                        <form
                            className="member-create-form"
                            onSubmit={handleCreateMember}
                        >

                            <div className="form-group">
                                <label htmlFor="name">
                                    Name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleFormChange}
                                    placeholder="Customer name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">
                                    Phone
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleFormChange}
                                    placeholder="10-digit phone number"
                                    maxLength={10}
                                    pattern="[0-9]{10}"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleFormChange}
                                    placeholder="Optional"
                                />
                            </div>

                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Member"}
                            </button>

                        </form>

                    </div>
                )}


                <form
                    className="search-bar"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="Search by name or phone number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        Search
                    </button>

                </form>


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                <div className="table-card">

                    {content.length === 0 ? (

                        <div className="empty-state">

                            <h3>No members found</h3>

                            <p>
                                Create a member or try another name or
                                phone number.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table>

                                <thead>
                                    <tr>
                                        <th>Member</th>
                                        <th>Phone</th>
                                        <th>Tier</th>
                                        <th>Points</th>
                                        <th>Lifetime</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {content.map((member) => (

                                        <tr key={member.id}>

                                            <td>
                                                <strong>
                                                    {member.name}
                                                </strong>

                                                {member.email && (
                                                    <small>
                                                        {member.email}
                                                    </small>
                                                )}
                                            </td>

                                            <td>
                                                {member.phone}
                                            </td>

                                            <td>
                                                <span
                                                    className={`tier-badge ${member.tier.toLowerCase()}`}
                                                >
                                                    {member.tier}
                                                </span>
                                            </td>

                                            <td>
                                                <strong>
                                                    {member.currentPoints}
                                                </strong>
                                            </td>

                                            <td>
                                                {member.lifetimeEarnedPoints}
                                            </td>

                                            <td>
                                                <Link
                                                    className="view-link"
                                                    to={`/members/${member.id}`}
                                                >
                                                    View
                                                </Link>
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                {totalPages > 1 && (
                    <div className="pagination">

                        <button
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>

                        <span>
                            Page {page + 1} of {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>

                    </div>
                )}

            </main>

        </div>
    );
}

export default Members;