import React, { useState, useEffect, useCallback, useMemo } from "react";
import Web3 from "web3";
import bigInt from "big-integer";
import { Header } from "./partials/Elements/Header/Header";
import { Button } from "./partials/Elements/Buttons/Button";
import { WalletInfo } from "./partials/Screen/Main/Wallet/WalletInfo";
import { TransactionHash } from "./partials/Screen/Main/TransactionHash/TransactionHash";
import "./App.css";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
];

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState(null);

  const knownTokens = useMemo(
    () => [
      { name: "LINK", address: "0x779877A7B0D9E8603169DdbD7836e478b4624789" },
      { name: "WETH", address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" },
    ],
    []
  );

  const loadBalance = useCallback(
    async (account, token) => {
      if (web3 && token) {
        try {
          if (token.symbol === "ETH") {
            const balance = await web3.eth.getBalance(account);
            setBalance(Web3.utils.fromWei(balance, "ether"));
          } else {
            const tokenContract = new web3.eth.Contract(
              ERC20_ABI,
              token.address
            );
            const balance = await tokenContract.methods
              .balanceOf(account)
              .call();
            const decimals = await tokenContract.methods.decimals().call();
            setBalance(Number(balance) / 10 ** Number(decimals));
          }
        } catch (error) {
          console.error(
            `Failed to load balance for token ${token.symbol}:`,
            error
          );
          setBalance(null);
        }
      }
    },
    [web3]
  );

  const loadTokens = useCallback(
    async (account) => {
      const tokenBalances = [];
      try {
        const ethBalance = await web3.eth.getBalance(account);
        tokenBalances.push({
          symbol: "ETH",
          balance: Web3.utils.fromWei(ethBalance, "ether"),
          address: "",
        });
      } catch (error) {
        console.error("Failed to load ETH balance:", error);
      }
      for (const token of knownTokens) {
        try {
          const tokenContract = new web3.eth.Contract(ERC20_ABI, token.address);
          const balance = await tokenContract.methods.balanceOf(account).call();
          const decimals = await tokenContract.methods.decimals().call();
          const symbol = await tokenContract.methods.symbol().call();
          tokenBalances.push({
            symbol,
            balance: Number(balance) / 10 ** Number(decimals),
            address: token.address,
          });
        } catch (error) {
          console.error(`Failed to load token ${token.name}:`, error);
        }
      }
      setTokens(tokenBalances);
    },
    [web3, knownTokens]
  );

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      console.log("Web3 initialized");

      const handleAccountsChanged = async (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          await loadTokens(accounts[0]);
          if (selectedToken) {
            loadBalance(accounts[0], selectedToken);
          }
        } else {
          setAccount(null);
          setBalance(null);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    } else {
      alert("MetaMask is not installed");
    }
  }, [loadBalance, loadTokens, selectedToken]);

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        await loadTokens(accounts[0]);
        if (selectedToken) {
          loadBalance(accounts[0], selectedToken);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleTokenChange = (e) => {
    const token = tokens.find((t) => t.address === e.target.value);
    setSelectedToken(token);
    if (account) {
      loadBalance(account, token);
    }
  };

  const handleTransfer = async () => {
    if (web3 && account && recipient && amount && selectedToken) {
      try {
        let tx;
        if (selectedToken.symbol === "ETH") {
          tx = await web3.eth.sendTransaction({
            from: account,
            to: recipient,
            value: web3.utils.toWei(amount, "ether"),
          });
        } else {
          const tokenContract = new web3.eth.Contract(
            ERC20_ABI,
            selectedToken.address
          );
          const decimals = await tokenContract.methods.decimals().call();
          const value = bigInt(web3.utils.toWei(amount, "ether")).divide(
            bigInt(10).pow(18 - Number(decimals))
          );
          console.log(
            `Transferring ${value.toString()} ${
              selectedToken.symbol
            } to ${recipient}`
          );
          tx = await tokenContract.methods
            .transfer(recipient, value.toString())
            .send({ from: account });
        }
        console.log("Transaction:", tx);
        setTransactionHash(tx.transactionHash);
      } catch (error) {
        console.error("Failed to transfer token:", error);
      }
    }
  };

  return (
    <div className="App">
      <div className="main">
        <Header />
        {!account ? (
          <Button text={"Connect MetaMask"} action={connectWallet} />
        ) : (
          <WalletInfo
            account={account}
            amount={amount}
            balance={balance}
            handleTokenChange={handleTokenChange}
            handleTransfer={handleTransfer}
            recipient={recipient}
            selectedToken={selectedToken}
            setAmount={setAmount}
            setRecipient={setRecipient}
            tokens={tokens}
          />
        )}
        <TransactionHash
          setTransactionHash={setTransactionHash}
          transactionHash={transactionHash}
        />
      </div>
    </div>
  );
};

export default App;
