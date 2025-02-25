import { useContext, useState } from 'react'
import { AuthContext } from '@/src/contexts/AuthContext'
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, TextInput } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import colors from '@/constants/colors'
import { router } from 'expo-router'
import { api } from '@/src/services/api'

export default function Dashboard(){
    const {signOut} = useContext(AuthContext);

    const [table, setTable] = useState('');
    const [customer, setCustomer] = useState('');

    async function openOrder(){
        if (table === '') return;

        const response = await api.post("/order", {
            table: Number(table),
            name: customer
        })

        router.push({
            pathname: '/(dashboard)/order',
            params: { table, customer, order_id: response.data.id }
        })
        
        setTable('');
        setCustomer('');
    }

    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={signOut} style={styles.logout}>
                <FontAwesome name='sign-out' size={25} color='#f00' />
            </TouchableOpacity>

            <Text style={styles.title}>Novo pedido</Text>

            <TextInput
                placeholder='Número da mesa'
                placeholderTextColor={colors.gray}
                style={styles.input}
                keyboardType='numeric'
                value={table}
                onChangeText={setTable}
            />

            <TextInput
                placeholder='Cliente (opcional)'
                placeholderTextColor={colors.gray}
                style={styles.input}
                value={customer}
                onChangeText={setCustomer}
            />

            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.buttonTitle}>Abrir mesa</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: colors.background,
        position: 'relative'
    },
    logout: {
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 25,
        marginTop: 60
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 24
    },
    input: {
        width: '90%',
        backgroundColor: colors.dark,
        height: 50,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: '#fff',
        fontSize: 22,
        textAlign: 'center',
        borderWidth: 1,
        marginVertical: 8,
        borderColor: colors.gray
    },
    button: {
        width: '90%',
        backgroundColor: '#4a4',
        height: 50,
        borderRadius: 4,
        marginVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark
    }
})