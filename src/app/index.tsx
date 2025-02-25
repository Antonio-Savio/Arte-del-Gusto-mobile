import { ActivityIndicator, View } from "react-native";
import colors from "@/constants/colors";

export default function Index(){
    return(
        <View
          style={{ 
            flex: 1,
            backgroundColor: colors.background, 
            justifyContent: 'center', 
            alignItems: 'center'
          }}
        >
          <ActivityIndicator size={40} color='#fff' />
        </View>
      )
}