import { Description } from "../../../../../Elements/Description/Description";

export function SelectedToken({ selectedToken, balance }) {
  return (
    <>
      {selectedToken && (
        <Description text={` Balance: ${balance} ${selectedToken.symbol}`} />
      )}
    </>
  );
}
