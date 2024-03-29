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
import style from './CSS';
import Header from "./Header";
import IosStatusBar from "./IosStatusBar";
import OrderCart from './OrderCart';
import SelectedOrderCard from './SelectedOrderCard';
import TabNavigation from "./TabNavigation";





const OrderSelected = () => {
    const navigation = useNavigation()
    const [number, setNumber] = useState("")
    const [fetchorders, setFetchorders] = useState()
    const [isInternet, setIsInternet] = useState(true)
    const orders = []


    useEffect(() => {
        const internet = NetInfo.fetch().then(state => {
            setIsInternet(state?.isConnected)


        }).catch((err) => {
            alert(err)
        })



    }, [])

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
            if (res !== undefined && res.orderDelivered !== true) {
                orders.push(res)
            }
        })
    }


    // console.log(orders)

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
                    <View style={

                        { width: "100%", backgroundColor: "#f5220f", paddingBottom: 5, paddingLeft: 10 }}>
                        <TouchableOpacity style={{ width: 25 }} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={30} color="#fff" />
                        </TouchableOpacity>

                    </View>
                    <View style={{ width: "100%", height: "80%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                        <ActivityIndicator size={24} color="#f5220f" />
                    </View>
                </>
                :
                orders?.length === 0 ?
                    <>
                        <IosStatusBar />
                        <View style={

                            { width: "100%", backgroundColor: "#f5220f", paddingBottom: 5, paddingLeft: 10 }}>
                            <TouchableOpacity style={{ width: 25 }} onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={30} color="#fff" />
                            </TouchableOpacity>

                        </View>
                        <View style={{ width: "100%", height: "80%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
                            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={require('../assets/images/OrderPage.jpg')} resizeMode='cover' style={{
                                    height: 200,
                                    width: 200
                                }} />
                                <Text style={{ fontWeight: "500" }}>Looks Nothing Selected</Text>
                            </View>
                        </View>
                        <TabNavigation isOrder={true} />
                    </>
                    :
                    <>
                        <IosStatusBar />
                        <View style={

                            { width: "100%", backgroundColor: "#f5220f", paddingBottom: 5, paddingLeft: 10 }}>
                            <TouchableOpacity style={{ width: 25 }} onPress={() => navigation.goBack()}>
                                <Ionicons name="arrow-back" size={30} color="#fff" />
                            </TouchableOpacity>

                        </View>
                        <SafeAreaView >

                            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

                                <Text style={{ fontSize: 22, fontWeight: '300', paddingHorizontal: 10, marginTop: 20, marginBottom: 10 }}>Selected <Text style={{ fontWeight: "500", color: "#f5220f" }}>Orders</Text></Text>

                                <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
                                    {
                                        orders?.map((order, index) => (
                                            <SelectedOrderCard key={index} order={order} />
                                        ))
                                    }
                                </View>
                            </ScrollView>



                        </SafeAreaView>

                        <TabNavigation isOrder={true} />
                    </>


    )


}



export default OrderSelected