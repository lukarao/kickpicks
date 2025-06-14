import { Pressable, StyleSheet, Text, View } from 'react-native'
import { User, signOut } from 'firebase/auth'
import { auth } from '@/firebaseConfig'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'

export default function Team() {
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

	function logout() {
		signOut(auth).then(() => {
			router.push('/login')
		}).catch((error) => {
			console.log(error.message)
		})
	}

	return (
		<View style={styles.container}>
			<Text>Hello, {user && user.displayName}!</Text>

			<Pressable onPress={logout}>
				<Text>Log out</Text>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})