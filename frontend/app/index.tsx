import { auth } from '@/firebaseConfig'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'

export default function Index() {
	const router = useRouter()

	useEffect(() => {
		auth.onAuthStateChanged(currentUser => {
			if (currentUser) {
				router.push('/(tabs)/team')
				return
			} else {
				router.push('/login')
				return
			}
		})
	})
}