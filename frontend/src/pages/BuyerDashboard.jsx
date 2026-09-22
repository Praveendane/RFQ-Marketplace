import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import RFQCard from "../components/RFQCard";
import QuotationList from "../components/QuotationList";
import api from "../services/api";

function BuyerDashboard() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingRfqId, setEditingRfqId] = useState(null);

  const [rfqData, setRfqData] = useState({
    product_name: "",
    description: "",
    quantity: "",
    delivery_location: "",
    deadline: "",
  });

  const [rfqs, setRfqs] = useState([]);
  const [selectedRfqId, setSelectedRfqId] = useState(null);
  const [quotations, setQuotations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyRfqs();
  }, []);

  const fetchMyRfqs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/rfqs/my");
      setRfqs(response.data);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load your RFQs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setRfqData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setRfqData({
      product_name: "",
      description: "",
      quantity: "",
      delivery_location: "",
      deadline: "",
    });

    setEditingRfqId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      const requestData = {
        ...rfqData,
        quantity: Number(rfqData.quantity),
      };

      if (editingRfqId !== null) {
        const response = await api.put(
          `/rfqs/${editingRfqId}`,
          requestData
        );

        setRfqs((previousRfqs) =>
          previousRfqs.map((rfq) =>
            rfq.id === editingRfqId
              ? response.data
              : rfq
          )
        );
      } else {
        const response = await api.post(
          "/rfqs",
          requestData
        );

        setRfqs((previousRfqs) => [
          response.data,
          ...previousRfqs,
        ]);
      }

      resetForm();
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to save RFQ."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rfq) => {
    setRfqData({
      product_name: rfq.product_name,
      description: rfq.description,
      quantity: rfq.quantity,
      delivery_location: rfq.delivery_location,
      deadline: rfq.deadline.slice(0, 16),
    });

    setEditingRfqId(rfq.id);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (rfqId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this RFQ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setDeletingId(rfqId);

      await api.delete(`/rfqs/${rfqId}`);

      setRfqs((previousRfqs) =>
        previousRfqs.filter(
          (rfq) => rfq.id !== rfqId
        )
      );

      if (selectedRfqId === rfqId) {
        setSelectedRfqId(null);
        setQuotations([]);
      }
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to delete RFQ."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewQuotations = async (rfqId) => {
    try {
      setError("");
      setSelectedRfqId(rfqId);
      setQuotations([]);

      const response = await api.get(
        `/quotations/rfq/${rfqId}`
      );

      setQuotations(response.data);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to load quotations."
      );
    }
  };

  const handleCloseQuotations = () => {
    setSelectedRfqId(null);
    setQuotations([]);
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
          <span className="notification-icon">
            ♢
          </span>

          <div className="user-avatar">
            B
          </div>

          <span>Buyer</span>

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

        <section className="dashboard-hero buyer-hero">
          <div>
            <p className="hero-label">
              BUYER DASHBOARD
            </p>

            <h1>
              Welcome back, Buyer!
            </h1>

            <p>
              Create RFQs, manage quotations,
              and connect with suppliers.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setError("");
                setShowForm(true);
              }}
            >
              + Create RFQ
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
            <div className="stat-icon blue-icon">
              RFQ
            </div>

            <div>
              <span>Total RFQs</span>
              <strong>{rfqs.length}</strong>
              <small>All RFQs created</small>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon green-icon">
              ✓
            </div>

            <div>
              <span>Active RFQs</span>
              <strong>{rfqs.length}</strong>
              <small>Currently active</small>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon purple-icon">
              Q
            </div>

            <div>
              <span>Total Quotations</span>
              <strong>
                {quotations.length}
              </strong>
              <small>Received from suppliers</small>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon red-icon">
              ✓
            </div>

            <div>
              <span>Managed RFQs</span>
              <strong>{rfqs.length}</strong>
              <small>In your workspace</small>
            </div>
          </div>

        </section>


        {showForm && (
          <section className="dashboard-form-card">

            <div className="section-heading">
              <div>
                <span className="section-label">
                  RFQ MANAGEMENT
                </span>

                <h2>
                  {editingRfqId !== null
                    ? "Edit RFQ"
                    : "Create New RFQ"}
                </h2>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Close
              </button>
            </div>


            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div>
                  <label>
                    Product / Service Name
                  </label>

                  <input
                    type="text"
                    name="product_name"
                    value={rfqData.product_name}
                    onChange={handleChange}
                    minLength="2"
                    maxLength="150"
                    required
                  />
                </div>


                <div>
                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={rfqData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>


                <div>
                  <label>
                    Delivery Location
                  </label>

                  <input
                    type="text"
                    name="delivery_location"
                    value={rfqData.delivery_location}
                    onChange={handleChange}
                    minLength="2"
                    maxLength="255"
                    required
                  />
                </div>


                <div>
                  <label>
                    Deadline
                  </label>

                  <input
                    type="datetime-local"
                    name="deadline"
                    value={rfqData.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>


              <div>
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={rfqData.description}
                  onChange={handleChange}
                  minLength="5"
                  required
                />
              </div>


              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editingRfqId !== null
                  ? "Update RFQ"
                  : "Create RFQ"}
              </button>

            </form>
          </section>
        )}


        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <span className="section-label">
                RFQ MANAGEMENT
              </span>

              <h2>My RFQs</h2>
            </div>
          </div>


          {loading ? (
            <div className="empty-state">
              Loading your RFQs...
            </div>
          ) : rfqs.length === 0 ? (
            <div className="empty-state">
              <strong>No RFQs yet</strong>
              <p>
                Create your first RFQ to start
                receiving quotations.
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() => setShowForm(true)}
              >
                Create Your First RFQ
              </button>
            </div>
          ) : (
            <div className="rfq-list">
              {rfqs.map((rfq) => (
                <RFQCard
                  key={rfq.id}
                  rfq={rfq}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewQuotations={
                    handleViewQuotations
                  }
                  deleting={
                    deletingId === rfq.id
                  }
                />
              ))}
            </div>
          )}

        </section>


        {selectedRfqId !== null && (
          <QuotationList
            quotations={quotations}
            onClose={handleCloseQuotations}
          />
        )}

      </main>

    </div>
  );
}

export default BuyerDashboard;