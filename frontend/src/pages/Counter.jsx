import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Counter() {
    const [phone, setPhone] = useState("");
    const [member, setMember] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const searchMember = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setMember(null);

        if (!/^\d{10}$/.test(phone)) {
            setError("Enter a valid 10-digit phone number.");
            return;
        }

        setLoading(true);

        try {
            const [memberResponse, rewardsResponse] = await Promise.all([
                api.get(`/members/phone/${phone}`),
                api.get("/rewards"),
            ]);

            setMember(memberResponse.data);
            setRewards(rewardsResponse.data);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Member not found."
            );
        } finally {
            setLoading(false);
        }
    };

    const recordPurchase = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (!amount || Number(amount) <= 0) {
            setError("Enter a valid purchase amount.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                `/members/${member.id}/purchases`,
                {
                    amount: Number(amount),
                }
            );

            setMember(response.data);
            setAmount("");
            setMessage("Purchase recorded and points added successfully.");

        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to record purchase."
            );
        } finally {
            setLoading(false);
        }
    };

    const redeemReward = async (rewardId) => {
        setError("");
        setMessage("");

        setLoading(true);

        try {
            const response = await api.post(
                `/members/${member.id}/redeem`,
                {
                    rewardId,
                }
            );

            setMember(response.data);
            setMessage("Reward redeemed successfully.");

        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to redeem reward."
            );
        } finally {
            setLoading(false);
        }
    };

    const calculatePreviewPoints = () => {
        if (!amount || !member) return "0.00";

        const points = (
            Number(amount) / 100
        ) * Number(member.pointsMultiplier);

        return points.toFixed(2);
    };

    return (
        <div className="app-layout">

            <Navbar />

            <main className="page-container">

                <div className="page-header">
                    <div>
                        <p className="eyebrow">POINT OF SALE</p>

                        <h1>Counter</h1>

                        <p>
                            Look up a member, record a purchase and
                            redeem rewards.
                        </p>
                    </div>
                </div>

                <section className="counter-search">

                    <form
                        className="search-bar"
                        onSubmit={searchMember}
                    >
                        <input
                            type="tel"
                            placeholder="Enter 10-digit phone number"
                            value={phone}
                            maxLength="10"
                            onChange={(e) =>
                                setPhone(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                        />

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search Member"}
                        </button>
                    </form>

                </section>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {member && (

                    <div className="counter-content">

                        {/* Member card */}

                        <section className="counter-member-card">

                            <div className="counter-member-header">

                                <div>
                                    <p className="eyebrow">
                                        MEMBER
                                    </p>

                                    <h2>{member.name}</h2>

                                    <p>{member.phone}</p>
                                </div>

                                <span
                                    className={`tier-badge large ${member.tier.toLowerCase()}`}
                                >
                                    {member.tier}
                                </span>

                            </div>

                            <div className="counter-points">

                                <div>
                                    <span>Available Points</span>
                                    <strong>
                                        {member.currentPoints}
                                    </strong>
                                </div>

                                <div>
                                    <span>Lifetime Points</span>
                                    <strong>
                                        {member.lifetimeEarnedPoints}
                                    </strong>
                                </div>

                                <div>
                                    <span>Multiplier</span>
                                    <strong>
                                        {member.pointsMultiplier}×
                                    </strong>
                                </div>

                            </div>

                        </section>

                        {/* Purchase */}

                        <section className="section-card">

                            <p className="eyebrow">
                                PURCHASE
                            </p>

                            <h2>Record purchase</h2>

                            <p className="section-description">
                                Add the customer's purchase amount to
                                automatically calculate loyalty points.
                            </p>

                            <form
                                className="purchase-form"
                                onSubmit={recordPurchase}
                            >

                                <label>
                                    Purchase amount
                                </label>

                                <div className="amount-input">

                                    <span>₹</span>

                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="500.00"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                    />

                                </div>

                                <div className="points-preview">

                                    <span>Points earned</span>

                                    <strong>
                                        +{calculatePreviewPoints()} pts
                                    </strong>

                                </div>

                                <button
                                    type="submit"
                                    className="primary-btn full-width"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Processing..."
                                        : "Record Purchase"}
                                </button>

                            </form>

                        </section>

                        {/* Rewards */}

                        <section className="section-card">

                            <p className="eyebrow">
                                REWARDS
                            </p>

                            <h2>Redeem rewards</h2>

                            <p className="section-description">
                                Available balance:{" "}
                                <strong>
                                    {member.currentPoints} points
                                </strong>
                            </p>

                            <div className="counter-rewards">

                                {rewards.map((reward) => {

                                    const canRedeem =
                                        Number(member.currentPoints) >=
                                        Number(reward.pointsCost);

                                    return (
                                        <div
                                            className="counter-reward"
                                            key={reward.id}
                                        >

                                            <div>
                                                <h3>
                                                    {reward.name}
                                                </h3>

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
                                                    disabled={
                                                        !canRedeem ||
                                                        loading
                                                    }
                                                    onClick={() =>
                                                        redeemReward(
                                                            reward.id
                                                        )
                                                    }
                                                >
                                                    Redeem
                                                </button>

                                            </div>

                                        </div>
                                    );
                                })}

                            </div>

                        </section>

                    </div>
                )}

            </main>
        </div>
    );
}

export default Counter;