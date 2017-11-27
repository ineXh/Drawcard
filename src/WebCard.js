import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';

window.myvar = 123
const HTMLC = '<div id="myContent">Your HTML content 12</div>'
const jsCode = "document.querySelector('#myContent').style.backgroundColor = '#7294cc';"
export default class WebCard extends Component {
  constructor(props) {
    super(props);
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
       console.log(msgData.data)
       console.log(msgData.targetFunc)
       const response = this[msgData.targetFunc].apply(this, [msgData]);
       console.log(response)
       // trigger success callback
       msgData.isSuccessful = true;
       msgData.args = [response];
       //this.myWebView.postMessage(msgData)
       console.log(JSON.stringify(msgData))
       this.myWebView.postMessage(JSON.stringify(msgData))
  }

  render() {
    console.log('render WebCard')
    //ref={webview => { this.myWebView = webview; }}
    //ref={(ref) => { this.myWebView = ref; }}
    //ref="myWebView"
    var code = "var para = document.createElement('p');para.appendChild(document.createTextNode('" + this.state.number + "'));document.body.appendChild(para);";
    return (
      <WebView
        ref={webview => { this.myWebView = webview; }}
        source={require('./draw.html')}
        //source= {{html: HTMLC}}
        injectedJavaScript={code}
        javaScriptEnabledAndroid={true}
        style={{marginTop: 20}}
        onMessage={this.onWebViewMessage.bind(this)}/>
    );
  }
}