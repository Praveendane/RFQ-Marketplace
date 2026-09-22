import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function RFQDetails() {
  const navigate = useNavigate();
  const { rfqId } = useParams();

  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRfqDetails();
  }, [rfqId]);

  const fetchRfqDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/rfqs/${rfqId}`
      );

      setRfq(response.data);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load RFQ details."
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

  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-content">
          <div className="dashboard-section">
            <div className="empty-state">
              Loading RFQ details...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">

        <header className="dashboard-header">

          <div className="brand">
            <div className="brand-mark">
              R
            </div>

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
            onClick={() =>
              navigate("/supplier")
            }
          >
            ← Back to RFQs
          </button>

          <div className="dashboard-section">

            <span className="section-label">
              RFQ
            </span>

            <h1>
              Unable to Load RFQ
            </h1>

            <p className="error-message">
              {error}
            </p>

          </div>

        </main>

      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="dashboard-page">

        <main className="dashboard-content">

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate("/supplier")
            }
          >
            ← Back to RFQs
          </button>

          <div className="dashboard-section">

            <span className="section-label">
              RFQ
            </span>

            <h1>
              RFQ Not Found
            </h1>

            <p>
              The requested RFQ could not be found.
            </p>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">

        <div className="brand">

          <div className="brand-mark">
            R
          </div>

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
          onClick={() =>
            navigate("/supplier")
          }
        >
          ← Back to RFQs
        </button>


        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                RFQ DETAILS
              </span>

              <h1>
                {rfq.product_name}
              </h1>

              <p>
                Review the buyer's requirements
                before submitting your quotation.
              </p>

            </div>

            <span className="status-badge">
              Active
            </span>

          </div>


          <div className="rfq-details-grid">

            <div className="rfq-detail-card">

              <span>
                RFQ ID
              </span>

              <strong>
                #{rfq.id}
              </strong>

            </div>


            <div className="rfq-detail-card">

              <span>
                Quantity
              </span>

              <strong>
                {rfq.quantity}
              </strong>

            </div>


            <div className="rfq-detail-card">

              <span>
                Delivery Location
              </span>

              <strong>
                {rfq.delivery_location}
              </strong>

            </div>


            <div className="rfq-detail-card">

              <span>
                Deadline
              </span>

              <strong>
                {new Date(
                  rfq.deadline
                ).toLocaleString()}
              </strong>

            </div>

          </div>


          <div className="rfq-detail-description">

            <span>
              DESCRIPTION
            </span>

            <p>
              {rfq.description}
            </p>

          </div>


          <div className="rfq-detail-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate("/supplier")
              }
            >
              Back to RFQs
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate(
                  `/supplier/rfq/${rfq.id}/quote`
                )
              }
            >
              Submit Quotation
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default RFQDetails;