import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  WebView,
  Dimensions,
  Animated, TouchableOpacity
} from 'react-native';

import Interactable from 'react-native-interactable';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height-50
}

const airport = require('./../assets/airport-photo.jpg')
//const imgLink = require('http://cdn.osxdaily.com/wp-content/uploads/2015/05/howto-page-up-page-down-mac-keyboard-300x292.jpg')
window.myvar = 123
const HTMLC = '<div id="myContent">Your HTML content 12</div>'
const jsCode = "document.querySelector('#myContent').style.backgroundColor = '#7294cc';"
export default class DrawCard extends Component {
  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(Screen.height-100);
    this.state = {
      number: myvar, 
      showImg: false,
      img: airport,
      photos: [],
      drawings: [],
      index: null,
    };

  } // end constructor

  componentWillUnmount(){
    this.setState({number: myvar++})
  }
  onPress(name) {
    //alert(`Button ${name} pressed`);
    let msgData = {};
    msgData.targetFunc = "clearImage"
    msgData.targetFuncData = "input data 101"
    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  showPress(name) {
    //alert(`Button ${name} pressed`);
    let msgData = {};
    msgData.targetFunc = "showImage"
    msgData.targetFuncData = "input data 101"
    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  sayHi(input){
    console.log('Hi from DrawCard')
    //console.log(input.data.mydata)
    //imageUri = "data:image/png;base64," + input.data.mydata;
    //uri = {uri: imageUri}
    //this.setState({showImg: true,//!this.state.showImg,
      //img:  imageUri//input.data.mydata
    //})
    //{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}
    //var source={uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='};
    //this.state.drawings.push(source);
    var source = {uri: input.data.mydata};
    this.state.drawings.push(source);
    this.setState({number: myvar++})
    return 'return from Hi'
  }

  onWebViewMessage(event) {
       console.log('onWebViewMessage')
       //console.log(this.myWebView)
       //console.log(this.refs)
       //console.log(event)
       //return;
       // post back reply as soon as possible to enable sending the next message
       this.myWebView.postMessage(event.nativeEvent.data);
 
       let msgData;
       try {
           msgData = JSON.parse(event.nativeEvent.data);
       }
       catch(err) {
           console.warn(err);
           return;
       }
      
       // invoke target function
       //console.log(msgData.data)
       //console.log(msgData.targetFunc)
       const response = this[msgData.targetFunc].apply(this, [msgData]);
       msgData.targetFunc = null;
       //console.log(response)
       // trigger success callback
       msgData.isSuccessful = true;
       msgData.args = [response];
       //this.myWebView.postMessage(msgData)
       //console.log(JSON.stringify(msgData))
       this.myWebView.postMessage(JSON.stringify(msgData))
  }

  render() {
    console.log('render DrawCard')
    //ref={webview => { this.myWebView = webview; }}
    //ref={(ref) => { this.myWebView = ref; }}
    //ref="myWebView"
    var code = "var para = document.createElement('p');para.appendChild(document.createTextNode('" + this.state.number + "'));document.body.appendChild(para);";
    return (
      <View style={{flex: 1}}>
        <WebView
          style={{flex: 1}}
          ref={webview => { this.myWebView = webview; }}
          source={require('./draw.html')}
          //source= {{html: HTMLC}}
          injectedJavaScript={code}
          javaScriptEnabled={true}
          javaScriptEnabledAndroid={true}
          scrollEnabled={false}
          style={{marginTop: 0}}
          onMessage={this.onWebViewMessage.bind(this)}/>
        
        <View style={styles.panelContainer} pointerEvents={'box-none'}>
          <Animated.View
            pointerEvents={'box-none'}
            style={[styles.panelContainer, {
            backgroundColor: 'black',
            opacity: this._deltaY.interpolate({
              inputRange: [0, Screen.height-100],
              outputRange: [0.5, 0],
              extrapolateRight: 'clamp'
            })
          }]} />
          <Interactable.View
            verticalOnly={true}
            snapPoints={[{y: Screen.height/4}, {y: Screen.height-100}]}
            boundaries={{top: -300}}
            initialPosition={{y: Screen.height-100}}
            animatedValueY={this._deltaY}>
            <View style={styles.panel}>
              <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
              </View>
              <Text style={styles.panelTitle}>Slider</Text>
              <View style={styles.panelButton}>
                <TouchableOpacity onPress={this.onPress.bind(this, 'button1')}>
                  <Text style={styles.panelButtonTitle}>Clear Image</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.panelButton}>
                <TouchableOpacity onPress={this.showPress.bind(this, 'button2')}>
                  <Text style={styles.panelButtonTitle}>Show Image</Text>
                </TouchableOpacity>
              </View>
              <Image
                style={{width: 50, height: 50}}
                source={{uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'}}
              />
              {
                this.state.drawings.map((d, index) =>{
                  return(
                      <Image style={styles.photo} key={index} source={d} />
                    )
                })
              }
            </View>
          </Interactable.View>
        </View>
      </View>
    );
  } // end render
  renderPhoto(){
    if(this.state.showImg)
      //console.log(this.state.img)
      return(
        <Image style={styles.photo} source={this.state.img} />
      )
  }
  renderDrawings(){
    var img = this.state.img;
    //this.state.drawings.map((d, index) =>{
      //console.log('renderDrawings ' + index)
      //console.log(d)
      return(
          <Image style={styles.photo} source={img} />
          
        )
    //})
  }
}
/*
        */
// {this.renderDrawings()}   
// <Image style={styles.photo} key={index} source={d} />

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  panel: {
    height: Screen.height + 300,
    padding: 20,
    backgroundColor: '#f7f5eee8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0.4
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10
  },
  panelTitle: {
    fontSize: 27,
    height: 35
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10
  },
  panelButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#318bfb',
    alignItems: 'center',
    marginVertical: 10
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white'
  },
  photo: {
    width: Screen.width-40,
    height: 225,
    marginTop: 30
  },
  map: {
    height: Screen.height,
    width: Screen.width
  }
});