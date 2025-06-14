import * as ImagePicker from 'expo-image-picker'
import { Controller, useForm } from 'react-hook-form'
import { Link, useRouter } from 'expo-router'
import { auth, storage } from '@/firebaseConfig'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { profanity } from '@2toad/profanity'
import { useState } from 'react'

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native'

type FormData = {
    name: string
	email: string
	password: string
}

const emailExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

export default function SignUp() {
    const {control, handleSubmit, setError, formState: {errors}} = useForm<FormData>({defaultValues: {email: "", password: ""}})
    const [image, setImage] = useState<string | null>(null)

    const router = useRouter()

	const onSubmit = handleSubmit((data) => {
        if (profanity.exists(data.name)) {
            setError('name', {type: 'custom', message: 'Name cannot contain profanity.'})
            return
        }
        if (!emailExp.test(data.email)) {
            setError('email', {type: 'custom', message: 'Email has to be a valid email.'})
            return
        }
        if (data.password.length < 8) {
            setError('password', {type: 'custom', message: 'Password has to be at least 8 characters.'})
            return
        }
        if (data.password.length > 4096) {
            setError('password', {type: 'custom', message: 'Password is too long.'})
            return
        }
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                if (image) {
                    try {
                        new Promise((resolve, reject) => {
                            const xhr = new XMLHttpRequest()
                            xhr.onload = () => {
                                resolve(xhr.response)
                            }
                            xhr.onerror = () => {
                                reject(new Error('An error has occured.'))
                            }
                            xhr.responseType = 'blob'
                            xhr.open('GET', image, true)
                            xhr.send(null)
                        }).then((blob) => {
                            const storageRef = ref(storage, 'users/' + userCredential.user.uid + '/profilePicture.' + image.split('.').pop())
                            uploadBytes(storageRef, blob as Blob).then(() => {
                                getDownloadURL(storageRef).then((url) => {
                                    updateProfile(userCredential.user, {displayName: data.name, photoURL: url}).then(() => {
                                        router.push('/')
                                    })
                                })
                            })
                        })
                    } catch {
                        setError('password', {type: 'custom', message: 'An error has occurred.'})
                        return
                    }
                } else {
                    updateProfile(userCredential.user, {displayName: data.name})
                    .then(() => {
                        router.push('/')
                    }).catch(() => {
                        setError('password', {type: 'custom', message: 'An error has occurred.'})
                        return
                    })
                }
            })
            .catch(() => {
                setError('password', {type: 'custom', message: 'An error has occurred.'})
                return
            })
	})

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>                    
            <Text>Sign up</Text>
            
            <Text>Name</Text>
			<Controller control={control} rules={{required: true}} render={({field: {onChange, onBlur, value}}) => (
            	<TextInput autoComplete="name" onChangeText={onChange} onBlur={onBlur} value={value} />
			)} name="name" />
      		{errors.name && <Text>{errors.name.message ? errors.name.message : "This field is required."}</Text>}

            <Text>Profile picture</Text>
            <Pressable onPress={pickImage}><Text>Pick an image</Text></Pressable>
            {image && <Image source={{uri: image}} style={styles.image} />}

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

const styles = StyleSheet.create({
	image: {
        width: 200,
        height: 200
	}
})