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
  RefreshControl
} from 'react-native';

import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob'
const { width } = Dimensions.get('window')
let imageUrl = '';

let galleryUrl = [
  './../assets/whole.png'
]
let galleryImages = [
  require('./../assets/whole.png')
];
export default class FetchDrawCard extends Component {
  state = {
    modalVisible: false,
    photos: [],
    index: null,
    showDrawButton: false,
    showSketch: false,
  }
  setIndex = (index) => {
    if (index === this.state.index) {
      index = null
    }
    this.setState({ index, showDrawButton: true})
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
    msgData.targetFunc = null;
    msgData.isSuccessful = true;
    msgData.args = [response];
    this.myWebView.postMessage(JSON.stringify(msgData))
  }
  sayHi(input){
    console.log('Hi from DrawCard')
    return 'return from Hi'
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
    const image = this.state.photos[this.state.index].node.image.uri
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
      /*const image = this.state.photos[this.state.index].node.image.uri;
      RNFetchBlob.fs.readFile(image, 'base64')
      .then((data) => {
        imageUrl = 'data:image/jpg;base64,' + data;
        //console.log(imageUrl)
        this.setState({showSketch: true})
      })*/
      imageUrl= galleryUrl[this.state.index];
      this.setState({showSketch: true})
    }else{
      this.setState({showSketch: false})
    }
  } // end toggleDraw
  render() {
    if(this.state.showSketch){
      return this.renderSketch();
    }
    return (
      <View style={styles.container}>
        <Button
          title='View Photos'
          onPress={() => { this.toggleModal(); this.getPhotos() }}
        />
        <Text style={styles.welcome}>
          Pick a picture to draw.
        </Text>
        {this.renderModal()}
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
              onMessage={this.onWebViewMessage.bind(this)}/>
        <View style={styles.shareButton}>
          <Button
            title='Close Draw'
            onPress={this.toggleDraw}
          /></View>
      </View>
    );
  } // end renderSketch
  renderGallery(){
    return(
      galleryImages.map((p, i) => {
        return (
          <TouchableHighlight
            style={{opacity: i === this.state.index ? 0.5 : 1, backgroundColor: '#de6d77'}}
            key={i}
            underlayColor='transparent'
            onPress={() => this.setIndex(i)}
          >
            <Image
              style={{
                width: width/2,
                height: width/2
              }}
              source={galleryImages[i]}
            />
          </TouchableHighlight>
        )
      }) // end photos.map
    );
    
  }
  renderPhotos(){
    return(
      this.state.photos.map((p, i) => {
        return (
          <TouchableHighlight
            style={{opacity: i === this.state.index ? 0.5 : 1, backgroundColor: '#de6d77'}}
            key={i}
            underlayColor='transparent'
            onPress={() => this.setIndex(i)}
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

} // end FetchDrawCard

/*

*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});