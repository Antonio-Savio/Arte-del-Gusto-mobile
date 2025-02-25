import { router, Stack } from "expo-router";
import { AuthProvider, AuthContext } from "@/src/contexts/AuthContext";
import { useContext, useEffect } from "react";
import colors from "@/constants/colors";

export default function RootLayout() {
  return(
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  )
}

function MainLayout(){
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {

    if (!loading){
      if (user?.token) {
          router.replace("/(dashboard)/dashboard");
      } else {
          router.replace("/signin");
      }
    }

  }, [user, loading]);

  return(
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      <Stack.Screen name="signin/index" options={{ title: "Login", headerShown: false }} />
      
      <Stack.Screen name="(dashboard)/dashboard/index" options={{ title: "Dashboard", headerShown: false }} />

      <Stack.Screen name="(dashboard)/order/index" options={{ title: "Pedido", headerShown: false }} />

      <Stack.Screen name="(dashboard)/conclude/index" options={{ 
        title: "Concluir pedido",
        headerStyle: {
          backgroundColor: colors.background
        },
        headerTintColor: '#fff'
      }} />
    </Stack>
  )
}