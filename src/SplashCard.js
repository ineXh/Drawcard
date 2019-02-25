/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  Easing
} from 'react-native'
const logo = require('./../assets/pixel_cow_512.png')
const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

export default class SplashCard extends Component {
  constructor () {
    super()
    this.state = {
      animatedValue: new Animated.Value(0), 
    };
  }
  componentDidMount () {
    this.animate()
  }
  animate () {
    //console.log(this.props.input.finishCallBack)
    let next = this.props.input.finishCallBack;
    if(next == undefined) next = this.animate.bind(this);
    this.state.animatedValue.setValue(0)
    Animated.timing(
      this.state.animatedValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }
    //).start(() => this.animate())
    ).start(() => next.call())      
  }
  render () {
    const imageSize = this.state.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Screen.width/5, Screen.width/4]
    })
    const opacityValue = this.state.animatedValue.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [0, 1, 0.7]
    })
    const textSize = this.state.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [18, 32, 18]
    })

    return (
      <View style={styles.container}>
        <Animated.Image
          style={{ opacity: opacityValue, width: Screen.width/4, height: Screen.width/4 }}
          source={logo}/>
        <Animated.Text
          style={{
            fontSize: 24,
            marginTop: 10,
            opacity: opacityValue,
            color: 'black'}} >
            Pixel Cow
        </Animated.Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff9f9',
  }
})