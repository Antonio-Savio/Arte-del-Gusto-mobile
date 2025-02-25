import { useState } from 'react'
import { useContext } from "react";
import { AuthContext } from "@/src/contexts/AuthContext";
import { 
    View, 
    Text, 
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native'
import colors from '@/constants/colors'

const { width } = Dimensions.get("window")

export default function SignIn(){
    const { signIn, loadingAuth } = useContext(AuthContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    async function handleLogin(){
        if(email === '' || password === '') return;

        await signIn({ email, password })
    }

    return(
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flexGrow: 1, backgroundColor: colors.background }}
            >
                <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <View style={styles.container}>
                        <Image
                            style={styles.logo}
                            source={require('@/assets/images/logo-arte-del-gusto.png')}
                        />

                        <View style={styles.inputArea}>
                            <TextInput
                                placeholder='Digite seu email'
                                style={[
                                    styles.input, 
                                    emailFocus && styles.inputFocus
                                ]}
                                placeholderTextColor='#9ca3af'
                                value={email}
                                onChangeText={setEmail}
                                onFocus={ () => setEmailFocus(true)}
                                onBlur={ () => setEmailFocus(false)}
                            />
                            <TextInput
                                placeholder='Digite sua senha'
                                style={[
                                    styles.input, 
                                    passwordFocus && styles.inputFocus
                                ]}
                                placeholderTextColor='#9ca3af'
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                                onFocus={ () => setPasswordFocus(true)}
                                onBlur={ () => setPasswordFocus(false)}
                            />

                            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                                {loadingAuth ? (
                                    <ActivityIndicator size={25} color='#fff' />
                                ): (
                                    <Text style={styles.buttonText}>Entrar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    logo: {
        marginBottom: 18,
        width: width * 0.6,
        height: width * 0.6,
        resizeMode: 'contain',
    },
    inputArea: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 30
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: colors.dark,
        marginBottom: 16,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: '#fff',
        borderWidth: 1,
        borderColor: colors.gray
    },
    inputFocus: {
        borderColor: colors.golden
    },
    button: {
        height: 40,
        width: '100%',
        backgroundColor: '#4a4',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark
    }
})