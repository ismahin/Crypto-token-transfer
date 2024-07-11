export function TransactionHash({ transactionHash, setTransactionHash }) {
  return (
    <>
      {transactionHash && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => setTransactionHash(null)}
            >
              &times;
            </span>
            <p>Transaction successful!</p>
            <p>Transaction ID: {transactionHash}</p>
          </div>
        </div>
      )}
    </>
  );
}
