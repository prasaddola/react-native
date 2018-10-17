import React, {Component} from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    AsyncStorage,
    Text
} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation';
import DishSubmit from './dishSubmit';
import Rankings from './giveRankings';

const BottomStack = createBottomTabNavigator({
    Dish: DishSubmit,
    Rank: Rankings
});

export default class Pool extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.user.toUpperCase()
    });
    render() {
        const {navigation} = this.props;
        let loggedInUser = navigation.getParam('user', '');
        return <BottomStack screenProps={loggedInUser}/>;
    }
}
