export function SelectedToken({ selectedToken, balance }) {
  return (
    <>
      {selectedToken && (
        <p>
          Balance: {balance} {selectedToken.symbol}
        </p>
      )}
    </>
  );
}
