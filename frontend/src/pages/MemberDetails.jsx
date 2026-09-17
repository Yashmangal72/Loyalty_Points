import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function MemberDetails() {
    const { id } = useParams();

    const [member, setMember] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [memberResponse, transactionResponse, rewardsResponse] =
                await Promise.all([
                    api.get(`/members/${id}`),
                    api.get(`/members/${id}/transactions`),
                    api.get("/rewards"),
                ]);

            setMember(memberResponse.data);
            setTransactions(transactionResponse.data.content);
            setRewards(rewardsResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to load member details"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const redeemReward = async (rewardId) => {
        try {
            await api.post(`/members/${id}/redeem`, {
                rewardId,
            });

            await loadData();
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to redeem reward"
            );
        }
    };

    if (loading) {
        return (
            <div className="app-layout">
                <Navbar />
                <main className="page-container">
                    <div className="empty-state">
                        Loading member...
                    </div>
                </main>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="app-layout">
                <Navbar />
                <main className="page-container">
                    <div className="error-message">
                        {error || "Member not found"}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Navbar />

            <main className="page-container">

                <Link to="/members" className="back-link">
                    ← Back to members
                </Link>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <section className="member-profile">

                    <div>
                        <p className="eyebrow">MEMBER PROFILE</p>

                        <h1>{member.name}</h1>

                        <p className="member-contact">
                            {member.phone}
                            {member.email && ` · ${member.email}`}
                        </p>
                    </div>

                    <span
                        className={`tier-badge large ${member.tier.toLowerCase()}`}
                    >
                        {member.tier} MEMBER
                    </span>

                </section>

                <section className="member-stats">

                    <div className="member-stat">
                        <span>Available Points</span>
                        <strong>{member.currentPoints}</strong>
                        <small>Ready to redeem</small>
                    </div>

                    <div className="member-stat">
                        <span>Lifetime Points</span>
                        <strong>{member.lifetimeEarnedPoints}</strong>
                        <small>Used for tier progression</small>
                    </div>

                    <div className="member-stat">
                        <span>Points Multiplier</span>
                        <strong>{member.pointsMultiplier}×</strong>
                        <small>Current earning rate</small>
                    </div>

                </section>

                <section className="detail-grid">

                    <div className="section-card">

                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">REWARDS</p>
                                <h2>Redeem points</h2>
                            </div>
                        </div>

                        <div className="reward-list">

                            {rewards.map((reward) => {

                                const canRedeem =
                                    Number(member.currentPoints) >=
                                    Number(reward.pointsCost);

                                return (
                                    <div
                                        className="reward-item"
                                        key={reward.id}
                                    >

                                        <div>
                                            <h3>{reward.name}</h3>

                                            <p>
                                                {reward.description}
                                            </p>
                                        </div>

                                        <div className="reward-action">

                                            <strong>
                                                {reward.pointsCost} pts
                                            </strong>

                                            <button
                                                className="secondary-btn"
                                                disabled={!canRedeem}
                                                onClick={() =>
                                                    redeemReward(reward.id)
                                                }
                                            >
                                                Redeem
                                            </button>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                    <div className="section-card">

                        <div className="section-heading">
                            <div>
                                <p className="eyebrow">ACTIVITY</p>
                                <h2>Transaction history</h2>
                            </div>
                        </div>

                        {transactions.length === 0 ? (

                            <div className="empty-state">
                                No transactions yet.
                            </div>

                        ) : (

                            <div className="transaction-list">

                                {transactions.map((transaction) => (

                                    <div
                                        className="transaction-item"
                                        key={transaction.id}
                                    >

                                        <div>
                                            <strong>
                                                {transaction.type === "EARN"
                                                    ? "Purchase"
                                                    : "Reward redemption"}
                                            </strong>

                                            <small>
                                                {transaction.description}
                                            </small>

                                            <small>
                                                {new Date(
                                                    transaction.createdAt
                                                ).toLocaleString()}
                                            </small>
                                        </div>

                                        <div className="transaction-points">

                                            <strong
                                                className={
                                                    transaction.type === "EARN"
                                                        ? "points-positive"
                                                        : "points-negative"
                                                }
                                            >
                                                {transaction.points > 0
                                                    ? "+"
                                                    : ""}
                                                {transaction.points}
                                            </strong>

                                            <small>
                                                Balance:{" "}
                                                {transaction.balanceAfter}
                                            </small>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </section>

            </main>
        </div>
    );
}

export default MemberDetails;