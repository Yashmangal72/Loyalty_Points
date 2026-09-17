import { Link } from "react-router-dom";

function Landing() {
    return (
        <div className="landing-page">

            {/* Hero */}
            <section className="landing-hero">
                <p className="landing-eyebrow">
                    CAFE LOYALTY PLATFORM
                </p>

                <h1>
                    Turn every coffee
                    <br />
                    into a reward.
                </h1>

                <p className="landing-hero-description">
                    BeanPoints helps cafés manage customer loyalty,
                    track purchases, reward regulars and make every
                    visit more valuable.
                </p>

                <div className="landing-actions">
                    <Link to="/login" className="primary-btn">
                        Staff Login
                    </Link>

                    <Link to="/register" className="secondary-btn">
                        Create Account
                    </Link>
                </div>
            </section>


            {/* Features */}
            <section className="landing-section">

                <div className="landing-section-header">
                    <p className="eyebrow">
                        CORE FEATURES
                    </p>

                    <h2>
                        Everything your café needs
                    </h2>

                    <p>
                        A simple loyalty system designed to help café
                        staff manage customers, purchases and rewards
                        from one place.
                    </p>
                </div>

                <div className="feature-grid">

                    <div className="feature-card">
                        <span className="feature-card-number">
                            01
                        </span>

                        <h3>Earn Points</h3>

                        <p>
                            Automatically calculate loyalty points
                            whenever a customer makes a purchase.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-card-number">
                            02
                        </span>

                        <h3>Redeem Rewards</h3>

                        <p>
                            Let customers exchange their points for
                            free drinks, desserts and vouchers.
                        </p>
                    </div>

                    <div className="feature-card">
                        <span className="feature-card-number">
                            03
                        </span>

                        <h3>Tier System</h3>

                        <p>
                            Reward regular customers with Bronze,
                            Silver and Gold membership tiers.
                        </p>
                    </div>

                </div>
            </section>


            {/* Target Audience */}
            <section className="audience-section">

                <div className="audience-inner">

                    <p className="eyebrow">
                        WHO IT'S FOR
                    </p>

                    <h2>
                        Built for growing cafés
                    </h2>

                    <p>
                        Designed for café staff and owners who want a
                        simple way to manage loyalty without complicated
                        systems.
                    </p>

                </div>

            </section>


            {/* What's Next */}
            <section className="landing-section">

                <div className="landing-section-header">
                    <p className="eyebrow">
                        ROADMAP
                    </p>

                    <h2>
                        What's coming next?
                    </h2>

                    <p>
                        The platform can grow beyond the counter with
                        customer-facing features and deeper insights.
                    </p>
                </div>

                <div className="next-features">

                    <div className="next-feature">
                        <h3>
                            Customer Mobile App
                        </h3>

                        <p>
                            Customers can track their points and rewards
                            directly from their phones.
                        </p>
                    </div>

                    <div className="next-feature">
                        <h3>
                            Personalized Offers
                        </h3>

                        <p>
                            Send targeted offers based on customer
                            purchase behaviour.
                        </p>
                    </div>

                    <div className="next-feature">
                        <h3>
                            Analytics
                        </h3>

                        <p>
                            Understand customer retention, spending and
                            loyalty programme performance.
                        </p>
                    </div>

                </div>

            </section>


            {/* Footer */}
            <footer className="landing-footer">
                BeanPoints — Simple loyalty management for modern cafés.
            </footer>

        </div>
    );
}

export default Landing;