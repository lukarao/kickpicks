import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Fontisto from '@expo/vector-icons/Fontisto';
import { Image, StyleSheet, View } from 'react-native'
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
            headerStyle: {height: 100},
            headerTitleAlign: 'left',
            headerRight: () => {return (
                <View>
                    <Image source={{uri: (user?.photoURL as string)}} style={styles.image} />
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

const styles = StyleSheet.create({
    image: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'rgb(216, 216, 216)'
    }
})