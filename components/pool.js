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
export default createBottomTabNavigator({
    Dish: DishSubmit,
    Rank: Rankings
});
