import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function MyQuotations() {
  const navigate = useNavigate();

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyQuotations();
  }, []);

  const fetchMyQuotations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/quotations/my"
      );

      setQuotations(response.data);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load your quotations."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">

        <div className="brand">
          <div className="brand-mark">R</div>
          <span>RFQ</span>
          <strong>MarketPlace</strong>
        </div>

        <div className="dashboard-user">

          <div className="user-avatar">
            S
          </div>

          <span>Supplier</span>

          <button
            type="button"
            className="user-menu-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      <main className="dashboard-content">

        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/supplier")}
        >
          ← Back to Dashboard
        </button>


        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <span className="section-label">
                SUPPLIER ACTIVITY
              </span>

              <h1>
                My Quotations
              </h1>
            </div>

            <span className="result-count">
              {quotations.length} Quotations
            </span>

          </div>


          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {loading ? (
            <div className="empty-state">
              Loading your quotations...
            </div>
          ) : quotations.length === 0 ? (
            <div className="empty-state">

              <strong>
                No quotations yet
              </strong>

              <p>
                Your submitted quotations will
                appear here.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate("/supplier")
                }
              >
                Browse RFQs
              </button>

            </div>
          ) : (
            <div className="quotation-grid">

              {quotations.map((quotation) => (
                <article
                  className="quotation-card"
                  key={quotation.id}
                >

                  <div className="quotation-header">

                    <div className="quotation-icon">
                      Q
                    </div>

                    <div>
                      <h3>
                        Quotation #{quotation.id}
                      </h3>

                      <span>
                        RFQ #{quotation.rfq_id}
                      </span>
                    </div>

                  </div>


                  <div className="quotation-price">
                    ₹{quotation.price}
                  </div>


                  <div className="quotation-details">

                    <div>
                      <span>
                        Estimated Delivery
                      </span>

                      <strong>
                        {quotation.estimated_delivery_time}
                      </strong>
                    </div>


                    <div>
                      <span>
                        Submitted
                      </span>

                      <strong>
                        {new Date(
                          quotation.created_at
                        ).toLocaleDateString()}
                      </strong>
                    </div>

                  </div>


                  <div className="quotation-notes">

                    <span>
                      Notes
                    </span>

                    <p>
                      {quotation.notes ||
                        "No notes provided"}
                    </p>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default MyQuotations;