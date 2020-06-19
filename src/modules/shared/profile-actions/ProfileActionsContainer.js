import React, { Component } from 'react';

import ProfileActions from './ProfileActions';
// import { Button, Form, Segment, Grid, Dropdown, Message, Image, Statistic, Divider } from 'semantic-ui-react';
import web3 from '../../../../config/web3';
import {
  getERCContractInstance,
  getUniswapV2Pair,
  PairInfoArray,
  getERCContractInstanceWithoutSymbol,
  tagOptions,
} from '../../../../config/instances/contractinstances';

class ProfileActionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkPairAddress: 'DAI-ZRX',
      checkPairBalance: '0',
      checkbalanceLoading: false,
      symbol0: '',
      symbol1: '',
      reserve0: '0',
      reserve1: '0',
    };
  }

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();

    const UniV2PairAddress = this.state.checkPairAddress;
    const pairInstance = await getUniswapV2Pair(web3, PairInfoArray[0][this.state.checkPairAddress].pairaddress);

    const erc20ContractInstance1 = await getERCContractInstance(web3, UniV2PairAddress);

    const reserves = await pairInstance.methods.getReserves().call();

    const token0 = await pairInstance.methods.token0().call();
    const token1 = await pairInstance.methods.token1().call();

    const token0Instance = await getERCContractInstanceWithoutSymbol(web3, token0);
    const token1Instance = await getERCContractInstanceWithoutSymbol(web3, token1);

    const symbol0 = await token0Instance.methods.symbol().call();
    const symbol1 = await token1Instance.methods.symbol().call();

    const poolTokenBalance = await erc20ContractInstance1.methods.balanceOf(accounts[0]).call();

    const poolBal = (parseFloat(poolTokenBalance) / 1000000000000000000).toFixed(2);
    const rese0 = (parseFloat(reserves[0]) / 1000000000000000000).toFixed(2);
    const rese1 = (parseFloat(reserves[1]) / 1000000000000000000).toFixed(2);

    const pool0 = `${poolTokenBalance}(${poolBal})`;
    const res0 = `${reserves[0]}(${rese0})`;
    const res1 = `${reserves[1]}(${rese1})`;

    this.setState({
      checkPairBalance: pool0,
      reserve0: res0,
      reserve1: res1,
      symbol0,
      symbol1,
    });
  }

  checkPoolTokenPair = async () => {
    event.preventDefault();
    try {
      this.setState({ checkbalanceLoading: true });
      const accounts = await web3.eth.getAccounts();
      const UniV2PairAddress = this.state.checkPairAddress;
      const pairInstance = await getUniswapV2Pair(web3, PairInfoArray[0][this.state.checkPairAddress].pairaddress);
      const reserves = await pairInstance.methods.getReserves().call();

      const token0 = await pairInstance.methods.token0().call();
      const token1 = await pairInstance.methods.token1().call();

      const token0Instance = await getERCContractInstanceWithoutSymbol(web3, token0);
      const token1Instance = await getERCContractInstanceWithoutSymbol(web3, token1);

      const symbol0 = await token0Instance.methods.symbol().call();
      const symbol1 = await token1Instance.methods.symbol().call();

      const erc20ContractInstance1 = await getERCContractInstance(web3, UniV2PairAddress);
      const poolTokenBalance = await erc20ContractInstance1.methods.balanceOf(accounts[0]).call();

      const poolBal = (parseFloat(poolTokenBalance) / 1000000000000000000).toFixed(2);
      const rese0 = (parseFloat(reserves[0]) / 1000000000000000000).toFixed(2);
      const rese1 = (parseFloat(reserves[1]) / 1000000000000000000).toFixed(2);

      const pool0 = `${poolTokenBalance}(${poolBal})`;
      const res0 = `${reserves[0]}(${rese0})`;
      const res1 = `${reserves[1]}(${rese1})`;

      this.setState({
        checkPairBalance: pool0,
        reserve0: res0,
        reserve1: res1,
        symbol0,
        symbol1,
      });
      this.setState({ checkbalanceLoading: false });
    } catch (error) {
      this.setState({ checkbalanceLoading: false });
      alert(error);
    }
  };

  handlecheckPairs = (e) => {
    this.setState({
      checkPairAddress: e.target.value,
    }, () => this.checkPoolTokenPair());
  };

  render() {
    const { reserve1, reserve0, symbol1, symbol0, checkPairBalance, checkPairAddress } = this.state;
    return (
      <ProfileActions
        options={tagOptions}
        reserve1={reserve1}
        reserve0={reserve0}
        symbol1={symbol1}
        symbol0={symbol0}
        checkPairBalance={checkPairBalance}
        checkPairAddress={checkPairAddress}
        handlecheckPairs={this.handlecheckPairs}
      />
    );
  }
}

export default ProfileActionsContainer;
