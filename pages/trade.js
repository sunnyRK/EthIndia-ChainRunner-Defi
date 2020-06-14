import React, { Component } from 'react';
import { Button, Form, Input, Grid, Dropdown, Message, Tab, Segment, Icon, Label, Divider } from 'semantic-ui-react';
import web3 from '../config/web3';
import Axios from 'axios';
import {
    getUniswapV2Pair, 
    getUniswapV2Router02, 
    getUniswapV2Library, 
    getTellorOracle,
    getERCContractInstance,
    TokenInfoArray,
    PairInfoArray,
    tagOptions
} from '../config/instances/contractinstances';
import { ToastContainer, toast } from 'react-toastify';
import CheckLiquidity from './checkliquidity';
import Liquidity from "./liquidity";

class Trade extends Component {
    state = {
        tradeLoading: false,
        addLiquidityLoading: false,
        removeLiquidityLoading: false,
        updateLoading: false,
        amountSwapDesired: '',
        amountOut: '',
        pairTokens: [],
        token0: '',
        token1: '',
        minValue: 0, 
        shouldSwap: false,
        pairAddress: '',
        routeraddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        slippage: '',
        consultPrice: ''
    }

    async calculateSLippageRateFromTellorOracle() {

        // Fethces Price of Token pair from TELLOR ORACLES
        const oracleInstance = await getTellorOracle(web3);
        const price1 = await oracleInstance.methods.getCurrentValueFromTellorOracle(this.state.token0).call();
        const price2 = await oracleInstance.methods.getCurrentValueFromTellorOracle(this.state.token1).call();

        console.log("Tellor price1: ", price1);
        console.log("Tellor price2: ", price2);

        // const price1 = "1002975"; //DAI
        // const price2 = "206000"; //BAT
        // const price2 = "336600"; //ZRX

        const daiPrice = parseInt(price1[1])/1000000;
        const batPrice = parseInt(price2[1])/1000000;

        const daiQuantity = (daiPrice * 1e18) * (parseInt(this.state.amountSwapDesired));

        const batQuantity = (daiQuantity * 1e18) / (batPrice * 1e18);

        const difference = batQuantity/1e18 - this.state.amountOut;
        console.log("difference ", difference);

        const numerator = difference * 100;
        console.log("numerator ", numerator);

        const slippage = numerator/(batQuantity/1e18); 
        console.log("slippage is ", slippage);

        const slippage2 = slippage + " %";
        this.setState({
            slippage: slippage2,
            consultPrice: batQuantity/1e18
        }) 
    }

    async getAmountOutValue() {
        console.log(this.state.pairAddress)
        const pairInstance = await getUniswapV2Pair(web3, this.state.pairAddress);
        const reserves = await pairInstance.methods.getReserves().call();
        console.log(reserves)
        const token0V2Pair = await pairInstance.methods.token0().call();
        const token1V2Pair = await pairInstance.methods.token1().call();
        const libInstance = await getUniswapV2Library(web3);
        // // const amountIn = await libInstance.methods.getAmountIn("100","91566","70966").call();
        // // it gives reserves[1] value
        let amountOut;
        console.log(token0V2Pair, TokenInfoArray[0][this.state.token0].token_contract_address)
        if(token0V2Pair.toLowerCase() == TokenInfoArray[0][this.state.token0].token_contract_address.toLowerCase()) {
            console.log(this.state.amountSwapDesired,reserves[0], reserves[1], "1")
            amountOut = await libInstance.methods.getAmountOut(this.state.amountSwapDesired,reserves[0], reserves[1]).call();
        } else {
            console.log(this.state.amountSwapDesired,reserves[1], reserves[0], "2")
            amountOut = await libInstance.methods.getAmountOut(this.state.amountSwapDesired,reserves[1], reserves[0]).call(); 
        }
        console.log("amountout ", amountOut);
        this.setState({
            amountOut
        })    
        await this.calculateSLippageRateFromTellorOracle();
    }

    swapExactTokensForTokens = async () => {
        event.preventDefault();
        try {
            this.setState({shouldSwap: false, tradeLoading: true});

            // check if token is selelcted?
            if(this.state.token0 != "") {

            //check if trade value is added?
                if(parseInt(this.state.amountSwapDesired) > 0) {
                    const accounts = await web3.eth.getAccounts();
                    
                    if(parseInt(this.state.amountOut) >= parseInt(this.state.consultPrice)) {
                        // trade directly
                        console.log("All set to go");
                        this.setState({shouldSwap: true});
                    } else {
                        if(parseInt(this.state.slippage) <= 0.9) {
                        this.setState({shouldSwap: true});
                        } else {
                        console.log("Slippage rate is high");
                        console.log("Slippage rate: ", this.state.slippage);
                    }

                    if(this.state.shouldSwap) {
                        // Trade will happen here
                        this.setState({shouldSwap: false});
                        const erc20ContractInstance2 = await getERCContractInstance(web3, this.state.token0);
            
                        // check balance
                        const balance = await erc20ContractInstance2.methods.balanceOf(accounts[0]).call();

                        if(balance >= this.state.amountSwapDesired) {
                            let allowance = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
                            if(parseInt(allowance) < parseInt(this.state.amountSwapDesired)) {
                                await erc20ContractInstance2.methods.approve(
                                this.state.routeraddress, // Uniswap router address
                                this.state.amountSwapDesired
                                ).send({
                                    from: accounts[0]
                                });
                                allowance = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
                            }
                            //check allowance
                            if(parseInt(allowance) >= parseInt(this.state.amountSwapDesired)) {
                                const routeContractInstance = await getUniswapV2Router02(web3);
                                const transactionHash = await routeContractInstance.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                                    this.state.amountSwapDesired,
                                    this.state.minValue,
                                    [TokenInfoArray[0][this.state.token0].token_contract_address, TokenInfoArray[0][this.state.token1].token_contract_address],
                                    accounts[0],
                                    Math.floor(new Date().getTime()/1000) + 86400
                                ).send({
                                    from: accounts[0]
                                });
                                //add transation in transaction history
                                const models = {
                                    "transactionHash": transactionHash.transactionHash,
                                    "token0" : this.state.token0,
                                    "token1" : this.state.token1,
                                    "pairAddress" : this.state.pairAddress,
                                    "amountIN": this.state.amountSwapDesired,
                                    "amountOut": this.state.amountOut
                                }

                                // Axios.post('https://instcrypt-node-api.herokuapp.com/api/createProgram', models)
                                Axios.post('http://localhost:4000/api/createTrade', models)
                                    .then(res => {
                                        if(res.statusText == "OK") {
                                            alert("success");
                                        } else {
                                            console.log(res);
                                            alert("Error");
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        this.setState({shouldSwap: false, tradeLoading: false});
                                        alert("Catch");
                                    })

                                    console.log(transactionHash);
                                    toast.success("Trade Successful and transaction added to transaction history!!", {
                                        position: toast.POSITION.TOP_RIGHT
                                    });
                                
                                    toast.success("Transaction Hash: " + transactionHash.blockHash , {
                                        position: toast.POSITION.TOP_RIGHT
                                    });
                                } else {
                                    // Insufficeient allowance
                                        toast.error(this.state.token0 + " allowance is not given perfectly. Please Try again!", {
                                            position: toast.POSITION.TOP_RIGHT
                                        });
                                    }
                                } else {
                                    // Insufficeient balance
                                    toast.error("Insufficeient " + this.state.token0 + " balance!", {
                                        position: toast.POSITION.TOP_RIGHT
                                    });
                                }
                            } else {
                                // Slippage rate is high so trade will not be happen
                                toast.error("Swap will not be perform, Slippage rate is high!", {
                                position: toast.POSITION.TOP_RIGHT
                                });
                            } 
                        }
                    } else {
                    toast.error("Please add valid value!!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            } else {
                toast.error("Please select trade pair and token", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }    
            this.setState({shouldSwap: false, tradeLoading: false});
        } catch (error) {
            this.setState({shouldSwap: false, tradeLoading: false});
            console.log(error);
        }
    };

    handlePairs =  (e, { value }) => {
        const pair = [
          {
            key: PairInfoArray[0][value].token0,
            text: PairInfoArray[0][value].token0,
            value: PairInfoArray[0][value].token0,
            label: { color: 'red', empty: true, circular: true },
          },
          {
            key: PairInfoArray[0][value].token1,
            text: PairInfoArray[0][value].token1,
            value: PairInfoArray[0][value].token1,
            label: { color: 'blue', empty: true, circular: true },
          }
        ];
        
        this.setState({ 
            tradePairTokens: value, 
            pairTokens: pair, 
            token0: PairInfoArray[0][value].token0, 
            token1: PairInfoArray[0][value].token1, 
            pairAddress: PairInfoArray[0][value].pairaddress,
        });
    }; 
      
    handlePairTokens  =  (e, { value }) => {
        let tempToken2;
        if(value != this.state.token0) {
        tempToken2 = this.state.token0;
        } else {
        tempToken2 = this.state.token1;
        }
        this.setState({ token0: value, token1: tempToken2 });
    }; 
    
    handleInputPrice = async (e,{ value }) => {
        if(this.state.token0 != "") {  
            this.setState({
                amountSwapDesired: event.target.value,
                amountOut: "Wait...",
                slippage: "Wait..."
            })    
            // const amountOut = 
            await this.getAmountOutValue();    
        } else {
            alert("Please select token among pair.")
        }
    }

    render() {
        return(
            <Tab.Pane attached={false}>
                <Segment style={{backgroundColor:"#fff"}} color="pink">
                    <CheckLiquidity/>   
                </Segment>
                <Divider></Divider>
                    <Grid columns={2} divided stackable>
                        <Grid.Row>
                            <Grid.Column>
                                <Label as="a" tag color="blue">
                                For Traders
                                </Label>
                                <Segment color="black" textAlign='center'>    
                                    <Message color="grey">
                                        <Message.Header>Automate Trade</Message.Header>
                                    </Message>
                                    <Form onSubmit={this.swapExactTokensForTokens}>
                                        
                                        <Form.Field>
                                            <Dropdown
                                                placeholder="Select pair tokens.."
                                                value={this.state.tradePairTokens} 
                                                options={tagOptions}
                                                onChange={this.handlePairs} 
                                                fluid selection     
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Input
                                                label={
                                                    <Dropdown
                                                        options={this.state.pairTokens}
                                                        onChange={this.handlePairTokens} 
                                                    />
                                                }
                                                color="teal"
                                                type = "input"
                                                labelPosition="right"
                                                placeholder="Add value in Wei"
                                                value={this.state.amountSwapDesired}
                                                onChange={this.handleInputPrice}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Input
                                                type = "input"
                                                labelPosition="right"
                                                label="Amount out"
                                                value={this.state.amountOut}
                                                onChange={event => 
                                                    this.setState({
                                                        amountOut: event.target.value,
                                                })}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Input
                                                type = "input"
                                                labelPosition="right"
                                                label="Slippage Rate %"
                                                value={this.state.slippage}
                                                onChange={event => 
                                                    this.setState({
                                                        slippage: event.target.value,
                                                })}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <Button 
                                                color="black"
                                                bsStyle="primary" 
                                                type="submit"
                                                loading={this.state.tradeLoading}
                                                style={{width:"280px", height:"40px"}}> 
                                                <Icon name="american sign language interpreting"></Icon>
                                                Trade
                                            </Button>
                                        </Form.Field>
                                    </Form>
                                    </Segment>    
                                </Grid.Column>
                                <Grid.Column>
                                    <Liquidity/>
                                </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Tab.Pane>
        );
    }

};

export default Trade; 