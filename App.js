import React, {Component} from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    AsyncStorage,
    Text
} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import Pool from './components/pool'
class Login extends React.Component {

    static navigationOptions = {
        title: 'LOGIN'
    };
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            passWord: '',
            showErrorMsg: false,
            loggedIn: false
        };
        var userInfo = {
            'ram': {
                userName: 'ram',
                passWord: 'ram123'
            },
            'laxman': {
                userName: 'laxman',
                passWord: 'laxman123'
            },
            'sita': {
                userName: 'sita',
                passWord: 'sita123'
            },
            'bharat': {
                userName: 'bharat',
                passWord: 'bharat123'
            }
        }
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
    login = () => {
        var userName = this.state.userName;
        var passWord = this.state.passWord;
        var userFound = false;
        AsyncStorage.getItem('userInfo').then((data) => {
            var userData = JSON.parse(data);
            if (Object.keys(userData).indexOf(userName) > -1 && userData[userName].passWord === passWord) {
                this.setState({showErrorMsg: false, loggedIn: true});
                this.props.navigation.navigate('Pool', {user: userName});
                console.log('user found');
                console.log('userData login', userData);
            } else {
                this.setState({showErrorMsg: true});
                console.log('user not found');
            }
        });
    };
    logout = () => {
        this.setState({loggedIn: false, userName: '', passWord: ''});
    };
    render() {
        return (<View style={styles.container}>{
                !this.state.loggedIn
                    ? <View>
                            <TextInput underlineColorAndroid='transparent' style={{
                                    margin: 15,
                                    height: 40,
                                    borderColor: '#7a42f4',
                                    borderWidth: 2
                                }} onChangeText={(text) => this.setState({userName: text})} value={this.state.text}/>
                            <TextInput underlineColorAndroid='transparent' style={{
                                    margin: 15,
                                    height: 40,
                                    borderColor: '#7a42f4',
                                    borderWidth: 2
                                }} onChangeText={(text) => this.setState({passWord: text})} value={this.state.text}/>
                            <Button style={{
                                    margin: 15,
                                    height: 40
                                }} title="Sign In" color="blue" onPress={this.login}/>
                            <Text style={{
                                    'color' : 'red'
                                }}>{
                                    this.state.showErrorMsg
                                        ? 'enter valid details'
                                        : ''
                                }</Text>
                        </View>
                    : <View>
                            <Text style={{
                                    'marginBottom' : 20,
                                    fontSize: 25
                                }}>{'Username : ' + this.state.userName}</Text>
                            <Button style={{
                                    marginBottom: 15,
                                    height: 40
                                }} title="Pool Entries" color="#841584" onPress={() => {
                                    this.props.navigation.navigate('Pool', {user: this.state.userName});
                                }}/>
                            <Text>
                                {"\n"}
                            </Text>
                            <Button style={{
                                    margin: 15,
                                    height: 40
                                }} title="Logout" color="red" onPress={this.logout}/>

                        </View>
            }</View>);
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 40,
        marginHorizontal: 20
    }
});
const RootStack = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            title: 'LOGIN'
        }
    },
    Pool: {
        screen: Pool
    },
    initialRouteName: 'Login'
});
export default class App extends React.Component {
    render() {
        return <RootStack/>;
    }
}
