import { Redirect, Tabs } from "expo-router";
import { PlusCircle, Receipt, User, type LucideIcon } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { theme } from "../../src/theme";
import { useAuthStore } from "../../src/store/auth-store";

function TabIcon({
  focused,
  Icon
}: {
  focused: boolean;
  Icon: LucideIcon;
}) {
  return <Icon size={23} color={focused ? theme.colors.accentBlue : theme.colors.textMuted} />;
}

export default function TabLayout() {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    return <Redirect href="/welcome" />;
  }
  return (
    <Tabs
      initialRouteName="add"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "记账",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} Icon={PlusCircle} />
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
    height: 68,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopWidth: 1,
    borderTopColor: "rgba(15,23,42,0.08)"
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700"
  }
});
