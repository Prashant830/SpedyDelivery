import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { height } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';
import React from 'react';
import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

const TabNavigation = ({ isHomePage, isHistory, isOrder }) => {
    const cart = useSelector((state) => state.CartReducer.cart)
    const navigation = useNavigation()
    return (
        <View style={{ backgroundColor: 'white', width: Dimensions.get('window').width, height: Platform.OS === 'android' ? 60 : 80, position: 'absolute', bottom: 0, borderTopWidth: 1, borderTopColor: 'lightgray', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingVertical: 15, paddingHorizontal: 10, flexDirection: 'row', }} >
            <View style={{ display: 'flex', flexDirection: 'row', width: "70%", justifyContent: 'space-between' }}>

                <TouchableOpacity onPress={() => navigation.navigate('SplashToHomePage')}>
                    <Octicons name="home" size={25} style={{ color: isHomePage ? "#f5220f" : "black" }} />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => navigation.navigate('OrderSelected')}>
                    <MaterialIcons name="delivery-dining" size={25} style={{ color: isOrder ? "#f5220f" : "black" }} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
                    <FontAwesome name="history" size={25} style={{ color: isHistory ? "#f5220f" : "black" }} />
                </TouchableOpacity>

            </View>
        </View >
    )
}

export default TabNavigation