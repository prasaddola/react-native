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
            dishes: []
        };
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
            this.setState({
                dishes: results
            }, () => {
                this.setState({showData: true});
            })
        });
    }
    render() {
        return (<View style={{
                flex: 1,
                justifyContent: 'flex-start',
                marginTop: 40,
                marginHorizontal: 20
            }}>{
                this.state.showData
                    ? <View style={styles.container}>
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
