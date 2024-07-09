
# MetaMask Token Transfer

This project is a simple React application that allows users to connect their MetaMask wallet, view their balances for both native Ethereum (ETH) and ERC20 tokens, and transfer these tokens to a specified recipient.

## Features

- Connect to MetaMask wallet
- View balances of native Ethereum (ETH) and specified ERC20 tokens (e.g., LINK)
- Select a token from the dropdown to view its balance
- Transfer selected token to a recipient address
- Disconnect the wallet

## Prerequisites

- Node.js and npm installed
- MetaMask browser extension installed

## Getting Started

1. **Clone the repository**

```sh
git clone https://github.com/yourusername/metamask-token-transfer.git
cd metamask-token-transfer
```

2. **Install dependencies**

```sh
npm install
```

3. **Run the application**

```sh
npm start
```

The application will be available at `http://localhost:3000`.

## Code Overview

### Libraries Used

- `react`: For building the user interface
- `web3`: For interacting with the Ethereum blockchain
- `big-integer`: For handling large integers (BigInt alternative)
- `meta-mask`: MetaMask for Ethereum wallet interaction

### Main Components

#### `App.js`

This is the main component of the application, containing the following functionalities:

- **State Management**: Manages the state for the web3 instance, account, balances, tokens, selected token, recipient address, amount, and transaction hash.
- **Load Balances**: Fetches and displays the balances of both native ETH and ERC20 tokens.
- **Handle Transfers**: Manages the transfer of selected tokens to the recipient address.
- **Event Listeners**: Listens for account changes and updates the state accordingly.

### Key Functions

#### `loadBalance`

Loads the balance of a given token for the specified account.

```jsx
const loadBalance = useCallback(async (account, token) => {
  if (web3 && token) {
    try {
      if (token.symbol === 'ETH') {
        const balance = await web3.eth.getBalance(account);
        setBalance(Web3.utils.fromWei(balance, 'ether'));
      } else {
        const tokenContract = new web3.eth.Contract(ERC20_ABI, token.address);
        const balance = await tokenContract.methods.balanceOf(account).call();
        const decimals = await tokenContract.methods.decimals().call();
        setBalance(Number(balance) / 10 ** Number(decimals));
      }
    } catch (error) {
      console.error(`Failed to load balance for token ${token.symbol}:`, error);
      setBalance(null);
    }
  }
}, [web3]);
```

#### `loadTokens`

Loads balances for both native ETH and specified ERC20 tokens.

```jsx
const loadTokens = useCallback(async (account) => {
  const tokenBalances = [];
  try {
    const ethBalance = await web3.eth.getBalance(account);
    tokenBalances.push({ symbol: 'ETH', balance: Web3.utils.fromWei(ethBalance, 'ether'), address: '' });
  } catch (error) {
    console.error('Failed to load ETH balance:', error);
  }
  for (const token of knownTokens) {
    try {
      const tokenContract = new web3.eth.Contract(ERC20_ABI, token.address);
      const balance = await tokenContract.methods.balanceOf(account).call();
      const decimals = await tokenContract.methods.decimals().call();
      const symbol = await tokenContract.methods.symbol().call();
      tokenBalances.push({ symbol, balance: Number(balance) / 10 ** Number(decimals), address: token.address });
    } catch (error) {
      console.error(`Failed to load token ${token.name}:`, error);
    }
  }
  setTokens(tokenBalances);
}, [web3, knownTokens]);
```

#### `handleTransfer`

Handles the transfer of the selected token to the recipient address.

```jsx
const handleTransfer = async () => {
  if (web3 && account && recipient && amount && selectedToken) {
    try {
      let tx;
      if (selectedToken.symbol === 'ETH') {
        tx = await web3.eth.sendTransaction({
          from: account,
          to: recipient,
          value: web3.utils.toWei(amount, 'ether'),
        });
      } else {
        const tokenContract = new web3.eth.Contract(ERC20_ABI, selectedToken.address);
        const decimals = await tokenContract.methods.decimals().call();
        const value = bigInt(web3.utils.toWei(amount, 'ether')).divide(bigInt(10).pow(18 - Number(decimals)));
        console.log(`Transferring ${value.toString()} ${selectedToken.symbol} to ${recipient}`);
        tx = await tokenContract.methods.transfer(recipient, value.toString()).send({ from: account });
      }
      console.log('Transaction:', tx);
      setTransactionHash(tx.transactionHash);
    } catch (error) {
      console.error('Failed to transfer token:', error);
    }
  }
};
```

## Screenshots

Include screenshots of your app here.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License.
