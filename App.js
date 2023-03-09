import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import HomePage from './components/HomePage';
import SplashScreen from './components/SplashScreen';
import OrderSelected from './components/OrderSelected';
import LoginPage from './components/LoginPage';
import configurestore from "./redux/store";
import { getAuth } from 'firebase/auth';
import firebaseApp from './config';






const store = configurestore();
const Stack = createNativeStackNavigator();

// const auth = await getAuth(firebaseApp);



const App = () => {

  const [getPermission, setGetPermission] = useState(false)
  const [userLocation, setUserLocation] = useState()
  const [userAdd, setUserAdd] = useState({})
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  var auth = getAuth(firebaseApp).currentUser

  LogBox.ignoreAllLogs();
  // console.log(auth)


  //Finding User Location
  useEffect(() => {
    //Setting the current User.



    (async () => {


      //inialize

      let coardinates
      let address



      //Request for location permission
      const { status } = await Location.requestForegroundPermissionsAsync().catch((err) => {
        console.log(err.message)
      })




      //Handle Error
      if (status === 'granted') {

        setGetPermission(true);
        setTimeout(() => {
          setShowSplashScreen(false)
        },
          3000
        )


        if (Location) {
          coardinates = await Location.getCurrentPositionAsync({}).catch((err) => {
            console.log("this is the err in coardinates --> " + err.message)
          })
        }
        if (coardinates.coords === undefined) {
          address = {}
        }
        else {

          address = await Location.reverseGeocodeAsync(coardinates.coords).catch((err) => {
            alert(err.message)

          })

        }

        if (coardinates.coords === undefined) {
          setUserLocation({})

        }
        else {
          setUserLocation(coardinates.coords)

        }
        if (address) {
          setUserAdd(address)

        }
        else {
          setUserAdd({})
        }

      }
      else {
        setGetPermission(false)
        setTimeout(() => {
          setShowSplashScreen(false)
        },
          3000
        )
        setUserAdd({})
        setUserLocation({})

      }



    })
      //calling function
      ();

  }, [])



  return (

    <ReduxProvider store={store}>

      <NavigationContainer>

        <Stack.Navigator screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          statusBarColor: "#f5220f",
          contentStyle: {
            backgroundColor: "#fff",
          }
        }}>
        {showSplashScreen ?
            <Stack.Screen name='Splash' options={{ headerShown: false, }}  >
              {() => (<SplashScreen getPermission={getPermission === undefined ? fasle : getPermission} />

              )}
            </Stack.Screen>
            :
            (auth === null) ?
              <Stack.Screen name='LoginPage' options={{ headerShown: false, animation: "fade" }}>
                {() => (<LoginPage getPermission={getPermission === undefined ? fasle : getPermission} userLocation={userLocation === undefined ? {} : userLocation} userAdd={userAdd[0] === undefined ? {} : userAdd[0]} />

                )}
              </Stack.Screen>
              :
              <Stack.Screen name='HomePage' options={{ headerShown: false, animation: 'fade', animationDuration: 500 }}  >
                {() => (<HomePage getPermission={getPermission === undefined ? fasle : getPermission} userLocation={userLocation === undefined ? {} : userLocation} userAdd={userAdd[0] === undefined ? {} : userAdd[0]} />

                )}
              </Stack.Screen>
          }

          <Stack.Screen name='SplashToHomePage' options={{ headerShown: false, animation: 'fade', animationDuration: 100 }}  >
            {() => (<HomePage />

            )}
          </Stack.Screen>
          <Stack.Screen name='OrderSelected' component={OrderSelected} options={{ headerShown: false, animation: "fade", animationDuration: 100, contentStyle: { backgroundColor: "#fff" } }} />

        </Stack.Navigator>


      </NavigationContainer>
    </ReduxProvider>







  );


}
export default App

