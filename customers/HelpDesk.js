import React, {Component} from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';

export default class HelpDeskScreen extends Component<Props> {
    /**
   * A screen component can set navigation options such as the title.
   */
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>This is HelpDesk</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 20,
    },
    button: {
        margin: 10,
    },
});

