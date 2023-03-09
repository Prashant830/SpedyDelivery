import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location';
import haversine from "haversine";

import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput, TouchableOpacity, View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import IosStatusBar from "./IosStatusBar";
import firebaseApp from "../config"
import TabNavigation from "./TabNavigation";
import style from './CSS';
import SelectedOrderCard from './SelectedOrderCard';
import OrderCart from './OrderCart';





const OrderSelected = () => {

    const [number, setNumber] = useState("")
    const [fetchorders, setFetchorders] = useState([])
    const orders = []

    useEffect(() => {
        (async () => {

            firebaseApp.firestore().collection("Delivery").doc(firebaseApp.auth()?.currentUser.phoneNumber).collection("Orders").onSnapshot((res) => {
                setFetchorders(
                    res.docs.map((restaurant) => {
                            return restaurant.data()
    
                    })
    
                    )
               })

        })

            ()

    }, [])
   
    
if (fetchorders !== undefined) {
    fetchorders.forEach((res) => {
        if (res !== undefined) {
            orders.push(res)
        }
    })
}


console.log(orders)

    return (
        <>
<SafeAreaView >

           <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

                          <Text style={{ fontSize: 22, fontWeight: '300', paddingHorizontal: 10, marginTop: 20, marginBottom: 10 }}>Select <Text style={{ fontWeight: "500", color: "#f5220f" }}>Orders</Text></Text>

                           <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
                                      {
                                        orders?.map((order, index) => (
                                            <SelectedOrderCard key={index} order={order} />
                                          ))
                                          }
                                </View>
            </ScrollView>



        </SafeAreaView>

         <TabNavigation />
</>


    )


}



export default OrderSelected