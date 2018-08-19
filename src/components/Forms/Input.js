import React, {Component} from 'react';
import {
    View,
    StatusBar,
    TextInput,
    Text,
    StyleSheet,
} from 'react-native';

var validator = require('validator');

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
        }
    }

    validate(rule, value) {
        switch (rule) {
            case 'isEmail' :
                this.setState({
                    hasError: !validator.isEmail(value),
                    validationError:'Valid email is required',
                });
                break;
            case 'isPassword' :
                this.setState({
                    hasError: !(value.length > 5),
                    validationError:'Password should be atleast 6 characters',
                });
                break;
            default:

            function getValue(str) {
                return Number(str.split(':')[1]);
            }
            function getText(str) {
                return str.split(':')[1];
            }

                if (rule.includes('isGreaterThan')) {
                    this.setState({
                        hasError: !(value.length > getValue(rule)),
                        validationError: 'Should be greater than' + getValue(rule)
                    });
                }
                if (rule.includes('confirmPassword')) {
                    console.log("Validate confirm pass");
                    console.log("Value : ",value);
                    console.log("getValue : ",rule);
                    this.setState({
                        hasError: !(validator.equals(value,getText(rule))),
                        validationError: 'Confirm password should match password'
                    });
                }
                break;
        }
    }

    render() {
        const {label, value, secureTextEntry, placeHolder, rule, placeholderTextColor} = this.props;
        const {hasError,validationError} = this.state;
        return (
            <View style={{paddingTop: 0}}>
                {
                    label &&
                    <Text style={styles.label}>
                        {label}
                    </Text>
                }
                <TextInput
                    style={styles.inputField}
                    onChangeText={(text) => {
                        this.props.handleTextChange(text, hasError);
                        if (!!rule) {
                            this.validate(rule, text);
                        }
                    }}
                    value={value}
                    secureTextEntry={!!secureTextEntry}
                    placeholder={!!placeHolder ? placeHolder : ''}
                    placeholderTextColor={placeholderTextColor && placeholderTextColor}
                />
                <Text style={styles.errorMsg}>
                    {hasError && validationError && validationError}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputField: {
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 2,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 0
    },
    label: {
        marginBottom: 5,
    },
    errorMsg: {
        fontSize: 11,
        color: 'red',
        marginTop: 3,
        marginBottom: 3,
    }
});

export default Input;