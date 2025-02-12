import logo from './logo.svg';
import './App.css';
import {ethers} from "ethers";
import Lock from "./artifacts/contracts/Lock.sol/Lock.json";

function App() {
  const ethers = require("ethers")
  const connect =async ()=>{
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    // 由钱包插件注入的window.ethereum属性
    const provider = new ethers.BrowserProvider(window.ethereum)

    // MetaMask requires requesting permission to connect users accounts
    // 向provider发送账号请求，拿到钱包提供的所有账号
    await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    // 拿到metamask提供账号的第一个账号
    const signer = provider.getSigner();

    // 异步函数必须await
    const addr =await signer.getAddress();
  }

  const readMessage = async () => {
    // 拿到provider
    const provider = new ethers.BrowserProvider(window.ethereum)
    // 向provider发送账号请求，拿到钱包提供的所有账号
    await provider.send("eth_requestAccounts", []);
    // 读操作不需要签名
    const lock = new ethers.Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", Lock.abi, provider);
    const message = await lock.message();
    alert(message)
  }

  const setMessage = async () => {

    const provider = new ethers.BrowserProvider(window.ethereum)

    //await provider.send("eth_requestAccounts", []);

    // 写操作需要签名
    const signer = provider.getSigner();

    const lock = new ethers.Contract("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", Lock.abi, signer);
    try{
      let transaction =await lock.connect(signer).setMessage("world hello!");
      const tx =await transaction.wait(1);
      const log = tx.logs[0]; // 假设第一个日志是目标事件

      try {
        // 使用合约接口解析日志，确保事件格式正确
        const event = lock.interface.parseLog(log);
        const value = event.args[0];
        const message = value.toString();

        alert(message); // 弹出事件中的消息
      } catch (error) {
        console.error("Failed to parse event log:", error);
      }
    }catch(e){
      console.log(e)
    }
    
    
  }

  return (
    <div className="App">
      <button onClick={connect}>connect wallet</button>
      <button onClick={readMessage}>readMessage</button>
      <button onClick={setMessage}>setMessage</button>
    </div>
  );
}

export default App;
