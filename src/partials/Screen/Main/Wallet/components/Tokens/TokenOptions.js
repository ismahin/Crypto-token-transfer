export function TokenOptions({ handleTokenChange, selectedToken, tokens }) {
  return (
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
  );
}
