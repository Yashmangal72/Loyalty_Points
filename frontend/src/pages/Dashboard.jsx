import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
    return (
        <div className="app-layout">
            <Navbar />

            <main className="page-container">

                <div className="page-header">
                    <div>
                        <p className="eyebrow">OVERVIEW</p>
                        <h1>Good afternoon 👋</h1>
                        <p>
                            Manage members, purchases and rewards from one place.
                        </p>
                    </div>
                </div>

                <section className="stats-grid">

                    <div className="stat-card">
                        <span>Total Members</span>
                        <strong>—</strong>
                        <small>Registered customers</small>
                    </div>

                    <div className="stat-card">
                        <span>Today's Purchases</span>
                        <strong>—</strong>
                        <small>Purchases recorded today</small>
                    </div>

                    <div className="stat-card">
                        <span>Points Redeemed</span>
                        <strong>—</strong>
                        <small>Rewards redeemed</small>
                    </div>

                    <div className="stat-card">
                        <span>Active Rewards</span>
                        <strong>—</strong>
                        <small>Available rewards</small>
                    </div>

                </section>

                <section className="dashboard-actions">

                    <div className="action-card">
                        <div>
                            <h2>Counter</h2>
                            <p>
                                Quickly find a customer and record their purchase
                                or redeem a reward.
                            </p>
                        </div>

                        <Link to="/counter" className="primary-btn">
                            Open Counter
                        </Link>
                    </div>

                    <div className="action-card">
                        <div>
                            <h2>Members</h2>
                            <p>
                                Search customers, view their loyalty tier,
                                points and transaction history.
                            </p>
                        </div>

                        <Link to="/members" className="secondary-btn">
                            View Members
                        </Link>
                    </div>

                </section>

            </main>
        </div>
    );
}

export default Dashboard;