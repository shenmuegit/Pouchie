import { Redirect, Tabs } from "expo-router";
import { BarChart3, House, PlusCircle, Receipt, User } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { theme } from "../../src/theme";
import { useAuthStore } from "../../src/store/auth-store";

function TabIcon({
  focused,
  Icon,
  special = false
}: {
  focused: boolean;
  Icon: typeof House;
  special?: boolean;
}) {
  if (special) {
    return (
      <View style={styles.specialWrap}>
        <View style={styles.specialButton}>
          <Icon size={24} color="#fff" />
        </View>
      </View>
    );
  }
  return <Icon size={22} color={focused ? theme.colors.accentBlue : theme.colors.textMuted} />;
}

export default function TabLayout() {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    return <Redirect href="/welcome" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <BlurView tint="light" intensity={35} style={StyleSheet.absoluteFill} />,
        tabBarLabelStyle: styles.tabLabel
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "首页",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={House} />
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "账单",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={Receipt} />
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "记账",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={PlusCircle} special />
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "统计",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={BarChart3} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={User} />
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    height: 76,
    paddingTop: 10,
    borderRadius: theme.radius.xl,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    ...theme.shadow.floating
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2
  },
  specialWrap: {
    marginTop: -32
  },
  specialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.accentBlue,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.9)",
    ...theme.shadow.floating
  }
});
