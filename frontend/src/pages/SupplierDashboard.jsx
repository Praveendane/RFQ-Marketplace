import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

function SupplierDashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRfqs();
  }, [search, location]);

  const fetchRfqs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/rfqs", {
        params: {
          search: search.trim() || undefined,
          location: location.trim() || undefined,
        },
      });

      setRfqs(response.data);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load RFQs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (rfqId) => {
    navigate(`/supplier/rfq/${rfqId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");

    navigate("/login", {
      replace: true,
    });
  };

  const handleClearFilters = () => {
    setSearch("");
    setLocation("");
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

          <span className="notification-icon">
            ♢
          </span>

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

        <section className="dashboard-hero supplier-hero">

          <div>

            <p className="hero-label">
              SUPPLIER DASHBOARD
            </p>

            <h1>
              Welcome back, Supplier!
            </h1>

            <p>
              Find RFQs, submit quotations,
              and grow your business.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate("/supplier/quotations")
              }
            >
              My Quotations
            </button>

          </div>


          <div className="hero-icon">
            RFQ
          </div>

        </section>


        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon green-icon">
              RFQ
            </div>

            <div>
              <span>Available RFQs</span>
              <strong>{rfqs.length}</strong>
              <small>Available to bid</small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon blue-icon">
              +
            </div>

            <div>
              <span>New RFQs</span>
              <strong>{rfqs.length}</strong>
              <small>Available now</small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon purple-icon">
              Q
            </div>

            <div>
              <span>My Quotations</span>
              <strong>View</strong>
              <small>Submitted quotations</small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange-icon">
              ★
            </div>

            <div>
              <span>Opportunities</span>
              <strong>{rfqs.length}</strong>
              <small>RFQs to explore</small>
            </div>

          </div>

        </section>


        <section className="search-card">

          <div className="search-field">

            <label>
              Search by Product
            </label>

            <input
              type="text"
              placeholder="Search products, e.g. Laptop"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>


          <div className="search-field">

            <label>
              Delivery Location
            </label>

            <input
              type="text"
              placeholder="e.g. Bengaluru"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
            />

          </div>


          <div className="search-actions">

            <button
              type="button"
              className="primary-button"
              onClick={fetchRfqs}
            >
              Search
            </button>

            {(search || location) && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleClearFilters}
              >
                Clear
              </button>
            )}

          </div>

        </section>


        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <span className="section-label">
                OPPORTUNITIES
              </span>

              <h2>
                Available RFQs
              </h2>
            </div>

            <span className="result-count">
              {rfqs.length} RFQs
            </span>

          </div>


          {loading ? (
            <div className="empty-state">
              Loading RFQs...
            </div>
          ) : rfqs.length === 0 ? (
            <div className="empty-state">
              <strong>
                No RFQs found
              </strong>

              <p>
                Try changing your search or
                location filters.
              </p>
            </div>
          ) : (
            <div className="supplier-rfq-grid">

              {rfqs.map((rfq) => (
                <article
                  className="supplier-rfq-card"
                  key={rfq.id}
                >

                  <div className="rfq-card-icon">
                    RFQ
                  </div>

                  <span className="status-badge">
                    New
                  </span>

                  <h3>
                    {rfq.product_name}
                  </h3>

                  <p className="rfq-description">
                    {rfq.description}
                  </p>

                  <div className="rfq-meta">

                    <span>
                      Qty: {rfq.quantity}
                    </span>

                    <span>
                      {rfq.delivery_location}
                    </span>

                    <span>
                      {new Date(
                        rfq.deadline
                      ).toLocaleDateString()}
                    </span>

                  </div>

                  <button
                    type="button"
                    className="primary-button full-button"
                    onClick={() =>
                      handleViewDetails(rfq.id)
                    }
                  >
                    View Details
                  </button>

                </article>
              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default SupplierDashboard;