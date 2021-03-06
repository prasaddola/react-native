import React, {Component} from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    AsyncStorage,
    Text
} from 'react-native';
export default class DishSubmit extends React.Component {
    static navigationOptions = {
        title: 'SUBMIT DISHES'
    };
    constructor(props) {
        super(props);
        this.state = {
            dish1: null,
            dish2: null,
            showErrorMsg: false,
            user: null,
            showThanks: false,
            thanksMessage: 'Thnaks for submitting',
            submittedDishesMsg: 'Dish Names',
            showRankings: false
        };
        this.loggedInUser = null
    }
    dishEntry = () => {
        let user = this.loggedInUser
        let updatedScore1 = 0;
        let updatedScore2 = 0;
        if (!this.state.dish1 || !this.state.dish2 || (this.state.dish1 === this.state.dish2)) {
            this.setState({showErrorMsg: true});
            return;
        } else {
            AsyncStorage.getItem('userInfo').then((data) => {
                var userData = JSON.parse(data);
                var dishesAvailable = false;
                Object.keys(userData).forEach((key) => {
                    if (userData[key].dishes) {
                        dishesAvailable = true;
                    }
                });
                if(userData[user].dishes) {
                    if (userData[user].dishes[0].name === this.state.dish1) {
                        updatedScore1 = userData[user].dishes[0].score;
                    }
                    if (userData[user].dishes[1].name === this.state.dish2) {
                        updatedScore2 = userData[user].dishes[1].score;
                    }
                }
                userData[user].dishes = [];
                userData[user].dishes.push({
                    'name': this.state.dish1,
                    'id': user + '1',
                    'score': updatedScore1
                });
                userData[user].dishes.push({
                    'name': this.state.dish2,
                    'id': user + '2',
                    'score': updatedScore2
                });
                AsyncStorage.setItem('userInfo', data, () => {
                    AsyncStorage.mergeItem('userInfo', JSON.stringify(userData), () => {
                        this.setState({showThanks: true});
                        if (dishesAvailable) {
                            this.props.navigation.navigate('Rank');
                        }
                    });
                });
            });
        }
    }
    showRankPage = () => {
        this.props.navigation.navigate('Rank');
    }
    componentDidMount() {
        AsyncStorage.getItem('userInfo').then((data) => {
            var userData = JSON.parse(data);
            if (userData[this.loggedInUser].dishes && userData[this.loggedInUser].dishes.length) {
                this.setState({
                    showRankings: true,
                    submittedDishesMsg: 'Please edit and re-submit if you want to update your submissions',
                    dish1: userData[this.loggedInUser].dishes[0].name,
                    dish2: userData[this.loggedInUser].dishes[1].name
                });
            }
        });
    }

    render() {
        this.loggedInUser = this.props.screenProps;
        return (<View style={{
                flex: 1,
                justifyContent: 'flex-start',
                marginTop: 40,
                marginHorizontal: 20,
                overflow: 'scroll'
            }}>{
                !this.state.showThanks
                    ? <View>
                            <Text style={{
                                    margin: 15,
                                    fontSize: 20
                                }}>{this.state.submittedDishesMsg}</Text>
                            <TextInput underlineColorAndroid='transparent' style={{
                                    margin: 15,
                                    height: 40,
                                    borderColor: '#7a42f4',
                                    borderWidth: 2
                                }} onChangeText={(text) => this.setState({dish1: text})} value={this.state.dish1}/>
                            <TextInput underlineColorAndroid='transparent' style={{
                                    margin: 15,
                                    height: 40,
                                    borderColor: '#7a42f4',
                                    borderWidth: 2
                                }} onChangeText={(text) => this.setState({dish2: text})} value={this.state.dish2}/>

                            <Button style={{
                                                backgroundColor: 'green',
                                                margin: 15,
                                                height: 40
                                            }} title="submit dish" color="#841584" onPress={this.dishEntry}/>

                            <Text style={{
                                    'color' : 'red'
                                }}>{
                                    this.state.showErrorMsg
                                        ? 'please submit two different dishes'
                                        : <Text></Text>
                                }
                            </Text>
                            {
                                this.state.showRankings
                                    ? <Button title="See Rankings" color="#841584" onPress={this.showRankPage}/>
                                    : <Text>{''}</Text>
                            }
                        </View>
                    : <Text style={{
                                'color' : 'red'
                            }}>{this.state.thanksMessage}
                        </Text>
            }
        </View>);
    }
}
