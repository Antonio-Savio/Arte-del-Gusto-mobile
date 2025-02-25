import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native'
import { CategoryProps } from '@/src/app/(dashboard)/order'
import colors from '@/constants/colors';

interface ModalPickerProps{
    options: CategoryProps[];
    handleCloseModal: () => void;
    selectedItem: (item: CategoryProps) => void;
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

export function ModalPicker({ options, handleCloseModal, selectedItem }: ModalPickerProps){
    function onPressOption(item: CategoryProps){
        selectedItem(item);
        handleCloseModal();
    }    

    return(
        <TouchableOpacity style={styles.container} onPress={handleCloseModal} >
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {options.map( option => (
                        <TouchableOpacity 
                            key={option.id} 
                            onPress={ () => onPressOption(option)}
                            style={styles.option}
                        >
                            <Text style={styles.item}>
                                {option?.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
        width: WIDTH - 20,
        maxHeight: HEIGHT / 2,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 4
    },
    option: {
        alignItems: 'flex-start',
        borderTopWidth: 0.8,
        borderTopColor: colors.gray
    },
    item: {
        margin: 18,
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.background
    }
})