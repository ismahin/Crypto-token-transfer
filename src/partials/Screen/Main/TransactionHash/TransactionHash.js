import { Description } from "../../../Elements/Description/Description";

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
            <Description text={`Transaction successful!`} />
            <Description text={`Transaction ID: ${transactionHash}`} />
          </div>
        </div>
      )}
    </>
  );
}
