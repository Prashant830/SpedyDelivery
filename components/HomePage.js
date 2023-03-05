

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
import OrderCart from './OrderCart';


const HomePage = ({ getPermission, userLocation, userAdd }) => {

    const dispatch = useDispatch()
    const userCoordinates = useSelector((state) => state.userLocationReducer.location)
    const userAddress = useSelector((state) => state.userLocationReducer.address)
    const navigation = useNavigation()
    

    useEffect(() => {

        if (userAdd != undefined) {
            dispatch({
                type: 'ADD_ADDRESS',
                payload: userAdd,
            })
            dispatch({
                type: 'ADD_LOCATION',
                payload: userLocation,
            })
            dispatch({
                type: 'ADD_PERMISSION',
                payload: getPermission
            })
        }

    }, [userAdd])
    
    
    const db = firebaseApp.firestore()
    const [fetchorders, setFetchorders] = useState([])
    const orders = []

    useEffect(() => {
        (async () => {

            db.collection("Orders").orderBy("orderTimestamp", "asc").onSnapshot((res) => {
                setFetchorders(
                    res.docs.map((restaurant) => {


                            return restaurant.data()

                    }

                    )
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
                <IosStatusBar />
                <Header />

               
                          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                          <Text style={{ fontSize: 22, fontWeight: '300', paddingHorizontal: 10, marginTop: 20, marginBottom: 10 }}>All <Text style={{ fontWeight: "500", color: "#f5220f" }}>Orders</Text></Text>

                           <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
                                      {
                                        orders?.map((order, index) => (
                                            <OrderCart key={index} order={order} />
                                          ))
                                          }
                                </View>
                               </ScrollView>

                            <TabNavigation/>
                            </>


    );
};

export default HomePage;
