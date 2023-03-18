

import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
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
import firebaseApp from "../config";
import Header from "./Header";
import IosStatusBar from "./IosStatusBar";
import OrderCart from './OrderCart';
import TabNavigation from "./TabNavigation";


const HomePage = ({ getPermission, userLocation, userAdd }) => {

    const dispatch = useDispatch()
    const userCoordinates = useSelector((state) => state.userLocationReducer.location)
    const userAddress = useSelector((state) => state.userLocationReducer.address)
    const navigation = useNavigation()
    const [isInternet, setIsInternet] = useState(true)


    useEffect(() => {
        const internet = NetInfo.fetch().then(state => {
            setIsInternet(state?.isConnected)


        }).catch((err) => {
            alert(err)
        })



    }, [])


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
    const [fetchorders, setFetchorders] = useState()
    const orders = []

    useEffect(() => {
        (async () => {

            db.collection("Orders").orderBy("orderTimestamp", 'desc').onSnapshot((res) => {
                setFetchorders(
                    res.docs.map((restaurant) => {

                        if (restaurant.data()?.OrderAddToDeliveryList === false && restaurant?.data()?.sendDelivery === true) {
                            return restaurant.data()
                        }

                    }

                    )
                )
            })

        })

            ()

    }, [])

    if (fetchorders !== undefined) {
        fetchorders.forEach((res) => {

            // console.log(userCoordinates?.latitude)
            if (res !== undefined) {
                const startPoint = {
                    latitude: userCoordinates?.latitude,
                    longitude: userCoordinates?.longitude
                }

                const endPoint = {
                    latitude: res?.lat,
                    longitude: res?.long
                }

                const distance = haversine(startPoint, endPoint, { unit: "meter" })


                if (((distance / 1000).toFixed(1)) <= 10) {
                    // console.log(distance)
                    // console.log(((distance / 1000).toFixed(1)))
                    orders.push(res)

                }

            }
        })
    }



    // console.log(userCoordinates)
    // console.log(firebaseApp.auth()?.currentUser?.phoneNumber)
    return (
        isInternet === false ?
            <>
                <IosStatusBar />

                <View
                    style={{
                        width: "100%",
                        height: "90%",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'

                    }}
                >
                    <Image source={require('../assets/images/notavalible.png')} resizeMode="cover" style={{ height: 200, width: 200 }} />
                    <Text style={{ fontSize: 12 }}>Please Check Your Internet Connection</Text>

                </View>
            </>
            :
            fetchorders === undefined ?
                <>
                    <IosStatusBar />
                    <View style={{ width: "100%", height: "80%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                        <ActivityIndicator size={24} color="#f5220f" />
                    </View>
                </>
                :
                orders?.length === 0 ?
                    <>
                        <IosStatusBar />
                        <Header />

                        <View style={{ width: "100%", height: "80%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={require('../assets/images/OrderPage.jpg')} resizeMode='cover' style={{
                                    height: 200,
                                    width: 200
                                }} />
                                <Text style={{ fontWeight: "500" }}>Looks No One Ordered</Text>
                            </View>
                        </View>
                        <TabNavigation isHomePage={true} />
                    </>
                    :

                    <>
                        <IosStatusBar />
                        <Header />


                        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                            <Text style={{ fontSize: 22, fontWeight: '300', paddingHorizontal: 10, marginTop: 20, marginBottom: 10 }}>All <Text style={{ fontWeight: "500", color: "#f5220f" }}>Orders</Text></Text>

                            <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
                                {
                                    orders?.map((order, index) => (
                                        <OrderCart key={index} order={order} deliveryBoyLat={userCoordinates?.latitude} deliveryBoyLong={userCoordinates?.longitude} deliveryBoyNumber={firebaseApp.auth()?.currentUser?.phoneNumber} />
                                    ))
                                }
                            </View>
                        </ScrollView>

                        <TabNavigation isHomePage={true} />
                    </>


    );
};

export default HomePage;
