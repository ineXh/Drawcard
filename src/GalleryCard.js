import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Modal,
  Text,
  WebView,
  CameraRoll,
  Image,
  Dimensions,
  Button,
  ScrollView,
  View,
  Slider,
  RefreshControl,
  Animated, TouchableOpacity
} from 'react-native';
import Interactable from 'react-native-interactable';
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob'

import HeaderComponent from './HeaderComponent';

const { width } = Dimensions.get('window')
const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height-50
}

const circle = require('./../assets/circle.png')

const iconZoomIn = require('./../assets/zoom-in.png')
const iconZoomOut = require('./../assets/zoom-out.png')


let imageUrl = '';

let galleryUrl = [
  './../assets/whole.png',
  './../assets/cow_emoji.png',
  './../assets/heart.png',
  //'./../assets/10.png',
  //'./../assets/hulk.jpg',
]
let galleryImages = [
  require('./../assets/whole.png'),
  require('./../assets/cow_emoji.png'),
  require('./../assets/heart.png'),
  //require('./../assets/10.png'),
  //require('./../assets/hulk.jpg'),
];

export default class GalleryCard extends Component {
  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(Screen.height-100);
    this.state = {
      modalVisible: false,
      photos: [],
      colorPicks: [],
      indexGallery: 0,
      indexPhoto: null,
      showDrawButton: false,
      showSketch: false,
      pixelSize: 4,
    };
  } // end constructor


  setIndexGallery = (index) => {
    if (index === this.state.indexGallery) {
      index = null
    }
    this.setState({ indexGallery: index, indexPhoto: null})
  }
  setIndexPhoto = (index) => {
    if (index === this.state.indexPhoto) {
      index = null
    }
    this.setState({ indexPhoto: index, indexGallery: null})
  }
  componentDidMount() {
    this.getPhotos()
  }
  onWebViewMessage(event) {
    console.log('onWebViewMessage')
    this.myWebView.postMessage(event.nativeEvent.data);
    let msgData;
    try {
       msgData = JSON.parse(event.nativeEvent.data);
    }
    catch(err) {
       console.warn(err);
       return;
    }
    const response = this[msgData.targetFunc].apply(this, [msgData]);
    msgData.args = [response];
    msgData.targetFunc = null;
    msgData.isSuccessful = true;

    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  onPressReload() {
    let msgData = {};
    msgData.targetFunc = "reload"
    msgData.targetFuncData = this.state.pixelSize;
    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  onPressColorPick(index){
    let msgData = {};
    msgData.targetFunc = "colorButtonPress"
    msgData.targetFuncData = index;
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
    return 'return from Hi'
  }
  // Colors from webview to React
  receiveColor(input){
    //console.log(input)
    //      colorPicks: ['hsl(180, 50%, 50%)','blue','red','blue'],
    var colors = input.data.mydata.split(",");
    var colorPicks = [];
    for(var i = 0; i < colors.length; i=i+3){
      colorPicks.push('hsl(' + colors[i] + ',' + colors[i+1]*100 + '%,' + colors[i+2]*100 + '%)')
    }
    //console.log(colorPicks)
    this.setState({colorPicks: colorPicks})
  }
  getDataUrl(){
    return imageUrl;
  }
  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All'
    })
    .then(r => this.setState({ photos: r.edges }))
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  share = () => {
    console.log('share')
    const image = this.state.photos[this.state.indexPhoto].node.image.uri
    //console.log(image)
    RNFetchBlob.fs.readFile(image, 'base64')
    .then((data) => {
      let shareOptions = {
        title: "React Native Share Example",
        message: "Check out this photo!",
        url: 'data:image/jpg;base64,${data}',
        subject: "Check out this photo!"
      };

      Share.open(shareOptions)
        .then((res) => console.log('res:', res))
        .catch(err => {
                      console.log('err', err);
                      //console.log(shareOptions);
                    })
    })
  } // end share
  toggleDraw = () => {
    console.log('toggleDraw')
    if(!this.state.showSketch){
      if(this.state.indexPhoto != null){
        const image = this.state.photos[this.state.indexPhoto].node.image.uri;
        RNFetchBlob.fs.readFile(image, 'base64')
        .then((data) => {
          imageUrl = 'data:image/jpg;base64,' + data;
          //console.log(imageUrl)
          this.setState({showSketch: true})
        })
      }else if(this.state.indexGallery != null){
        imageUrl= galleryUrl[this.state.indexGallery];
        this.setState({showSketch: true})
      }
    }else{
      this.setState({showSketch: false})
    }
  } // end toggleDraw
  onRightPress(){
    //console.log('press right')
    if(this.state.indexGallery != null || this.state.indexPhoto != null)
      this.toggleDraw();
  }
  render() {
    if(this.state.showSketch){
      return this.renderSketch();
    }
    return (
      <View style={styles.container}>
        <HeaderComponent input={{ header:'Gallery',
                                  headerRight: 'Select',
                                  onRightPress: this.onRightPress.bind(this)}}/>
        <ScrollView
          contentContainerStyle={styles.scrollView}>
          {this.renderGallery()}
          {this.renderPhotos()}
        </ScrollView>
      </View>
    );
  } // end render
  renderModal(){
    return(
      <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => console.log('closed')}
        >
          <View style={styles.modalContainer}>
            <Button
              title='Close'
              onPress={this.toggleModal}
            />
            <ScrollView
              contentContainerStyle={styles.scrollView}>
              {this.renderGallery()}
            </ScrollView>
            {
              this.state.showDrawButton && (
                <View style={styles.shareButton}>
                  <Button
                    title='Toggle Draw'
                    onPress={this.toggleDraw}
                  />
                  <Button
                    title='Share'
                    onPress={this.share}/>
                </View>
              )
            }
          </View>
        </Modal>
      );
  } // end renderModal
  renderSketch(){
    //let code = "var imageUrl = " + imageUrl;
    //let code = 'window.imageUrl = ' + imageUrl;
    let code = 'window.cat = "hey"'
    //console.log(code)
    return(
      <View style={{flex: 1}}>
        <WebView
              style={{flex: 1}}
              ref={webview => { this.myWebView = webview; }}
              source={require('./Pixel.html')}
              injectedJavaScript={code}
              javaScriptEnabled={true}
              javaScriptEnabledAndroid={true}
              scrollEnabled={false}
              bounces={false}
              style={{marginTop: 0}}
              onMessage={this.onWebViewMessage.bind(this)}/>
              {this.renderPanel()}
      </View>
    );
  } // end renderSketch

  renderPanel(){
    return(
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
          }]} />
          <Interactable.View
            verticalOnly={true}
            snapPoints={[ {y: Screen.height/4},
                          {y: Screen.height*0.725},
                          {y: Screen.height*0.475},
                          {y: Screen.height-10}]}
            boundaries={{top: -300}}
            initialPosition={{y: Screen.height-10}}
            animatedValueY={this._deltaY}>
            <View style={styles.panel}>
              <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
              </View>

              {this.renderColorPicks()}
              <View style={styles.playgroundContainer}>
                  <Text style={styles.playgroundLabel}>Size</Text>
                  {this.renderPixelSlider()}
                  <Text style={styles.playgroundLabelRight}>{this.state.pixelSize}</Text>
              </View>
              <View style={styles.panelButton}>
                <TouchableOpacity onPress={this.onPressReload.bind(this, 'button1')}>
                  <Text style={styles.panelButtonTitle}>Reload Image</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Interactable.View>
        </View>
      );
  } // end renderPanel
  renderColorPicks(){
    //      <ScrollView style={styles.colorPickMenu}>
    return(
      <View style={styles.colorPickMenu}>
      {
        this.state.colorPicks.map((d, index) =>{
              return(
                  <TouchableOpacity key={index}
                    onPress={this.onPressColorPick.bind(this, index)}>
                    <Image style={{ margin: 5,
                                    width: width/8,
                                    height: width/8,
                                    alignItems: 'center',
                                    borderWidth: 3,
                                    borderColor: 'black',
                                    borderRadius: width/16,
                                    tintColor: this.state.colorPicks[index]}}
                       source={circle} />
                  </TouchableOpacity>
                )
            })
      }
      </View>
    );
  } // end renderColorPicks
  renderGallery(){
    return(
      galleryImages.map((p, i) => {
        return (
          <TouchableHighlight
            style={{opacity: i === this.state.indexGallery ? 0.5 : 1}}
            key={i}
            underlayColor='transparent'
            onPress={() => this.setIndexGallery(i)}
          >
            <Image
              style={{
                width: width/3,
                height: width/3
              }}
              source={galleryImages[i]}
            />
          </TouchableHighlight>
        )
      }) // end photos.map
    );

  }
  renderPixelSlider(){
    var component = this;
    return(
      <Slider
          style={{ margin: 5,
                  width: Screen.width/2}}
          value={6}
          minimumValue={1.0}
          maximumValue={10.0}
          minimumTrackTintColor={'black'}
          maximumTrackTintColor={'white'}
          thumbTintColor={'black'}
          onSlidingComplete = {(value) => this.setState(
            {pixelSize: Math.floor(value)})}
        />
    )
  }
  renderPhotos(){
    return(
      this.state.photos.map((p, i) => {
        return (
          <TouchableHighlight
            style={{opacity: i === this.state.indexPhoto ? 0.5 : 1}}
            key={i}
            underlayColor='transparent'
            onPress={() => this.setIndexPhoto(i)}
          >
            <Image
              style={{
                width: width/3,
                height: width/3
              }}
              source={{uri: p.node.image.uri}}
            />
          </TouchableHighlight>
        )
      }) // end photos.map
    );
  } // end renderPhotos

} // end GalleryCard

/*

*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#FFFCFF',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 40,
    backgroundColor: '#223f6b'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  modalContainer: {
    paddingTop: 20,
    flex: 1
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },
  panel: {
    height: Screen.height + 300,
    padding: 20,
    backgroundColor: '#f7f5eeaa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0.4,
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
  colorPickMenu:{
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    /*

    alignContent: 'space-between'*/
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
});