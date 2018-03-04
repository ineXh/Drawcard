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
//0  , 0  , 0  ,
255, 0  , 0  ,
0  , 255, 0  ,
0  , 0  , 255,
/*
127, 127, 127,
136, 0  , 21 ,
255, 255, 255,
195, 195, 195,
255, 128, 128,
/*255, 255, 128,
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
128, 128, 255*/
];

export default class FreeSketchCard extends Component {
  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(Screen.height-100);
    this.state = {
      colorPicks: [],
      red: 0,
      green: 0,
      blue: 0,
      color: 'rgb(0, 0, 0)',
      damping: 1.0,
      stroke: 15
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
  sendColor(){
    this.setState({color: 'rgb(' + 
      this.state.red + ', ' + this.state.green + ', ' + this.state.blue + ')'})
    let msgData = {};
    msgData.targetFunc = "changeColor"
    msgData.targetFuncData = this.state.red + ', ' + this.state.green + ', ' + this.state.blue;
    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  sendStroke(){
    let msgData = {};
    msgData.targetFunc = "changeStroke"
    msgData.targetFuncData = this.state.stroke;
    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  onPressNewDrawing(name) {
    //alert(`Button ${name} pressed`);
    let msgData = {};
    msgData.targetFunc = "clearImage"
    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  onPressUndo(){
    let msgData = {};
    msgData.targetFunc = "pressUndo"
    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  onPressScreenshot(){
    let msgData = {};
    msgData.targetFunc = "screenshot"
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
    //var code = "var para = document.createElement('p');para.appendChild(document.createTextNode('" + 1 + "'));document.body.appendChild(para);";
    return (
      <View style={{flex: 1}}>
        <WebView
          style={{flex: 1}}
          ref={webview => { this.myWebView = webview; }}
          source={require('./FreeSketch.html')}
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
                  inputRange: [0, Screen.height-10],
                  outputRange: [0.5, 0],
                  extrapolateRight: 'clamp'
                })
              }]} 
            />

            <Interactable.View
            verticalOnly={true}
            snapPoints={[{y: Screen.height/5}, {y: Screen.height-10}]}
            boundaries={{top: -300}}
            initialPosition={{y: Screen.height-10}}
            animatedValueY={this._deltaY}>
            <View style={styles.panel}>
              <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
              </View>
              {/*this.renderColorPicks()*/}
              <View style={styles.playgroundContainer}>
                <Text style={styles.playgroundLabel}>Color</Text>
                <Image style={{ marginLeft: 10,
                                    width: Screen.width/15,
                                    height: Screen.width/15,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: 'black',
                                    borderRadius: Screen.width/18,
                                    tintColor: this.state.color}} 
                                    source={circle} />
              </View>
              
                  {this.renderColorSlider(0)}
                  {this.renderColorSlider(1)}
                  {this.renderColorSlider(2)}
              <View style={styles.playgroundContainer}>
                <Text style={styles.playgroundLabel}>Stroke</Text>
                {this.renderStrokeSlider(0)}
                <Text style={styles.playgroundLabelRight}>{this.state.stroke}</Text>
              </View>
              <View style={styles.panelButton}>
                <TouchableOpacity onPress={this.onPressNewDrawing.bind(this)}>
                  <Text style={styles.panelButtonTitle}>New Drawing</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.panelButton}>
                <TouchableOpacity onPress={this.onPressUndo.bind(this)}>
                  <Text style={styles.panelButtonTitle}>Undo</Text>
                </TouchableOpacity>
              </View>

            </View>
          </Interactable.View>

          </View>

      </View>
    );
  } // end render
  renderColorSlider(input){
    var color = ''
    switch(input){
      case 0:
        var c = this.state.red.toString(16);
        if(c.length < 2) c = '0' + c;
        //var colorString = '#' + c + '0000'
        var colorString = '#FF0000'
        color = 'red'
      break;
      case 1:
        var c = this.state.green.toString(16);
        if(c.length < 2) c = '0' + c;
        //var colorString = '#00' + c + '00'
        var colorString = '#00FF00'
        color = 'green'
      break;
      case 2:
        var c = this.state.blue.toString(16);
        if(c.length < 2) c = '0' + c;
        //var colorString = '#0000' + c
        var colorString = '#0000FF'
        color = 'blue'
      break;
    }
    //console.log(colorString)
    //console.log(c)
    var component = this;
    return(
      <Slider
          key={color}
          style={styles.slider}
          value={0}
          minimumValue={0.0}
          maximumValue={255.0}
          minimumTrackTintColor={'black'}
          maximumTrackTintColor={colorString}
          thumbTintColor={color}
          onSlidingComplete = {function(value){
            component.sliderColorUpdate(color, value)            
          }}
          onValueChange={function(value){
            component.sliderColorUpdate(color, value)            
          }}
        />
    )
  }// end renderColorSlider
  sliderColorUpdate(color, value){
    var stateObj = {};
    stateObj[color] = Math.round(value);
    //console.log(stateObj)
    this.setState(stateObj)
    this.sendColor()
  }
  renderStrokeSlider(){
    var component = this;
    return(
      <Slider
          style={{ margin: 5,
                  width: Screen.width/2}}
          value={15}
          minimumValue={5.0}
          maximumValue={40.0}
          minimumTrackTintColor={'black'}
          maximumTrackTintColor={'white'}
          thumbTintColor={'black'}
          onSlidingComplete = {function(value){
            component.sliderStrokeUpdate(value)            
          }}
          onValueChange={function(value){
            component.sliderStrokeUpdate(value)            
          }}
        />
    )
  }
  sliderStrokeUpdate(value){
    this.setState({stroke: Math.floor(value)})
    this.sendStroke()
  }
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
                                  borderWidth: 1,
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
    shadowOpacity: 0.4,
    /*flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efefef',*/
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 5
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
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playgroundContainer: {
    /*justifyContent: 'center',*/
    alignItems: 'center',
    backgroundColor: '#5894f3',
    flexDirection: 'row',
  },
  playgroundLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 30,
    padding: 5,
  },
  playgroundLabelRight: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    padding: 5,
  },
  playground: {
    marginTop: Screen.height <= 500 ? 10 : 20,
    padding: 20,
    width: Screen.width - 40,
    backgroundColor: '#5894f3',
    alignItems: 'stretch'
  },
  slider: {
    /*height: 40*/
  },
  headerTitle: {
    marginLeft: 30,
    color: 'white',
    fontSize: 20
  },
  headerRight: {

    marginLeft: 'auto',
    color: 'white',
    fontSize: 20
  },

});