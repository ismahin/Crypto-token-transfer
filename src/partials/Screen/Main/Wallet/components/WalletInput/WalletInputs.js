import { TextInput } from "../../../../../Elements/Forms/TextInput";

export function WalletInputs({ amount, recipient, setAmount, setRecipient }) {
  return (
    <>
      <TextInput value={amount} placeholder={"Amount"} setState={setAmount} />
      <TextInput
        value={recipient}
        placeholder={"Recipient"}
        setState={setRecipient}
      />
    </>
  );
}
