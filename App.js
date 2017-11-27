/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  BackHandler
} from 'react-native';

import IntroCard from './src/IntroCard';
import WebCard from './src/WebCard';

const instructions = Platform.select({
  ios: '',
  android: '',
});

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      currentCard: undefined,
      input: undefined
    }
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onMenuPress.bind(this));
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onMenuPress.bind(this));
  }
  onMenuPress() {
    this.setState({currentCard: undefined});
    return true;
  }
  onButtonPress(Card, input) {
    this.setState({currentCard: Card, input: input});
  } // end onButtonPress

  render() {
    /*<View style={styles.header}>
          <TouchableOpacity onPress={this.onMenuPress.bind(this)}>
            <Image style={styles.menuIcon} source={require('./assets/icon-menu.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Draw</Text>
        </View>*/
    return (
      <View style={styles.container}>        
        <View style={styles.body}>
          {this.renderContent()}
        </View>

      </View>
    );
  } // end render

  renderContent() {
    // render Card
    if (this.state.currentCard) {
      //console.log('render Card')
      const Card = this.state.currentCard;
      return <Card input={this.state.input}/>;
    }
    // No Card, render Card List
    return (
      <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuItem} 
          onPress={this.onButtonPress.bind(this, IntroCard, {name: 'Bob'})}>
          <Text style={styles.button2}>IntroCard Bob</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} 
          onPress={this.onButtonPress.bind(this, IntroCard, {name: 'Chris'})}>
          <Text style={styles.button}>IntroCard Chris</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} 
          onPress={this.onButtonPress.bind(this, WebCard, undefined)}>
          <Text style={styles.button}>WebCard</Text>
        </TouchableOpacity> 
      </View>
    );
  } // end renderContent
} // end App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
  header: {
    height: 60,
    paddingTop: 0,
    paddingLeft: 20,
    flexDirection: 'row',
    backgroundColor: '#0b5ea5',
    alignItems: 'center',
    zIndex: 1001
  },
  body: {
    flex: 1,
    zIndex: 1000
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingLeft: 0,
    backgroundColor: '#1979ff',
  },
  menuItem: {
    alignItems: 'center',
    margin: 30
  },
  menuIcon: {
    width: 30,
    height: 30
  },
  headerTitle: {
    marginLeft: 30,
    color: 'white',
    fontSize: 20
  },
  button: {
    color: '#e0e0e0',
    fontSize: 20,
    marginBottom: 24
  },
  button2: {
    color: '#F09B95',
    fontSize: 20,
    marginBottom: 24
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
