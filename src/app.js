/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';

export default class DrawApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCard: undefined,
      input: undefined
    }
  }
  
  onMenuPress() {
    this.setState({currentCard: undefined});
  }

  onButtonPress(Card, input) {
    this.setState({currentCard: Card, input: input});
  } // end onButtonPress

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Nativeeee!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
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
      <ScrollView style={styles.menuContainer}>
        
      </ScrollView>
    );
  } // end renderContent
} // end AwesomeProject2

/*

  
  */
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
    paddingTop: 10,
    paddingLeft: 30,
    backgroundColor: '#3c7eb7'
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


AppRegistry.registerComponent('DrawApp', () => DrawApp);