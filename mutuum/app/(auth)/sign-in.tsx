import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Platform
} from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import GoogleButton from "../../components/GoogleButton";
import CustomTextInput from "../../components/CustomTextInput";
import theme from '@theme/theme';

import API_BASE_URL from "../../api/api_temp";
import UserStore from "../../store/UserStore";

// Sign in the user with email and password
export const signInUser = async (email: string, password: string) => {
	// TEMP TODO
	try {
	const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	});

		if (!response.ok) { 
			throw new Error("Error al intentar iniciar sesión");
	  	}
  
	  	const data = await response.json();
		UserStore.setUserId(data.user.id);
		UserStore.setWalletId(data.user.wallet_id);
		const aux = await UserStore.fetchUserInfo();
	  	return data;
	} catch (error) {
	  console.error("Error: ", error);
	  throw error;
	}
};


const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSignIn = async () => {
		setIsLoading(true);
		try {
		const data = await signInUser(email, password);
		if (data) {
			
			router.push('/home');
			// TODO: set the user in the global state
		  }
		} catch (error) {
			console.error("Failed to fetch user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		console.log("Not yet implemented");
	};

	return (
		<KeyboardAvoidingView
			style={{
				flex: 1,
				flexDirection: "column",
				justifyContent: "flex-start",
			}}
			behavior={Platform.OS == "ios" ? "padding" : "height"}
			enabled
		>
			<View style={styles.rectangle}>
				<View style={{ height: 30 }} />
				<Text style={styles.title}>Bienvenido a</Text>
				<Text style={styles.mutuum}>Mutuum</Text>
			</View>

			<ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
				
				<CustomTextInput
					placeholder="mi_usuario@mail.com"
					value={email}
					onChangeText={setEmail}
					title="Email"
				/>

				<View style={{ height: 15 }} />
				
				<CustomTextInput
					placeholder="********"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					title="Contraseña"
				/>
				<View style={{ height: 25 }} />
				<CustomButton onPress={handleSignIn} text="Iniciar sesión" disabled={isLoading} />
				<Text
					style={{ textAlign: "center", marginTop: 20, fontSize: 15 }}
				>
					o{" "}
				</Text>

				<View style={styles.googleButtonContainer}>
					<GoogleButton onPress={handleGoogleSignIn} />
				</View>
				<View style={styles.separator} />
				<Link href="/sign-up" style={{ textAlign: "center" }} replace>
					<Text style={{ textAlign: "center", fontSize: 15 }}>
						¿Todavía no tenes cuenta?{" "}
						<Text style={{ color: theme.colors.primary, fontWeight: 600 }}>
							Registrate
						</Text>
					</Text>
				</Link>

				{/* <Link href="/home" style={{ textAlign: "center", marginTop:20 }} replace>
					<Text style={{ textAlign: "center", fontSize: 15 }}>
						Continuar como{" "}
						<Text style={{ color: theme.colors.primary, fontWeight: 600 }}>
							invitado
							</Text>
					</Text>
				</Link> */}
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,

		backgroundColor:  theme.colors.background,
		justifyContent: "flex-start",
	},
	container: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		width: "100%",
		backgroundColor: theme.colors.background,
	},
	title: {
		color: "white", // Replace with your desired primary color
		fontSize: 40, // Tailwind's text-5xl is approximately 40px
		fontWeight: "400",
	},
	mutuum: {
		color: "white",
		fontSize: 50,
		fontWeight: "bold",
	},
	rectangle: {
		width: "100%",
		height: 260,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.colors.primary,
	},
	text: {
		color: "black",
		fontSize: 15,
		marginBottom: 5,
	},
	input: {
		fontSize: 15,
		color: theme.colors.textBlack,
		paddingStart: 10,
	},
	border: {
		width: "100%",
		height: 50,
		backgroundColor: "white",
		borderColor: theme.colors.borderGray,
		borderWidth: 2,
		borderRadius: 12,
		justifyContent: "center",
		marginTop: 8,
	},
	googleButton: {
		marginTop: 15,
		borderRadius: 30,
	},
	googleButtonContainer: {
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		marginTop: 20,
	},
	separator: {
		height: 1,
		backgroundColor: theme.colors.borderGray,
		marginVertical: 30,
		width: "80%",
		alignSelf: "center",
	},
});

export default SignIn;
