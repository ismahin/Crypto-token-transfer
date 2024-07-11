export function WalletInfo({
  account,
  handleTokenChange,
  selectedToken,
  tokens,
  balance,
  recipient,
  setRecipient,
  disconnectWallet,
  handleTransfer,
  setAmount,
  amount,
}) {
  return (
    <div>
      <p>Account: {account}</p>
      <select onChange={handleTokenChange} value={selectedToken?.address || ""}>
        <option value="" disabled>
          Select Token
        </option>
        {tokens.map((token) => (
          <option key={token.symbol} value={token.address}>
            {token.symbol} ({token.balance})
          </option>
        ))}
      </select>
      {selectedToken && (
        <p>
          Balance: {balance} {selectedToken.symbol}
        </p>
      )}
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Send</button>
      <button onClick={disconnectWallet}>Disconnect</button>
    </div>
  );
}
