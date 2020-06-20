import React, { Component, Fragment } from 'react';
import {
  Grid, Message, Card, Segment,
} from 'semantic-ui-react';
import Axios from 'axios';

class Transaction extends Component {
    state = {
      items: [],
      waitMessage: 'Please wait...',
    }

    async componentDidMount() {
      Axios.get('http://localhost:4000/api/getAllTrades')
        .then((res) => {
          if (res.statusText == 'OK') {
            const items = [];
            if (res.data.length > 0) {
              for (let j = 0; j < res.data.length; j++) {
                const TransactionDetails = res.data[j];
                //   console.log(TransactionDetails);
                const hashLink = `https://ropsten.etherscan.io/tx/${TransactionDetails.transactionHash}`;
                items[j] = {
                  header: (
                    <>
                      <span className="sub-heading">Transaction hash</span><br/>
                      <div className="transaction-address">
                        <a href={hashLink} target="blank">{TransactionDetails.transactionHash}</a>
                      </div>
                      <div className="sub-heading token-pair-address">{`${TransactionDetails.token0}/${TransactionDetails.token1} Pair Address`}</div>
                      <div className="transaction-address"><a href="">{TransactionDetails.pairAddress}</a></div>
                    </>
                  ),
                  // meta: `${TransactionDetails.token0}/${TransactionDetails.token1} Pair Address: ${TransactionDetails.pairAddress}`,
                  description: `AmountIn(${TransactionDetails.amountIN}) : AmountOut(${TransactionDetails.amountOut})`,
                  fluid: true,
                  // style: { overflowWrap: 'break-word' },
                };
              }
            }
            this.setState({
              items,
            }, () => {
              if (this.state.items.length == 0) {
                this.setState({
                  waitMessage: 'You have not made any transaction yet.',
                });
              }
            });
          } else {
            console.log(res);
            alert('Error');
            this.setState({
              waitMessage: 'Something went wrong',
            });
          }
        })
        .catch((err) => {
          console.log(err);
          alert('Catch');
          this.setState({
            waitMessage: 'Something went wrong',
          });
        });
    }

    render() {
      return (
        <div className="transaction-history">
          {
            this.state.items.length === 0 ? (
                <div style={{ fontSize: '16px' }}>{this.state.waitMessage}</div>
            ) : (
              <Card.Group items={this.state.items}/>
            )
          }
        </div>
      );
    }
}

export default Transaction;
