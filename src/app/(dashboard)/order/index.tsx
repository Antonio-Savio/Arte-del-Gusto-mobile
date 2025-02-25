import { 
    SafeAreaView, 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput,
    Modal,
    FlatList,
    ActivityIndicator
} from 'react-native'
import { useState, useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import colors from '@/constants/colors'
import { FontAwesome } from '@expo/vector-icons'
import { api } from '@/src/services/api'
import { ModalPicker } from '@/src/components/ModalPicker'
import { OrderItem } from '@/src/components/OrdemItem'

type SearchParamsProps = {
    table: string;
    customer?: string;
    order_id: string;
}

type ProductProps = {
    id: string;
    name: string;
}

export type CategoryProps = {
    id: string;
    name: string;
}

type ItemProps = {
    id: string;
    product_id: string;
    name: string;
    amount: string | number;
}

export default function Order(){
    const { table, customer, order_id } = useLocalSearchParams<SearchParamsProps>()
    
    const [categories, setCategories] = useState<CategoryProps[] | []>([])
    const [categorySelected, setCategorySelected] = useState<CategoryProps>()
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
    
    const [products, setProducts] = useState<ProductProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductProps>();
    const [modalProductVisible, setModalProductVisible] = useState(false);    
    
    const [amount, setAmount] = useState('1')

    const [items, setItems] = useState<ItemProps[]>([])

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    useEffect(() => {
        async function getCategories(){
            const response = await api.get("/category");

            setCategories(response.data);
            setCategorySelected(response.data[0])
        }

        getCategories();

    }, [])

    useEffect(() => {

        async function getProducts(){
            const response = await api.get("/category/product", {
                params: {
                    category_id: categorySelected?.id
                }
            })

            setProducts(response.data);
            setProductSelected(response.data[0]);
        }

        getProducts();

    }, [categorySelected])

    async function handleDeleteOrder(){
        try{

            await api.delete('/order', {
                params: {
                    order_id
                }
            })

            router.back()

        } catch(err){
            console.log(err)
        }
    }

    async function handleAddItem(){
        const response = await api.post("/order/add", {
            order_id: order_id,
            product_id: productSelected?.id,
            amount: Number(amount)
        })

        let data: ItemProps = {
            id: response.data.id,
            name: productSelected?.name as string,
            product_id: productSelected?.id as string,
            amount: amount
        }

        setItems(oldList => [data, ...oldList])
    }

    async function handleDeleteItem(item_id: string){
        await api.delete("/order/remove", {
            params: {
                item_id: item_id
            }
        })

        const filteredItems = items.filter( item => {
            return item.id !== item_id
        })

        setItems(filteredItems);
    }

    function handleConcludeOrder(){
        router.push({
            pathname: '/(dashboard)/conclude',
            params: { order_id, table }
        })
    }

    if (loading){
        return(
            <View
            style={{ 
                flex: 1,
                backgroundColor: colors.background, 
                justifyContent: 'center', 
                alignItems: 'center'
            }}
            >
            <ActivityIndicator  size={40} color='#fff' />
            </View>
        )
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Mesa {table} {customer && `| ${customer}`}
                </Text>

                {items.length === 0 && (
                    <TouchableOpacity onPress={handleDeleteOrder}>
                        <FontAwesome name='trash' size={25} color='#f00' />
                    </TouchableOpacity>
                )}
            </View>
            
            <TouchableOpacity style={styles.input} onPress={ () => setModalCategoryVisible(true) }>
                <Text style={{ color: '#fff' }}>
                    {categorySelected?.name}
                </Text>
            </TouchableOpacity>

            {products.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={ () => setModalProductVisible(true) }>
                    <Text style={{ color: '#fff' }}>
                        {productSelected?.name}
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.amountContainer}>
                <Text style={styles.amountText}>Quantidade</Text>
                <TextInput
                    placeholderTextColor={colors.gray}
                    keyboardType='numeric'
                    value={amount}
                    onChangeText={setAmount}
                    style={[styles.input, { width: '60%', textAlign: 'center' }]}
                />
            </View>

            <View style={styles.actions}>
                <TouchableOpacity 
                    style={[styles.buttonAdd, styles.button]}
                    onPress={handleAddItem}    
                >
                    <FontAwesome name='plus' size={25} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.buttonAdvance, styles.button, { opacity: items.length === 0 ? 0.5 : 1 }]}
                    disabled={items.length === 0}
                    onPress={handleConcludeOrder}
                >
                    <Text style={styles.buttonText}>Prosseguir</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginVertical: 25 }}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <OrderItem data={item} deleteItem={handleDeleteItem} />}
            />

            <Modal
                transparent={true}
                visible={modalCategoryVisible}
                animationType='fade'
            >

                <ModalPicker
                    handleCloseModal={ () => setModalCategoryVisible(false) }
                    options={categories}
                    selectedItem={ (item) => setCategorySelected(item) }
                />
            
            </Modal>

            <Modal
                transparent={true}
                visible={modalProductVisible}
                animationType='fade'
            >

                <ModalPicker
                    handleCloseModal={ () => setModalProductVisible(false) }
                    options={products}
                    selectedItem={ (item) => setProductSelected(item) }
                />
            
            </Modal>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingStart: '4%',
        paddingEnd: '4%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 40,
        gap: 10
    },
    title: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold'
    },
    input: {
        backgroundColor: colors.dark,
        width: '100%',
        borderRadius: 4,
        height: 40,
        marginBottom: 15,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
        paddingHorizontal: 10,
        color: '#fff',
        fontSize: 20
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    amountText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    button: {
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonAdd: {
        width: '20%',
        backgroundColor: colors.golden
    },
    buttonAdvance: {
        width: '75%',
        backgroundColor: '#4a4'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.background
    }
})