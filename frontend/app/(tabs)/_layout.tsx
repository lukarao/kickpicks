import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Fontisto from '@expo/vector-icons/Fontisto';
import { Image, View } from 'react-native'
import { Tabs } from 'expo-router'
import { User, signOut } from 'firebase/auth'
import { auth } from '@/firebaseConfig'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'

export default function TabLayout() {
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
		auth.onAuthStateChanged(currentUser => {
			if (currentUser) {
				setUser(currentUser)
			} else {
				router.push('/login')
				return
			}
		})
	})

    return (
        <Tabs screenOptions={{
            headerTitleAlign: 'left',
            headerRight: () => {return (
                <View>
                    <Image source={{uri: (user?.photoURL as string)}} />
                </View>
            )},
            tabBarActiveTintColor: 'black',
            tabBarShowLabel: false
        }}>
            <Tabs.Screen
                name="league"
                options={{
                    title: 'League',
                    tabBarIcon: ({ color }) => <Fontisto name="flag" size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="team"
                options={{
                    title: 'Team',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="users" color={color} />
                }}
            />
            <Tabs.Screen
                name="leaderboard"
                options={{
                    title: 'Leaderboard',
                    tabBarIcon: ({ color }) => <FontAwesome6 size={24} name="ranking-star" color={color} />
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="cog" color={color} />
                }}
            />
        </Tabs>
    )
}