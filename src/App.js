import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from './web3';
import lottery from './lottery';

class App extends React.Component {
  state = {
    manager:'',
    players:[],
    balance:'',
    value:'',
    massage:''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager,players,balance});
  }

  onSubmit = async(event) =>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'トランザクション完了までお待ちください'})

    await lottery.methods.enter().send({
      from:accounts[0],
      value:web3.utils.toWei(this.state.value,'ether')
    });

    this.setState({message: '資金を賭けました　抽選をお楽しみに'})
  };

  onClick = async(event) =>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: '抽選中です'})
    
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({message: '抽選が完了しました'})
  }

  render() {
    return (
      <div>
          <h2>ETH大抽選会</h2>
          <p>このスマートコントラクトは  {this.state.manager}  が作りました</p>
          <p>Rinkeby Testnet Networkで接続してください</p>
          <p>TestnetのETHは一切の通貨価値を持ちません。お遊び用コントラクトです</p>
          <p>現在の参加者は  {this.state.players.length}  人です</p>
          <p>現在の賞金額は  {web3.utils.fromWei(this.state.balance,'ether')}  ETHです</p>
     
          <hr />

          <form onSubmit={this.onSubmit}>
            <h4>宝くじに参加しますか？</h4>
            <div>
              <label>賭けるETHを入力してください(0.01より大きい額)</label>
              <input
                value = {this.state.value}
                onChange={event => this.setState({value:event.target.value})}
              />

            </div>
            <button>送信</button>
          </form>

          <hr />
          <h4>当選者を決める（管理者用操作）</h4>
          <button onClick={this.onClick}>抽選</button>
          <hr />
          <h1>{this.state.message}</h1>
      </div>
    )}
}
export default App;
