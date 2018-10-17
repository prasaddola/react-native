import React, {Component} from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    AsyncStorage,
    Text,
    Picker
} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import Result from './result';
class Ranking extends React.Component {
    static navigationOptions = {
        title: 'SUBMIT RANKINGS'
    };
    constructor(props) {
        super(props);
        this.state = {
            dataFetched: false,
            dishes: [],
            submittedDishes: [],
            firstRank: null,
            secondRank: null,
            thirdRank: null,
            firstRankIndex: 0,
            secondRankIndex: 0,
            thirdRankIndex: 0,
            showRankError: false,
            rankSubmitted: false,
            resultError: false
        };
        this.loggedInUser = null
    }
    getItems(pickerIndex) {
        var items = [];
        var region = this.state.dishes;
        for (i = 0; i < region.length; i++) {
            items.push(<Picker.Item key={region[i].id} value={region[i].name} label={region[i].name}/>);
        }
        return items;
    }
    getSubmittedRanks() {
        var items = [];
        var region = this.state.submittedDishes;
        for (i = 0; i < region.length; i++) {
            items.push(<Text key={i} style={{
                    color: 'green',
                    fontSize: 20
                }}>{
                    'Rank' + (
                    i + 1) + ' : ' + region[i]
                }</Text>);
        }
        return items;
    }
    seeResult = () => {
        if (this.state.submittedDishes.length) {
            this.setState({resultError: false});
            this.props.navigation.navigate('Result');
        } else {
            this.setState({resultError: true});
        }
    }
    rankSubmit = () => {
        if ((this.state.firstRankIndex === this.state.secondRankIndex) || (this.state.firstRankIndex === this.state.thirdRankIndex) || (this.state.secondRankIndex === this.state.thirdRankIndex)) {
            this.setState({showRankError: true});
            return;
        }
        this.setState({showRankError: false});
        var firstiD = (this.state.dishes[this.state.firstRankIndex].name);
        var secondiD = (this.state.dishes[this.state.secondRankIndex].name);
        var thirdiD = (this.state.dishes[this.state.thirdRankIndex].name);
        console.log('present submissions', firstiD, secondiD, thirdiD);
        AsyncStorage.getItem('userInfo').then((data) => {
            var userData = JSON.parse(data);
            if (userData[this.loggedInUser].rankSubmissions && userData[this.loggedInUser].rankSubmissions.length) {
                var firstR = userData[this.loggedInUser].rankSubmissions[0];
                var secondR = userData[this.loggedInUser].rankSubmissions[1];
                var thirdR = userData[this.loggedInUser].rankSubmissions[2];
                console.log('before submitting', userData);
                // reducing marks for already submitted as new dishes are updated
                for (var key in userData) {
                    if (key !== this.loggedInUser && userData[key].dishes) {
                        userData[key].dishes.forEach((item) => {
                            if (item.name === firstR) {
                                item.score -= 30;
                            } else if (item.name === secondR) {
                                item.score -= 20;
                            } else if (item.name === thirdR) {
                                item.score -= 10;
                            } else {
                                console.log('this item not in the selected list');
                            }
                        })
                    }
                }
                console.log('reducing marks', userData);
            }
            userData[this.loggedInUser].rankSubmissions = [firstiD, secondiD, thirdiD];
            for (var key in userData) {
                if (key !== this.loggedInUser && userData[key].dishes) {
                    userData[key].dishes.forEach((item) => {
                        if (item.name === firstiD) {
                            item.score += 30;
                        } else if (item.name === secondiD) {
                            item.score += 20;
                        } else if (item.name === thirdiD) {
                            item.score += 10;
                        } else {
                            console.log('this item not in the selected list');
                        }
                    })
                }
            }
            console.log('adding marks', userData);
            AsyncStorage.setItem('userInfo', data, () => {
                AsyncStorage.mergeItem('userInfo', JSON.stringify(userData), () => {
                    this.setState({resultError: false});
                    this.props.navigation.navigate('Result');
                });
            });
        });
    }
    componentDidMount() {
        var dishes = [];
        AsyncStorage.getItem('userInfo').then((data) => {
            var userData = JSON.parse(data);
            Object.keys(userData).forEach((key) => {
                if (key !== this.loggedInUser) {
                    if (userData[key].dishes) {
                        userData[key].dishes.forEach((dish) => {
                            dishes.push(dish);
                        });
                    }
                }
            });
            // removing duplicates from submitted dishes
            var obj = {};
            for (var i = 0, len = dishes.length; i < len; i++) {
                obj[dishes[i]['name']] = dishes[i];
            }
            dishes = new Array();
            for (var key in obj) {
                dishes.push(obj[key]);
            }

            if (userData[this.loggedInUser].rankSubmissions && userData[this.loggedInUser].rankSubmissions.length) {
                this.setState({rankSubmitted: true, submittedDishes: userData[this.loggedInUser].rankSubmissions});
            }

            this.setState({dataFetched: true, dishes: dishes});
        });
    }
    render() {
        this.loggedInUser = this.props.screenProps;
        return (<View style={{
                flex: 1,
                justifyContent: 'flex-start',
                marginTop: 10,
                marginHorizontal: 20,
                fontSize: 15
            }}>
            {
                this.state.dataFetched
                    ? <View>
                            {
                                this.state.rankSubmitted
                                    ? <View >
                                            <Text style={{fontSize: 15}}>Your Submissions</Text>
                                            {this.getSubmittedRanks()}
                                            <Text>{"\n"}</Text>
                                        </View>
                                    : <Text>{''}</Text>
                            }
                            <Text style={{
                                    color: 'blue',
                                    fontSize: 20
                                }}>Rank-1:</Text>
                            <Picker style={{
                                    height: 50,
                                    width: 200
                                }} selectedValue={this.state.firstRank} onValueChange={(itemValue, itemIndex) => {
                                    if ((itemIndex === this.state.secondRankIndex) || (itemIndex === this.state.thirdRankIndex)) {
                                        this.setState({showRankError: true});
                                        return
                                    };
                                    this.setState({firstRank: itemValue, firstRankIndex: itemIndex});
                                }}>
                                {this.getItems(1)}
                            </Picker>
                            <Text style={{
                                    color: 'blue',
                                    fontSize: 20
                                }}>Rank-2:</Text>
                            <Picker style={{
                                    height: 50,
                                    width: 200
                                }} selectedValue={this.state.secondRank} onValueChange={(itemValue, itemIndex) => {
                                    if ((itemIndex === this.state.firstRankIndex) || (itemIndex === this.state.thirdRankIndex)) {
                                        this.setState({showRankError: true});
                                        return;
                                    }
                                    this.setState({secondRank: itemValue, secondRankIndex: itemIndex});
                                }}>
                                {this.getItems(2)}
                            </Picker>
                            <Text style={{
                                    color: 'blue',
                                    fontSize: 20
                                }}>Rank-3:</Text>
                            <Picker style={{
                                    height: 50,
                                    width: 200
                                }} selectedValue={this.state.thirdRank} onValueChange={(itemValue, itemIndex) => {
                                    if ((itemIndex === this.state.firstRankIndex) || (itemIndex === this.state.secondRankIndex)) {
                                        this.setState({showRankError: true});
                                        return;
                                    };
                                    this.setState({thirdRank: itemValue, thirdRankIndex: itemIndex});
                                }}>
                                {this.getItems(3)}
                            </Picker>
                            <Text style={{
                                    'color' : 'red',
                                    'margin' : 10
                                }}>{
                                    this.state.showRankError
                                        ? 'NOTE: You can\'t select same item for two different ranks'
                                        : ''
                                }</Text>
                            <Button style={{
                                    backgroundColor: 'green',
                                    margin: 15,
                                    height: 40
                                }} title="submit Ranks" color="#841584" onPress={this.rankSubmit}/>
                            <Text>{'\n'}</Text>
                            <Button style={{
                                    backgroundColor: 'green',
                                    margin: 15,
                                    height: 40
                                }} title="see results" color="#841584" onPress={this.seeResult}/>
                            <Text style={{
                                    'color' : 'red',
                                    'margin' : 10
                                }}>{
                                    this.state.resultError
                                        ? 'Submit dishes to see results'
                                        : ''
                                }</Text>
                        </View>
                    : <Text>{''}</Text>
            }
        </View>);
    }
}

const ResultStack = createStackNavigator({Ranking: Ranking, Result: Result, initialRouteName: 'Ranking'});
export default class Rankings extends React.Component {
    render() {
        const {navigation} = this.props;
        let loggedInUser = navigation.getParam('user', '');
        return <ResultStack screenProps={loggedInUser}/>;
    }
}
