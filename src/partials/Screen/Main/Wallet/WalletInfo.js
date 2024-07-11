import { Description } from "../../../Elements/Description/Description";
import { SelectedToken } from "./components/Tokens/SelectedToken";
import { TokenOptions } from "./components/Tokens/TokenOptions";
import { WalletButtons } from "./components/WalletButtons";
import { WalletInputs } from "./components/WalletInput/WalletInputs";

export function WalletInfo({
  account,
  setAccount,
  setBalance,
  setTransactionHash,
  handleTokenChange,
  selectedToken,
  tokens,
  balance,
  recipient,
  setRecipient,
  handleTransfer,
  setAmount,
  amount,
}) {
  return (
    <>
      <Description text={`Account: ${account}`} />
      <TokenOptions
        handleTokenChange={handleTokenChange}
        selectedToken={selectedToken}
        tokens={tokens}
      />
      <SelectedToken balance={balance} selectedToken={selectedToken} />
      <WalletInputs
        setAmount={setAmount}
        setRecipient={setRecipient}
        recipient={recipient}
        amount={amount}
      />
      <WalletButtons
        handleTransfer={handleTransfer}
        setAccount={setAccount}
        setAmount={setAmount}
        setBalance={setBalance}
        setRecipient={setRecipient}
        setTransactionHash={setTransactionHash}
      />
    </>
  );
}
