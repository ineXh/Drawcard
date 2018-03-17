import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  WebView,
  CameraRoll,
  Slider,
  Dimensions,
  Alert,
  Platform,
  Animated, TouchableOpacity
} from 'react-native';

import Interactable from 'react-native-interactable';
import RNFetchBlob from 'react-native-fetch-blob'
import RNFS from 'react-native-fs'
const PictureDir = RNFetchBlob.fs.dirs.PictureDir;

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height-50
}
const circle = require('./../assets/circle.png')
const iconNewFile = require('./../assets/icons8-file-26.png')
const iconRedo = require('./../assets/icons8-redo-26.png')
const iconUndo = require('./../assets/icons8-undo-26.png')
const iconSave = require('./../assets/icons8-save-26.png')
const iconErase = require('./../assets/icons8-erase-24.png')

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
    var component = this;
    Alert.alert(
      'Start Over',
      'Clear the current drawing.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: function(){
          let msgData = {};
          msgData.targetFunc = "clearImage"
          component.myWebView.postMessage(JSON.stringify(msgData))
        }},
      ],
      { cancelable: false }
    )
  }
  onPressSave(){
    var component = this;
    Alert.alert(
      'Save Image',
      'Save the current drawing.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: function(){
          let msgData = {};
          msgData.targetFunc = "exportImg"
          component.myWebView.postMessage(JSON.stringify(msgData))
        }},
      ],
      { cancelable: false }
    )
  }
  receiveImage(input){
    var src = input.data.mydata; //{uri: input.data.mydata};
    var arr = src.split(',')
    var source = arr[1];
    //let filePath = '${RNFS.TemporaryDirectoryPath}image.jpg'
    let date = new Date();
    date.getUTCFullYear() + '-' + (date.getUTCMonth()+1)
    let filePath = PictureDir + '/Screenshots/';// + 'image.jpg';
    let fileName = 'image5.jpg'
    //var source = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
    //var source = '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'
    //var source = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="'
    console.log(source)
    RNFS.writeFile(filePath, source, 'base64')
    .then(() => console.log('Image converted to jpg and saved at ' + filePath))
    .catch((err) =>{
      console.log(err)
    })
    /*let imageLocation = PictureDir + '/' + fileName;
    console.log(imageLocation)
    // save image
    RNFetchBlob.fs.writeFile(imageLocation, source, 'base64')
    RNFetchBlob.fs.scanFile([{path: imageLocation}])
    .then(() =>{
      console.log('scan file success')
      resolve(1)
    })
    .catch((err) =>{
      console.log('scan file error')
    })*/
    //console.log(source)
    //this.saveToCameraRoll(source);
    //this.state.drawings.push(source);
  }
  saveToCameraRoll = (image) => {
    if (Platform.OS === 'android') {
      RNFetchBlob
      .config({
        fileCache : true,
        appendExt : 'jpg'
      })
      .fetch('GET', image)
      .then((res) => {
        CameraRoll.saveToCameraRoll(res.path())
          .then(Alert.alert('Success', 'Photo added to camera roll!'))
          .catch(err => console.log('err:', err))
      })
    } else {
      CameraRoll.saveToCameraRoll(image)
        .then(Alert.alert('Success', 'Photo added to camera roll!'))
    }
  }
  onPressUndo(){
    let msgData = {};
    msgData.targetFunc = "pressUndo"
    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  onPressRedo(){
    let msgData = {};
    msgData.targetFunc = "pressRedo"
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
            snapPoints={[{y: Screen.height/5},
                         {y: Screen.height/2},
                         {y: Screen.height-10}]}
            boundaries={{top: -300}}
            initialPosition={{y: Screen.height-10}}
            animatedValueY={this._deltaY}>
              <View style={styles.panel}>
                <View style={styles.panelHeader}>
                  <View style={styles.panelHandle} />
                </View>
                {/*this.renderColorPicks()*/}
                <View style={styles.playgroundContainer}>
                  <Text style={styles.playgroundLabel}>Paint Color</Text>
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
                  <Text style={styles.playgroundLabel}>Brush Size</Text>
                  {this.renderStrokeSlider(0)}
                  <Text style={styles.playgroundLabelRight}>{this.state.stroke}</Text>
                </View>

                <View style={styles.playgroundContainer}>
                  <Text style={styles.playgroundLabel}>Menu</Text>
                  <TouchableOpacity onPress={this.onPressNewDrawing.bind(this)}>
                    <Image style={{   margin: 4,
                                      marginLeft: 10,
                                      width: Screen.width/12,
                                      height: Screen.width/12,
                                      alignItems: 'center'}}
                                      source={iconNewFile} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onPressUndo.bind(this)}>
                    <Image style={{   margin: 4,
                                      marginLeft: 10,
                                      width: Screen.width/12,
                                      height: Screen.width/12,
                                      alignItems: 'center'}}
                                      source={iconUndo} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onPressRedo.bind(this)}>
                    <Image style={{   margin: 4,
                                      marginLeft: 10,
                                      width: Screen.width/12,
                                      height: Screen.width/12,
                                      alignItems: 'center'}}
                                      source={iconRedo} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.onPressSave.bind(this)}>
                    <Image style={{   margin: 4,
                                      marginLeft: 10,
                                      width: Screen.width/12,
                                      height: Screen.width/12,
                                      alignItems: 'center'}}
                                      source={iconSave} />
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
    marginBottom: 2
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
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playgroundContainer: {
    /*justifyContent: 'center',*/
    margin: 5,
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