import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap
} from '@react-navigation/material-top-tabs'
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';

const {Navigator} = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
MaterialTopTabNavigationOptions,
typeof Navigator,
TabNavigationState<ParamListBase>,
MaterialTopTabNavigationEventMap
>(Navigator);

const Layout = () => {
    return (
        <MaterialTopTabs 
            screenOptions={{
                tabBarStyle: {backgroundColor:'#242424'}, 
                tabBarIndicatorStyle: {backgroundColor: '#FF6E40'},
                tabBarLabelStyle: { color: "#F3ECEC", fontSize: 13, fontWeight: 'bold', textTransform: 'capitalize', alignItems: 'center'},
                tabBarContentContainerStyle: {justifyContent: 'space-evenly'}
            }}
        >
            <MaterialTopTabs.Screen name='index' options={{ title: 'Home'  }} />
            <MaterialTopTabs.Screen name='expences' options={{ title: 'expences' }} />
            <MaterialTopTabs.Screen name='training' options={{ title: 'training' }} />
            <MaterialTopTabs.Screen name='todo' options={{ title: 'todos' }} />
        </MaterialTopTabs>
    )
}

export default Layout;