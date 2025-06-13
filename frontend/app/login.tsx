import { Controller, useForm } from 'react-hook-form'
import { Link, useRouter } from 'expo-router'
import { Pressable, Text, TextInput, View } from 'react-native'
import { auth } from '@/firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'

type FormData = {
	email: string
	password: string
}

export default function Login() {
	const {control, handleSubmit, setError, formState: {errors}} = useForm<FormData>({defaultValues: {email: '', password: ''}})
	const router = useRouter()

	const onSubmit = handleSubmit((data) => {
		signInWithEmailAndPassword(auth, data.email, data.password)
			.then(() => {
				router.push('/')
			})
			.catch((error) => {
				console.log(error.message)
				setError('password', {type: 'custom', message: 'Email or password is incorrect.'})
			})
	})

	return (
		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
			<Text>Log in</Text>
            
			<Text>Email</Text>
			<Controller control={control} rules={{required: true}} render={({field: {onChange, onBlur, value}}) => (
            	<TextInput autoComplete="email" inputMode="email" onChangeText={onChange} onBlur={onBlur} value={value} />
			)} name="email" />
      		{errors.email && <Text>{errors.email.message ? errors.email.message : "This field is required."}</Text>}
						
			<Text>Password</Text>
			<Link href="/">Forgot password?</Link>
			<Controller control={control} rules={{required: true}} render={({field: {onChange, onBlur, value}}) => (
            	<TextInput autoComplete="current-password" secureTextEntry={true} onChangeText={onChange} onBlur={onBlur} value={value} />
			)} name="password" />
      		{errors.password && <Text>{errors.password.message ? errors.password.message : "This field is required."}</Text>}

			<Pressable onPress={onSubmit}>
				<Text>Log in</Text>
			</Pressable>

			<Text>Don't have an account? <Link href="/signup">Sign up</Link></Text>
		</View>
	)
}