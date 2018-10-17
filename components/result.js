import React, {Component} from 'react';
import {View, Text, AsyncStorage, StyleSheet} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';

export default class Result extends React.Component {
    static navigationOptions = {
        title: 'RESULTS'
    };
    constructor(props) {
        super(props);
        this.state = {
            showData: false,
            dishes: [],
            rankSubmitted: false
        };
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
    componentDidMount() {
        AsyncStorage.getItem('userInfo').then((data) => {
            var dishes = {};
            var userData = JSON.parse(data);
            var results = [];
            Object.keys(userData).forEach((key) => {
                if(userData[key].dishes) {
                    userData[key].dishes.forEach((dish) => {
                        dishes[dish.name] = (
                            dishes[dish.name]
                            ? dishes[dish.name]
                            : 0) + dish.score;
                        });
                }
            });
            console.log('results', dishes);
            Object.keys(dishes).forEach((key) => {
                results.push([
                    key, dishes[key]
                ]);
            });
            results.sort(function(a, b) {
                return b[1] - a[1]
            });
            if (userData[this.loggedInUser].rankSubmissions && userData[this.loggedInUser].rankSubmissions.length) {
                this.setState({rankSubmitted: true, submittedDishes: userData[this.loggedInUser].rankSubmissions});
            }
            this.setState({
                dishes: results
            }, () => {
                this.setState({showData: true});
            })
        });
    }
    render() {
        this.loggedInUser = this.props.screenProps;
        return (<View style={{
                flex: 1,
                justifyContent: 'flex-start',
                marginTop: 40,
                marginHorizontal: 20
            }}>{
                this.state.showData
                    ? <View style={styles.container}>
                        {
                            this.state.rankSubmitted
                                ? <View >
                                        <Text style={{fontSize: 15}}>Your Submissions</Text>
                                        {this.getSubmittedRanks()}
                                        <Text>{"\n"}</Text>
                                    </View>
                                : <Text>{''}</Text>
                        }
                            <Table borderStyle={{
                                    borderWidth: 2,
                                    borderColor: '#c8e1ff'
                                }}>
                                <Row data={['Dish', 'Score']} style={styles.head} textStyle={styles.text}/>
                                <Rows data={this.state.dishes} textStyle={styles.text}/>
                            </Table>
                        </View>
                    : <Text>{''}</Text>
            }</View>);
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: '#fff'
    },
    head: {
        height: 40,
        backgroundColor: '#f1f8ff'
    },
    text: {
        margin: 6
    }
});
