import React, { Component } from 'react';
import { Button, Form, Input, Segment, Grid, Dropdown, Message, Icon, Divider, Label } from 'semantic-ui-react';
import web3 from '../config/web3';
import {
  getUniswapV2Router02,
  getERCContractInstance,
  getTellorOracle,
  TokenInfoArray,
  PairInfoArray, 
  tagOptions
} from '../config/instances/contractinstances';
import { ToastContainer, toast } from 'react-toastify';

class Liquidity extends Component {
    state = {
        addLiquidityLoading: false,
        removeLiquidityLoading: false,
        routeraddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        liquidityToken0: '',
        liquidityToken1: '',
        addLiquidityamount0: '',
        addLiquidityamount1: '',
        removeTokenPair: '',
        removeLiquidityTokenAmount: '',
        minValue: 0
    }

    selectMax = async () => {
        event.preventDefault();
        try {
            if (this.state.removeTokenPair!=""){
                const accounts = await web3.eth.getAccounts();
                const erc20ContractInstance1 = await getERCContractInstance(web3, this.state.removeTokenPair);
                const poolTokenBalance = await erc20ContractInstance1.methods.balanceOf(accounts[0]).call();
                this.setState({
                    removeLiquidityTokenAmount: poolTokenBalance
                });
            } else {
                toast.error("Please select token pair!!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            
        }
    };
    
    removeLiquidity = async () => {
        event.preventDefault();
        try {
            this.setState({removeLiquidityLoading: true});
            const accounts = await web3.eth.getAccounts();
            const erc20ContractInstance1 = await getERCContractInstance(web3, this.state.removeTokenPair);
            const poolTokenBalance = await erc20ContractInstance1.methods.balanceOf(accounts[0]).call();
            if(parseInt(poolTokenBalance) >= parseInt(this.state.removeLiquidityTokenAmount)) {
                
                const allowancePair = await erc20ContractInstance1.methods.allowance(accounts[0], this.state.routeraddress).call();

                if(parseInt(allowancePair) < parseInt(this.state.removeLiquidityTokenAmount)) {
                    await erc20ContractInstance1.methods.approve(
                        this.state.routeraddress,
                        parseInt(this.state.removeLiquidityTokenAmount)
                    ).send({
                        from: accounts[0]
                    });
                }

                const routeContractInstance = await getUniswapV2Router02(web3);
                await routeContractInstance.methods.removeLiquidity(
                    TokenInfoArray[0][this.state.liquidityToken0].token_contract_address,
                    TokenInfoArray[0][this.state.liquidityToken1].token_contract_address,
                    parseInt(this.state.removeLiquidityTokenAmount),
                    this.state.minValue,
                    this.state.minValue,
                    accounts[0],
                    Math.floor(new Date().getTime()/1000) + 86400
                ).send({
                    from:accounts[0]
                });
                this.setState({removeLiquidityLoading: false});
                toast.success("Successfully removed liquidity!!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error("You don't have " + this.state.removeLiquidityTokenAmount  + " liquidity to remove. Please enter valid liquidity!!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.setState({removeLiquidityLoading: false});
        } catch(error) {
            this.setState({removeLiquidityLoading: false});
            console.log(error);
        }
      };
    
    addLiquidity = async () => {
        event.preventDefault();
        try {
            this.setState({addLiquidityLoading: true});
            const accounts = await web3.eth.getAccounts();
            const erc20ContractInstance1 = await getERCContractInstance(web3, this.state.liquidityToken0);
            const erc20ContractInstance2 = await getERCContractInstance(web3, this.state.liquidityToken1);
            const balance0 = await erc20ContractInstance1.methods.balanceOf(accounts[0]).call();
            const balance1 = await erc20ContractInstance2.methods.balanceOf(accounts[0]).call();
            console.log("balance1: ", balance1)
            if(parseInt(balance0) >= parseInt(this.state.addLiquidityamount0) && parseInt(this.state.addLiquidityamount0) > parseInt(this.state.minValue)) {
            
                if(parseInt(balance1) >= parseInt(this.state.addLiquidityamount1) && parseInt(this.state.addLiquidityamount1) > parseInt(this.state.minValue)) {
                    const allowanceToken0 = await erc20ContractInstance1.methods.allowance(accounts[0], this.state.routeraddress).call();
                    const allowanceToken1 = await erc20ContractInstance2.methods.allowance(accounts[0], this.state.routeraddress).call();
                    if(parseInt(allowanceToken0) < parseInt(this.state.addLiquidityamount0)) {
                        await erc20ContractInstance1.methods.approve(
                            this.state.routeraddress,  
                            parseInt(this.state.addLiquidityamount0)
                        ).send({
                            from: accounts[0]
                        });    
                    }
                    
                    if(parseInt(allowanceToken1) < parseInt(this.state.addLiquidityamount1)) {
                        await erc20ContractInstance2.methods.approve(
                            this.state.routeraddress,
                            parseInt(this.state.addLiquidityamount1)
                        ).send({
                            from: accounts[0]
                        });
                    }
        
                    const routeContractInstance = await getUniswapV2Router02(web3);

                    await routeContractInstance.methods.addLiquidity(
                        TokenInfoArray[0][this.state.liquidityToken0].token_contract_address,
                        TokenInfoArray[0][this.state.liquidityToken1].token_contract_address,
                        parseInt(this.state.addLiquidityamount0),
                        parseInt(this.state.addLiquidityamount1),
                        this.state.minValue,
                        this.state.minValue,
                        accounts[0],
                        Math.floor(new Date().getTime()/1000) + 86400
                    ).send({
                        from:accounts[0]
                    });
                    toast.success("Successfully added liquidity!!", {
                        position: toast.POSITION.TOP_RIGHT
                      });
                    this.setState({addLiquidityLoading: false});
                    } else {
                    this.setState({addLiquidityLoading: false});
                    toast.error("Insufficeient " + this.state.liquidityToken0 + " balance or add valid value in wei!" , {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            } else {
                this.setState({addLiquidityLoading: false});
                toast.error("Insufficeient " + this.state.liquidityToken1 + " balance or add valid value in wei!" , {
                position: toast.POSITION.TOP_RIGHT
                });
            } 
        } catch (error) {
          this.setState({addLiquidityLoading: false});
          console.log(error);
        }
    };

    //** Calculate Second token quantity and price by tellor oracles **//
    async CalculateSecondTokenQuantityByTellorOracle() {

        // Fethces Price of Token pair from TELLOR ORACLES
        const oracleInstance = await getTellorOracle(web3);
        const price1 = await oracleInstance.methods.getCurrentValueFromTellorOracle(this.state.liquidityToken0).call();
        const price2 = await oracleInstance.methods.getCurrentValueFromTellorOracle(this.state.liquidityToken1).call();

        // const price1 = "1002975"; // DAI
        // const price2 = "206000"; // BAT
        // const price2 = "336600"; // ZRX

        const token0Price = parseInt(price1[1])/1000000;
        const token1Price = parseInt(price2[1])/1000000;

        const token0Quantity = (token0Price * 1e18) * (parseInt(this.state.addLiquidityamount0));

        const token1Quantity = (token0Quantity * 1e18) / (token1Price * 1e18);

        console.log(token1Quantity/1e18  +" --- "+ token1Quantity);
        this.setState({
            addLiquidityamount1: token1Quantity/1e18 
        })
    }
    
    handleLiquidityPairs =  (e, { value }) => {
        console.log(PairInfoArray[0][value])
        this.setState({ 
            liquidityToken0: PairInfoArray[0][value].token0, 
            liquidityToken1: PairInfoArray[0][value].token1
        });
    };

    handleRemovePairTokens  =  (e, { value }) => {
        this.setState({ 
            liquidityToken0: PairInfoArray[0][value].token0, 
            liquidityToken1: PairInfoArray[0][value].token1,
            removeTokenPair: value 
        });
    };

    handleInputPair  = async (e, { value }) => {
        if(this.state.liquidityToken0 != "") {  
            this.setState({ 
                addLiquidityamount0: value
            });

            // Calculate Second token quantity and price by tellor oracles
            await this.CalculateSecondTokenQuantityByTellorOracle();    

        } else {
            alert("Please select token among pair.")
        }
    };

    render() {
        return(
            <Grid.Column>
                <Label as="a" tag color="green">
                    For Liquidity Providers
                </Label>
                <Segment color="black" textAlign="center">
                    
                    <Form onSubmit={this.addLiquidity}>
                        <Form.Field>
                            <Message color="grey">
                                <Message.Header>Add Liquidity</Message.Header>
                            </Message>
                        </Form.Field>
                        <Form.Field>
                            <Dropdown
                                style={{margin: "0 auto", display: "block"}}
                                options={tagOptions}
                                onChange={this.handleLiquidityPairs} 
                                fluid selection
                                placeholder="Select Pair tokens.."
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                type = "input"
                                labelPosition="right"
                                label="token0 value in WEI"
                                value={this.state.addLiquidityamount0}
                                onChange={this.handleInputPair} 
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                type = "input"
                                labelPosition="right"
                                label="token1 value in WEI"
                                value={this.state.addLiquidityamount1}
                                onChange={event => 
                                    this.setState({
                                        addLiquidityamount1: event.target.value,
                                })}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Button 
                                color="black"
                                bsStyle="primary" 
                                type="submit"
                                loading={this.state.addLiquidityLoading}
                                style={{width:"280px", height:"40px"}}> 
                                <Icon name="add circle"></Icon>
                                Add Liquidity
                            </Button>
                        </Form.Field>
                    </Form>
                </Segment>

                <Divider></Divider>
                
                <Segment color="black" textAlign="center">
                    <Form onSubmit={this.selectMax}>
                        <Message color="grey">
                            <Message.Header>Remove Liquidity</Message.Header>
                        </Message>
                        <Form.Field>
                        <Input
                            label={
                                <Dropdown
                                    value={this.state.removeTokenPair} 
                                    options={tagOptions}
                                    onChange={this.handleRemovePairTokens} 
                                />
                            }
                            type = "input"
                            labelPosition="right"
                            placeholder="Add Pool value in wei"
                            value={this.state.removeLiquidityTokenAmount}
                            onChange={event => 
                                this.setState({
                                    removeLiquidityTokenAmount: event.target.value,
                            })}
                        />
                        </Form.Field>
                        <Form.Field>
                            <Button 
                                color="black"
                                bsStyle="primary" 
                                basic
                                type="submit"
                                style={{width:"280px", height:"40px"}}>  
                                Set Max
                            </Button>
                        </Form.Field>
                    </Form>
                    <Form onSubmit={this.removeLiquidity} style={{marginTop: "20px"}}>
                        <Form.Field>
                            <Button 
                                color="black"
                                bsStyle="primary" 
                                type="submit"
                                loading={this.state.removeLiquidityLoading}
                                style={{width:"280px", height:"40px"}}>  
                                <Icon name="remove circle"></Icon>
                                Remove Liquidity
                            </Button>
                        </Form.Field>
                    </Form>
                </Segment>
            </Grid.Column>

        );
    }

};

export default Liquidity; 