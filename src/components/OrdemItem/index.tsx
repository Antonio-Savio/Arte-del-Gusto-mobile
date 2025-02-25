import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { FontAwesome } from '@expo/vector-icons'
import colors from "@/constants/colors";
import { router } from "expo-router";

interface ItemProps {
    data: {
        id: string;
        product_id: string;
        name: string;
        amount: string | number;
    };
    deleteItem: (item_id: string) => void;
}

export function OrderItem({ data, deleteItem }: ItemProps){
    function handleDelete(){
        deleteItem(data.id);
    }

    return(
        <View style={styles.container}>
            <Text style={styles.item}>{data.amount} - {data.name}</Text>
            <TouchableOpacity onPress={handleDelete}>
                <FontAwesome name="trash" size={20} color='#f00' />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 14,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.gray
    },
    item: {
        color: '#fff',
    }
})