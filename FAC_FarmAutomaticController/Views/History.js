import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default History = ({ navigation }) => {
    return(
        <View style={styles.container}>
            <Text>History Page</Text>
            <TouchableOpacity onPress={ () => {navigation.navigate('Details')}}>
                <Text>Back to details</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        justifyContent: 'center',
        alignItems: 'center'
      },
})