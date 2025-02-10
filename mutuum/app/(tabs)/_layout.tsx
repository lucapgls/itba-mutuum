import {
	View,
	Text,
	Image,
	ImageSourcePropType,
	StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../constants";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

import theme from "@theme/theme";

const TabIcon = ({
	icon,
	iconFocused,
	color,
	name,
	focused,
}: {
	icon: ImageSourcePropType;
	iconFocused: ImageSourcePropType;
	color: string;
	name: string;
	focused: boolean;
}) => {
	return (
		<View style={styles.container}>
			<Image
				source={focused ? iconFocused : icon}
				resizeMode="contain"
				style={[styles.icon, { tintColor: color }]}
			/>
			{/* <Text style={[styles.text, { color: color }]}>{name}</Text> */}
		</View>
	);
};

const tabBarHeight = Platform.OS === "ios" ? 90 : 70;

const TabsLayout = () => {



	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: theme.colors.primary,
					tabBarInactiveTintColor: theme.colors.tabInactive,
					tabBarShowLabel: true,

					tabBarStyle: {
						backgroundColor: "#FFF",
						height: tabBarHeight,
						borderTopWidth: 0,

						// shadowColor: '#000000',
						// shadowOpacity: 0.1,
						// shadowRadius: 10,
					},
				}}
        screenListeners={{
          tabPress: (e) => {
            Haptics.selectionAsync();
          },
        }
        }
			>
				<Tabs.Screen
					name="home"
					options={{
						title: "Inicio",
						headerShown: false,
						headerLeft: () => null,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.home}
								iconFocused={icons.homeFocus}
								color={color}
								name="Inicio"
								focused={focused}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="explore"
					options={{
						title: "Explorar",
						headerShown: false,
						headerLeft: () => null,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.explore}
								iconFocused={icons.exploreFocus}
								color={color}
								name="Explorar"
								focused={focused}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="myloans"
					options={{
						title: "Mis Préstamos",
						headerShown: false,
						headerLeft: () => null,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.loan}
								iconFocused={icons.loanFocus}
								color={color}
								name="Mis Préstamos"
								focused={focused}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "Perfil",
						headerShown: false,
						headerLeft: () => null,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon
								icon={icons.profile}
								iconFocused={icons.profileFocus}
								color={color}
								name="Perfil"
								focused={focused}
							/>
						),
					}}
				/>
			</Tabs>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 10,
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		marginBottom: 10,
	},
	icon: {
		width: 32, // Tailwind's w-6 is 24px
		height: 32, // Tailwind's h-6 is 24px
	},
	text: {
		fontSize: 12,
	},
});

export default TabsLayout;