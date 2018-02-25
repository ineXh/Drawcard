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
import DrawCard from './src/DrawCard';
//import ChatHeads from './src/ChatHeads';
import FreeSketchCard from './src/FreeSketchCard';
import FetchCard from './src/FetchCard';
import FetchDrawCard from './src/FetchDrawCard';
import GalleryCard from './src/GalleryCard';
import SplashCard from './src/SplashCard';
import HeaderComponent from './src/HeaderComponent';

const instructions = Platform.select({
  ios: '',
  android: '',
});

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      currentCard: undefined,
      input: undefined,
      currentHeader: 'Gallery'
    }
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onMenuPress.bind(this));
    this.setState({
      currentCard: SplashCard,
      input: {finishCallBack: this.onMenuPress.bind(this)}
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onMenuPress.bind(this));
  }
  goGallery(){
    this.setState({currentCard: GalleryCard});
    return true;
  }
  onMenuPress() {
    this.setState({currentCard: undefined});
    return true;
  }
  onButtonPress(Card, input) {
    this.setState({currentCard: Card, input: input});
  } // end onButtonPress

  render() {    
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          {this.renderContent()}
        </View>
      </View>
    );
  } // end render
  renderHeader(){
    if(this.state.currentCard == SplashCard) return null;
    if(this.state.currentCard == FetchDrawCard) return null;
    return(
      <View style={styles.header}>
              <TouchableOpacity onPress={this.onMenuPress.bind(this)}>
                <Image style={styles.menuIcon} source={require('./assets/cow_emoji.png')} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{this.state.currentHeader}</Text>
        </View>
      );
  }
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
          onPress={this.onButtonPress.bind(this, GalleryCard, undefined)}>
          <Text style={styles.button}>Pixel Draw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}
          onPress={this.onButtonPress.bind(this, DrawCard, undefined)}>
          <Text style={styles.button}>Free Sketch</Text>
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
    backgroundColor: '#f99595',
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
    paddingTop: 0,
    paddingLeft: 0,
    backgroundColor: '#fff9f9',
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
    color: 'black',
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
