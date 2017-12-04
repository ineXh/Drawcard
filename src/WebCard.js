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
  height: Dimensions.get('window').height - 75
}

window.myvar = 123
const HTMLC = '<div id="myContent">Your HTML content 12</div>'
const jsCode = "document.querySelector('#myContent').style.backgroundColor = '#7294cc';"
export default class WebCard extends Component {
  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(Screen.height-100);
    this.state = {number: myvar};

    // Toggle the state every second
    /*this.myInterval = setInterval(() => {
      this.setState(previousState => {
        return { number: previousState.number+1 };
      });
    }, 1000);*/
  } // end constructor

  componentWillUnmount(){
    //clearInterval(this.myInterval);
    this.setState({number: myvar++})
  }

  sayHi(){
    console.log('Hi from WebCard')
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
       //console.log(response)
       // trigger success callback
       msgData.isSuccessful = true;
       msgData.args = [response];
       //this.myWebView.postMessage(msgData)
       //console.log(JSON.stringify(msgData))
       this.myWebView.postMessage(JSON.stringify(msgData))
  }

  render() {
    console.log('render WebCard')
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
          javaScriptEnabledAndroid={true}
          style={{marginTop: 20}}
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
            snapPoints={[{y: Screen.height/2}, {y: Screen.height+5}]}
            boundaries={{top: -300}}
            initialPosition={{y: Screen.height+5}}
            animatedValueY={this._deltaY}>
            <View style={styles.panel}>
              <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
              </View>
              <Text style={styles.panelTitle}>San Francisco Airport</Text>
              <Text style={styles.panelSubtitle}>International Airport - 10 miles away</Text>
              <View style={styles.panelButton}>
                <Text style={styles.panelButtonTitle}>Directions</Text>
              </View>
              <View style={styles.panelButton}>
                <Text style={styles.panelButtonTitle}>Search Nearby</Text>
              </View>
            </View>
          </Interactable.View>
        </View>
      </View>
    );
  }
}
/*
        */


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