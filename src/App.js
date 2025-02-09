import logo from './logo.svg';
import './App.css';
import {ethers} from "ethers";

function App() {
  const ethers = require("ethers")
  const connect =async ()=>{
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    // 由钱包插件注入的window.ethereum属性
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // MetaMask requires requesting permission to connect users accounts
    // 向provider发送账号请求，拿到钱包提供的所有账号
    await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    // 拿到metamask提供账号的第一个账号
    const signer = provider.getSigner()

    // 异步函数必须await
    const addr =await signer.getAddress();
  }
  return (
    <div className="App">
      <button onClick={connect}>
        connect wallet
      </button>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
