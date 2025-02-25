import colors from "@/constants/colors";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { api } from "@/src/services/api";

type SearchParamsProps = {
    table: string;
    order_id: string;
}

export default function ConcludeOrder(){
    const { table, order_id } = useLocalSearchParams<SearchParamsProps>()

    async function handleFinish(){
        try {
            await api.put('/order/send', {
                order_id: order_id
            })

            router.replace('/(dashboard)/dashboard')

        } catch(err){
            console.log("Erro ao finalizar pedido", err)
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.confirm}>Você deseja concluir este pedido?</Text>
            <Text style={[styles.confirm, { fontSize: 28 }]}>Mesa {table}</Text>

            <TouchableOpacity style={styles.concludeBtn} onPress={handleFinish}>
                <Text style={styles.textBtn}>Concluir</Text>
                <FontAwesome name="cart-plus" size={20} color={colors.background} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    confirm: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 12,
        fontSize: 20
    },
    concludeBtn: {
        backgroundColor: '#4a4',
        flexDirection: 'row',
        width: '65%',
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textBtn: {
        marginRight: 10,
        fontWeight: 'bold',
        fontSize: 18,
        color: colors.background
    }
})