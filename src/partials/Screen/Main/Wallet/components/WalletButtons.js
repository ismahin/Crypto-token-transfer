import { Button } from "../../../../Elements/Buttons/Button";

export function WalletButtons({
  setAccount,
  setBalance,
  setRecipient,
  setAmount,
  setTransactionHash,
  handleTransfer,
}) {
  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
    setRecipient("");
    setAmount("");
    setTransactionHash(null);
    window.location.reload();
  };
  return (
    <>
      <Button text={"Send"} action={handleTransfer} />
      <Button text={"Disconnect"} action={disconnectWallet} />
    </>
  );
}
