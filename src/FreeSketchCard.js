import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  WebView,
  Slider,
  Dimensions,
  Animated, TouchableOpacity
} from 'react-native';

import Interactable from 'react-native-interactable';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height-50
}
const circle = require('./../assets/circle.png')
const colors = [
0  , 0  , 0  ,
127, 127, 127,
136, 0  , 21 ,
255, 255, 255,
195, 195, 195,
255, 128, 128,
255, 255, 128,
128, 255, 128,
0  , 255, 128,
128, 255, 255,
0  , 128, 255,
255, 0  , 0  ,
255, 255, 0  ,
128, 255, 0  ,
0  , 255, 64 ,
0  , 255, 255,
0  , 128, 192,
128, 64 , 64 ,
255, 128, 64 ,
0  , 255, 0  ,
0  , 128, 128,
0  , 64 , 128,
128, 128, 255,
128, 64 , 64 ,
255, 128, 64 ,
0  , 255, 0  ,
0  , 128, 128,
0  , 64 , 128,
128, 128, 255
];

export default class FreeSketchCard extends Component {
  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(Screen.height-100);
    this.state = {
      colorPicks: [],
      damping: 0.5,
    };

  } // end constructor
  componentDidMount(){
    this.fillColor();
  }
  componentWillUnmount(){
  }
  fillColor(){
    //colorPicks: ['hsl(180, 50%, 50%)','blue','red','blue'],
    //rgb(255, 255, 255)
    var colorPicks = [];
    for(var i = 0; i < colors.length; i=i+3){
      colorPicks.push('rgb(' + colors[i] + ',' + colors[i+1] + ',' + colors[i+2] + ')')
    }
    //console.log(colorPicks)
    this.setState({colorPicks: colorPicks})
  }
  onPressNewImage(name) {
    //alert(`Button ${name} pressed`);
    let msgData = {};
    msgData.targetFunc = "clearImage"
    msgData.targetFuncData = "input data 101"
    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  sayHi(input){
    //console.log('Hi from FreeSketchCard')
    return 'return from Hi'
  }

  onWebViewMessage(event) {
       console.log('onWebViewMessage')

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
       const response = this[msgData.targetFunc].apply(this, [msgData]);
       msgData.targetFunc = null;

       // trigger success callback
       msgData.isSuccessful = true;
       msgData.args = [response];

       this.myWebView.postMessage(JSON.stringify(msgData))
  }

  render() {
    var code = "var para = document.createElement('p');para.appendChild(document.createTextNode('" + 1 + "'));document.body.appendChild(para);";
    return (
      <View style={{flex: 1}}>
        <WebView
          style={{flex: 1}}
          ref={webview => { this.myWebView = webview; }}
          source={require('./FreeSketch.html')}
          injectedJavaScript={code}
          javaScriptEnabled={true}
          javaScriptEnabledAndroid={true}
          scrollEnabled={false}
          style={{marginTop: 0}}
          onMessage={this.onWebViewMessage.bind(this)}/>

      </View>
    );
  } // end render
  renderColorPicks(){
    return(
      <View style={styles.colorPickMenu}>
      {
        this.state.colorPicks.map((d, index) =>{
              return(
                  <Image style={{ margin: 5,
                                  width: Screen.width/8,
                                  height: Screen.width/8,
                                  alignItems: 'center',
                                  borderWidth: 3,
                                  borderColor: 'black',
                                  borderRadius: Screen.width/16,
                                  tintColor: this.state.colorPicks[index]}} 
                    key={index} source={circle} />
                )
            })
      }
      </View>
    );
  } // end renderColorPicks
} // end FreeSketchCard

/*
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
              {this.renderColorPicks()}
              <Text style={styles.panelTitle}>Slider</Text>
              <Slider
                key='damping'
                style={styles.slider}
                value={this.state.damping}
                minimumValue={0.1}
                maximumValue={0.6}
                minimumTrackTintColor={'#007AFF'}
                maximumTrackTintColor={'white'}
                thumbTintColor={'white'}
                onSlidingComplete={(value) => this.setState({damping: value})}
              />
              <View style={styles.panelButton}>
                <TouchableOpacity onPress={this.onPressNewImage.bind(this)}>
                  <Text style={styles.panelButtonTitle}>New Drawing</Text>
                </TouchableOpacity>
              </View>

            </View>
          </Interactable.View>
        </View>
        
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
  },
  colorPickMenu:{
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});