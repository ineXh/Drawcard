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
  onWebViewMessage= () => {
    console.log('onWebViewMessage')
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
  }
  draw = () => {
    console.log('draw')
    this.setState({showSketch: true})
  }
  render() {
    return (
      <View style={styles.container}>
        <Button
          title='View Photos'
          onPress={() => { this.toggleModal(); this.getPhotos() }}
        />
        <Text style={styles.welcome}>
          Welcome to React Native Fetch!
        </Text>
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
              {
                this.state.showSketch ? this.renderSketch() : this.renderPhotos()
              }
            </ScrollView>
            {
              this.state.showDrawButton && (
                <View style={styles.shareButton}>
                    <Button
                      title='Draw'
                      onPress={this.draw}
                    />
                </View>
              )
            }
          </View>
        </Modal>
      </View>
    );
  } // end render
  renderSketch(){
    return(
      <WebView
            style={{flex: 1}}
            ref={webview => { this.myWebView = webview; }}
            source={require('./drawSimple.html')}
            javaScriptEnabled={true}
            javaScriptEnabledAndroid={true}
            scrollEnabled={false}
            style={{marginTop: 0}}
            onMessage={this.onWebViewMessage.bind(this)}/>
    );
  } // end renderSketch
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