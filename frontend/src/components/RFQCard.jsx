function RFQCard({
  rfq,
  onEdit,
  onDelete,
  onViewQuotations,
  deleting,
}) {
  return (
    <article className="buyer-rfq-card">
      <div className="buyer-rfq-main">
        <div className="buyer-rfq-icon">
          RFQ
        </div>

        <div className="buyer-rfq-content">
          <div className="buyer-rfq-title-row">
            <div>
              <h3>{rfq.product_name}</h3>

              <p className="buyer-rfq-description">
                {rfq.description}
              </p>
            </div>

            <span className="status-badge">
              Active
            </span>
          </div>

          <div className="buyer-rfq-meta">
            <span>
              Qty: {rfq.quantity}
            </span>

            <span>
              {rfq.delivery_location}
            </span>

            <span>
              Deadline:{" "}
              {new Date(
                rfq.deadline
              ).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="buyer-rfq-actions">
        <button
          type="button"
          className="primary-outline-button"
          onClick={() =>
            onViewQuotations(rfq.id)
          }
          disabled={deleting}
        >
          View Quotations
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => onEdit(rfq)}
          disabled={deleting}
        >
          Edit
        </button>

        <button
          type="button"
          className="danger-outline-button"
          onClick={() => onDelete(rfq.id)}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}

export default RFQCard;