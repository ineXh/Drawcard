import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

export default class HeaderComponent extends Component {
  state = {
    currentHeader: 'Gallery',
  }
  onMenuPress(){

  }
  render() {
  	//console.log(this.props)
    return (
      <View style={styles.header}>
          <TouchableOpacity onPress={this.onMenuPress.bind(this)}>
            <Image style={styles.menuIcon} source={require('./../assets/cow_emoji.png')} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{this.props.input.header}</Text>
          <TouchableOpacity style={styles.menuItem} onPress={this.props.input.onRightPress.bind(this)}>
          	<Text style={styles.headerRight}>{this.props.input.headerRight}</Text>
          </TouchableOpacity>
        </View>
    );
  } // end render

} // end HeaderComponent

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingTop: 0,
    paddingLeft: 20,
 	  paddingRight: 20,
    flexDirection: 'row',
    backgroundColor: '#f99595',
    alignItems: 'center',
    zIndex: 1001
  },
  menuIcon: {
    width: 30,
    height: 30
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
  menuItem: {
    alignItems: 'center',
   	marginLeft: 'auto',
  },
})