import { AntDesign, Entypo } from '@expo/vector-icons';
import { width } from 'deprecated-react-native-prop-types/DeprecatedImagePropType';

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import firebaseApp from '../config';


const SelectedOrderCard = ({ order }) => {
    const [fullOrder, setFullOrder] = useState(false)
    const [fullOrderStatus, setFullOrderStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [deliveryOrder, setDeliveryOrder] = useState()
    const [otpField, setOtpField] = useState()
    const [err, setErr] = useState("")
    const [otpEnable, setOtpEnable] = useState(false)


    useEffect(() => {
        firebaseApp.firestore().collection("Delivery")?.doc(firebaseApp.auth()?.currentUser.phoneNumber)?.collection("Orders")?.doc(order?.orderid).onSnapshot((res) => {
            setDeliveryOrder(res.data())
        })
    }, [])


    // console.log()

    return (
        <View style={{ marginTop: 20, borderRadius: 10, backgroundColor: "#fff", paddingVertical: 5, borderWidth: 1, borderColor: "#f5220f", paddingHorizontal: 10, paddingBottom: 20 }}>
            <Text style={{ paddingHorizontal: 5, fontSize: 10, fontWeight: '300', marginTop: 5, width: "100%", textAlign: 'right' }}>{order?.orderid}</Text>
            <Text style={{ paddingHorizontal: 5, fontSize: 24, fontWeight: '300', marginTop: 5 }}>{order?.name}</Text>
            <TouchableOpacity
                onPress={() => {
                    if (Platform.OS !== 'android') {
                        Linking.openURL(`telprompt:${order?.number}`);
                    }
                    else {
                        Linking.openURL(`tel:${order?.number}`);
                    }
                }}
            >
                <Text style={{ paddingHorizontal: 5, fontSize: 12, fontWeight: '300', marginTop: 5, color: "#f5220f" }}>+91{order?.number}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                    const latLng = `${order?.lat},${order?.long}`;

                    const url = Platform.select({
                        ios: `${scheme}@${latLng}`,
                        android: `${scheme}${latLng}`
                    });


                    Linking.openURL(url)
                }}
            >
                <Text style={{ paddingHorizontal: 5, fontSize: 12, fontWeight: '300', width: "89%", marginTop: 5, color: "#f5220f" }}>{order?.address}</Text>
            </TouchableOpacity>
            <Text style={{ paddingHorizontal: 5, fontSize: 12, fontWeight: '300', marginTop: 5 }}>Order Amount: ₹{order?.orderAmount}</Text>
            <Text style={{ paddingHorizontal: 5, fontSize: 12, fontWeight: '300', marginTop: 5 }}>Order On: {order?.orderDate}</Text>
            <Text style={{ paddingHorizontal: 5, fontSize: 12, fontWeight: '300', marginTop: 5 }}>Payment Mode: {order?.paymentOption}</Text>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    if (fullOrder === true) {
                        setFullOrder(false)
                    }
                    else {
                        setFullOrder(true)
                    }
                }} style={{ display: 'flex', flexDirection: "row", alignItems: 'center', paddingHorizontal: 5, marginTop: 5, width: "100%" }}>
                <Text style={{ fontSize: 12, fontWeight: '300', flex: 1 }}>Order Items: {order?.cart?.length} </Text>
                {
                    fullOrder ?
                        <Entypo name="chevron-small-up" size={24} color="#f5220f" style={{ opacity: 1 }} />
                        :
                        <Entypo name="chevron-small-down" size={24} color="#f5220f" style={{ opacity: 1 }} />
                }
            </TouchableOpacity>
            {
                fullOrder &&
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 22, fontWeight: "300", paddingHorizontal: 10 }}>Cart <Text style={{ color: "#f5220f", fontWeight: "500" }}>Items</Text></Text>
                    {
                        order?.cart?.map((item, index) => (
                            <View key={index} style={{
                                display: 'flex',
                                flexDirection: "row",
                                paddingHorizontal: 20,
                                borderBottomWidth: 0.5,
                                borderColor: "lightgrey",
                                paddingBottom: 10,
                                marginBottom: 20,
                                overflow: 'hidden',
                                alignItems: 'center',
                                marginTop: 10
                            }}>
                                <View style={
                                    isLoading ?
                                        {
                                            display: "flex",
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: 120,
                                            width: "100%",
                                        }
                                        :
                                        {
                                            display: 'none'
                                        }
                                }>
                                    <ActivityIndicator color="#f5220f" />
                                </View>

                                <View style={
                                    isLoading ?
                                        {
                                            height: 0,
                                            width: 0
                                        }
                                        :
                                        {
                                            display: "flex",
                                            alignItems: "center",

                                        }}>
                                    <Image
                                        source={{ uri: item?.img }}
                                        onLoadEnd={() => setIsLoading(false)}
                                        style={
                                            isLoading ?
                                                {
                                                    display: Platform.OS === 'android' ? "none" : "flex",
                                                    width: 50,
                                                    height: 50,

                                                }
                                                :
                                                {
                                                    width: 50,
                                                    height: 50,
                                                    resizeMode: "cover",

                                                }} />
                                    <Text style={
                                        isLoading ?
                                            {
                                                display: "none"
                                            }
                                            :
                                            { marginTop: 5 }
                                    }>
                                        Qty: {item?.qty}</Text>

                                </View>
                                <View
                                    style={
                                        isLoading ?
                                            {
                                                display: "none"
                                            }
                                            :
                                            {
                                                display: "flex",
                                                flexDirection: "column",
                                                flex: 0.85,
                                                paddingLeft: 10,
                                                overflow: "hidden",

                                            }}>
                                    <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5, width: 200, overflow: "hidden" }}>{item.name}</Text>
                                    <Text style={{ marginTop: 5, width: "100%" }}>
                                        {Array(item?.rating).fill().map((_, i) => (
                                            <Entypo name='star' size={16} color="gold" key={i} />
                                        ))}

                                    </Text>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                                        <Text style={{ fontWeight: '500', marginTop: 5, marginLeft: 5 }}>₹{item?.price} </Text>
                                        <Text style={{ fontWeight: '300', fontSize: 12, marginTop: 5 }}>({item?.size})</Text>
                                    </View>
                                    <Text style={{ marginTop: 5, fontSize: 10, width: 200, overflow: 'hidden' }}>{item.description}</Text>
                                    <Text style={{ marginTop: 5, fontSize: 10, width: 200, overflow: 'hidden', fontWeight: "500" }}>Shop Name: {item.ShopName}</Text>
                                    <TouchableOpacity
                                        onPress={() => {

                                            const url = Platform.select({
                                                ios: `https://www.google.com/maps/search/?api=1&query=${item?.ShopLocation?.Latitude},${item?.ShopLocation?.Longitude}`,
                                                android: `https://www.google.com/maps/search/?api=1&query=${item?.ShopLocation?.Latitude},${item?.ShopLocation?.Longitude}`
                                            });


                                            Linking.openURL(url)
                                        }}
                                    >
                                        <Text style={{ marginTop: 5, fontSize: 10, width: 200, overflow: 'hidden', fontWeight: "500", color: "#f5220f" }}>Shop Address:{item.ShopAddress}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        if (Platform.OS !== 'android') {
                                            Linking.openURL(`telprompt:${item?.ShopNumber}`);
                                        }
                                        else {
                                            Linking.openURL(`tel:${item?.ShopNumber}`);
                                        }
                                    }}>
                                        <Text style={{ marginTop: 5, fontSize: 10, width: 200, overflow: 'hidden', fontWeight: "500", color: "#f5220f" }}>Shop Number: {item?.ShopNumber}</Text>

                                    </TouchableOpacity>
                                </View>



                            </View>
                        ))
                    }
                </View>
            }
            <TouchableOpacity
                activeOpacity={0.8}

                onPress={async () => {

                    await firebaseApp.firestore().collection("Orders").doc(order?.orderid).update({
                        activeOrderDetail: "Out For Delivery",
                        orderPreparing: true,


                    })



                    await firebaseApp.firestore().collection("Delivery").doc(firebaseApp.auth()?.currentUser.phoneNumber).collection("Orders").doc(order?.orderid).update({
                        activeOrderDetail: "Out For Delivery",
                        orderPreparing: true,



                    })

                    setOtpEnable(true)

                }} style={
                    order?.orderPreparing !== true ?
                        { display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, marginTop: 20, width: "100%", backgroundColor: "#f5220f", borderRadius: 10 }
                        :
                        {
                            display: 'none'
                        }
                }>


                <Text style={{ fontSize: 14, color: "#fff", paddingHorizontal: 10, paddingVertical: 10 }}> Order Pickup</Text>

            </TouchableOpacity>
            <TextInput
                style={
                    otpEnable || order?.orderPreparing === true ?
                        {
                            display: 'flex',
                            width: "50%",
                            borderWidth: 1,
                            borderColor: "#f5220f",
                            borderRadius: 10,
                            height: 40,
                            paddingHorizontal: 10,
                            marginTop: 10
                        }
                        :
                        {
                            display: 'none'
                        }
                }
                placeholder='Enter Order OTP'
                keyboardType="number-pad"
                onChangeText={(value) => {
                    setErr("")
                    setOtpField(value)
                }}
                maxLength={4}
            />
            <Text style={
                err === undefined || err === "" ?
                    {
                        display: 'none'
                    }
                    :
                    {
                        fontSize: 10,
                        color: "#f5220f",
                        marginTop: 3
                    }
            }>{err}</Text>
            <TouchableOpacity
                activeOpacity={0.8}

                onPress={async () => {
                    // console.log(order)
                    if (Number(otpField) === order?.orderCode) {
                        await firebaseApp.firestore().collection("Orders").doc(order?.orderid).update({
                            activeOrderDetail: "Order Delivered",
                            orderPickup: true,
                            orderDelivered: true,
                            orderPreparing: true,

                        })

                        await firebaseApp.firestore().collection("Delivery").doc(firebaseApp.auth()?.currentUser.phoneNumber).collection("Orders").doc(order?.orderid).update({
                            activeOrderDetail: "Order Delivered",
                            orderPickup: true,
                            orderDelivered: true,
                            orderPreparing: true,


                        })

                        const fetchorder = await firebaseApp?.firestore()?.collection("Orders")?.doc(order?.orderid)?.get()


                        await firebaseApp.firestore().collection("Orders Delivered").doc(order?.orderid).set(fetchorder?.data())
                        await firebaseApp.firestore().collection("Orders").doc(order?.orderid).delete()

                    }
                    else {
                        setErr("OTP is invalid.")
                    }




                }} style={
                    order?.orderDelivered !== true ?

                        { display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, marginTop: 20, width: "100%", backgroundColor: "#f5220f", borderRadius: 10 }
                        :
                        {
                            display: 'none'
                        }
                }>
                <Text style={{ fontSize: 14, color: "#fff", paddingHorizontal: 10, paddingVertical: 10 }}> Order Delivered</Text>

            </TouchableOpacity>






        </View>
    )
}

export default SelectedOrderCard