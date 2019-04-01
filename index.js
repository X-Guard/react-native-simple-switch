import React, { Component } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import PropTypes from "prop-types";

class Switch extends Component{

  static propTypes = {
    width:PropTypes.number,
    height:PropTypes.number,
    diameter:PropTypes.number,
    value:PropTypes.bool,

    buttonColor:PropTypes.string,
    activeButtonColor:PropTypes.string,
    shadowColor:PropTypes.string,
    activeShadowColor:PropTypes.string,
    barColor:PropTypes.string,
    activeBarColor:PropTypes.string,
    callback:PropTypes.func,
    icon: PropTypes.object,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    width:32,
    height:13,
    diameter:20,
    value:false,

    buttonColor:'#eee',
    activeButtonColor:'#009685',
    shadowColor:'#ccc',
    activeShadowColor:'#00a396',
    barColor:'#aaa',
    activeBarColor:'#9ddfdc',
    callback:() => null,
    icon: null,
    disabled: false,
  };


  constructor(props){
    super(props);
    this.icon = this.props.icon;
    this.state = {
      value: this.props.value && new Animated.Value(1) || new Animated.Value(0),
      icon: this.props.icon,
    };

  }

  componentDidMount() {

    if(this.props.disabled === true) {
      this.setState({
        icon: this.props.icon,
      });
    }
  }

  componentWillReceiveProps(nextProps){

    if(nextProps.value!==this.props.value) {
      this._onSwitch();
      this.forceUpdate();
    }

    if (typeof this.props.disabled !== 'undefined' && nextProps.disabled !== this.props.disabled && nextProps.disabled === true) {
      if ( typeof nextProps.disabled === 'undefined' || nextProps.disabled === true) {
        this.forceUpdate();
      } else {
        this.forceUpdate();
        this._onSwitch();
      }
    }

    if (nextProps.icon !== this.props.icon) {
      this.setState({
        icon: nextProps.icon,
      });
      this.forceUpdate();
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return false;
  }

  _onSwitch () {
    Animated.timing(this.state.value, {
      duration: 200,
      toValue: this.props.value ? 0 : 1,
    }).start(this.props.callback);
  }

  componentWillMount(){
    const diameter = (this.props.diameter > this.props.width) ? this.props.width : this.props.diameter;

    this.translateX = this.state.value.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.props.width-diameter],
    });

    this.buttonColor = this.state.value.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.buttonColor, this.props.activeButtonColor],
    });

    this.barColor = this.state.value.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.barColor, this.props.activeBarColor],
    });

    this.shadowColor = this.state.value.interpolate({
      inputRange: [0, 1],
      outputRange: [this.props.shadowColor, this.props.activeShadowColor],
    });

  }

  getBarStyle(){
    return {
      width:this.props.width,
      height:this.props.height,
      backgroundColor:this.barColor,
      borderRadius:this.props.width/2,
    };
  }

  getButtonStyle(){
    const diameter = (this.props.diameter > this.props.width) ? this.props.width : this.props.diameter;

    return {
      width:diameter,
      height:diameter,
      backgroundColor:this.buttonColor,
      borderRadius:diameter/2,
      borderBottomWidth:0.5,
      borderRightWidth:0.5,
      borderColor:this.shadowColor,
      padding:2,
      position:'absolute',
      transform:[
        {translateX:this.translateX},
      ],
    };
  }

  render(){
    const diameter = (this.props.diameter > this.props.width) ? this.props.width : this.props.diameter;
    return (
      <TouchableOpacity style={{
          flexDirection:'row',
          alignItems:'center',
          height:Math.max(this.props.height, diameter)
        }}
        activeOpacity={1}
        onPress={this.props.onPress}>
        <Animated.View style={[
          this.getBarStyle(),
        ]}/>
        <Animated.View style={[
          this.getButtonStyle(),
        ]}>
        {this.state.icon}
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

export default Switch;
