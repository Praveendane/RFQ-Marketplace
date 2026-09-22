import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

function QuotationForm() {
  const navigate = useNavigate();
  const { rfqId } = useParams();

  const [quotationData, setQuotationData] = useState({
    price: "",
    estimated_delivery_time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setQuotationData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post(
        `/quotations/rfq/${rfqId}`,
        {
          price: Number(quotationData.price),
          estimated_delivery_time:
            quotationData.estimated_delivery_time,
          notes: quotationData.notes || null,
        }
      );

      setSuccess(
        "Quotation submitted successfully."
      );

      setQuotationData({
        price: "",
        estimated_delivery_time: "",
        notes: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        "Failed to submit quotation."
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
            navigate(`/supplier/rfq/${rfqId}`)
          }
        >
          ← Back to RFQ
        </button>


        <section className="dashboard-form-card">

          <div className="section-heading">

            <div>
              <span className="section-label">
                SUPPLIER RESPONSE
              </span>

              <h1>
                Submit Quotation
              </h1>

              <p>
                Provide your pricing and delivery
                details for this RFQ.
              </p>
            </div>

            <span className="result-count">
              RFQ #{rfqId}
            </span>

          </div>


          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {success && (
            <div className="success-message">

              <p>
                {success}
              </p>

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate("/supplier/quotations")
                }
              >
                View My Quotations
              </button>

            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div>
                <label htmlFor="price">
                  Price
                </label>

                <input
                  id="price"
                  type="number"
                  name="price"
                  value={quotationData.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  placeholder="Enter quotation price"
                  required
                />

                <small className="field-help">
                  Enter the total price for this RFQ.
                </small>
              </div>


              <div>
                <label htmlFor="estimated_delivery_time">
                  Estimated Delivery Time
                </label>

                <input
                  id="estimated_delivery_time"
                  type="text"
                  name="estimated_delivery_time"
                  value={
                    quotationData.estimated_delivery_time
                  }
                  onChange={handleChange}
                  maxLength="100"
                  placeholder="Example: 7 days"
                  required
                />

                <small className="field-help">
                  Mention how long delivery will take.
                </small>
              </div>

            </div>


            <div className="form-field">

              <label htmlFor="notes">
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={quotationData.notes}
                onChange={handleChange}
                maxLength="1000"
                placeholder="Add warranty, shipping, payment terms, or other relevant information"
              />

              <small className="field-help">
                Optional. Maximum 1000 characters.
              </small>

            </div>


            <div className="action-group">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate(
                    `/supplier/rfq/${rfqId}`
                  )
                }
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Quotation"}
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default QuotationForm;