import Head from 'expo-router/head'
import { Controller, useForm } from 'react-hook-form'
import { Link, useRouter } from 'expo-router'
import { Pressable, Text, TextInput, View } from 'react-native'
import { auth } from '@/firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { profanity } from '@2toad/profanity'

type FormData = {
    name: string
	email: string
	password: string
}

const emailExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

export default function SignUp() {
    const {control, handleSubmit, setError, formState: {errors}} = useForm<FormData>({defaultValues: {email: "", password: ""}})
    const router = useRouter()

	const onSubmit = handleSubmit((data) => {
        if (profanity.exists(data.name)) {
            setError("name", {type: "custom", message: "Name cannot contain profanity."})
            return
        }
        if (!emailExp.test(data.email)) {
            setError("email", {type: "custom", message: "Email has to be a valid email."})
            return
        }
        if (data.password.length < 8) {
            setError("password", {type: "custom", message: "Password has to be at least 8 characters."})
            return
        }
        if (data.password.length > 4096) {
            setError("password", {type: "custom", message: "Password is too long."})
            return
        }
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                updateProfile(userCredential.user, {displayName: data.name})
                    .then(() => {
                        router.push('/')
                    }).catch((error) => {
                        console.log(error.message)
                        setError("password", {type: "custom", message: "An error has occurred."})        
                    })
            })
            .catch((error) => {
				console.log(error.message)
                setError("password", {type: "custom", message: "An error has occurred."})
            })
	})

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Head>
                <title>Sign up - Kinkajou</title>
            </Head>
                        
            <Text>Sign up</Text>
            
            <Text>Name</Text>
			<Controller control={control} rules={{required: true}} render={({field: {onChange, onBlur, value}}) => (
            	<TextInput autoComplete="name" onChangeText={onChange} onBlur={onBlur} value={value} />
			)} name="name" />
      		{errors.name && <Text>{errors.name.message ? errors.name.message : "This field is required."}</Text>}
            
            <Text>Email</Text>
			<Controller control={control} rules={{required: true}} render={({field: {onChange, onBlur, value}}) => (
            	<TextInput autoComplete="email" inputMode="email" onChangeText={onChange} onBlur={onBlur} value={value} />
			)} name="email" />
      		{errors.email && <Text>{errors.email.message ? errors.email.message : "This field is required."}</Text>}
            
            <Text>Password</Text>
			<Controller control={control} rules={{required: true}} render={({field: {onChange, onBlur, value}}) => (
            	<TextInput autoComplete="new-password" secureTextEntry={true} onChangeText={onChange} onBlur={onBlur} value={value} />
			)} name="password" />
      		{errors.password && <Text>{errors.password.message ? errors.password.message : "This field is required."}</Text>}
            
            <Pressable onPress={onSubmit}>
                <Text>Sign up</Text>
            </Pressable>
			
            <Text>Already have an account? <Link push href="/login">Log in</Link></Text>
        </View>
    )
}