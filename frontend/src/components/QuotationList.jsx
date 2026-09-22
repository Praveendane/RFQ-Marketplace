function QuotationList({
  quotations,
  onClose,
}) {
  return (
    <section className="quotation-section">
      <div className="section-heading">
        <div>
          <span className="section-label">
            SUPPLIER RESPONSES
          </span>

          <h2>
            Received Quotations
          </h2>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {quotations.length === 0 ? (
        <div className="empty-state">
          <strong>
            No quotations yet
          </strong>

          <p>
            Suppliers have not submitted
            quotations for this RFQ yet.
          </p>
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
                    Supplier #{quotation.supplier_id}
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
                <span>Notes</span>

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
  );
}

export default QuotationList;