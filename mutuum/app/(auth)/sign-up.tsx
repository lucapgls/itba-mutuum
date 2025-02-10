import React, { useState } from "react";
import {
	View,
	Alert,
	StyleSheet,
	Text,
	ScrollView,

	Platform,
	KeyboardAvoidingView,

} from "react-native";
import CustomButton from "../../components/CustomButton";
import { router, Link } from "expo-router";
import CustomTextInput from "../../components/CustomTextInput";
import API_BASE_URL from "../../api/api_temp";
import theme from "@theme/theme";
import UserStore from "../../store/UserStore";

export const signUpUser = async (email: string, password: string, display_name: string) => {
	try {
		const response = await fetch(`${API_BASE_URL}/api/v1/users/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password, display_name }),
		});

		if (!response.ok) {
			throw new Error("Failed to create user");
		}

		const data = await response.json();

		UserStore.setUserId(data.user.id);
		UserStore.setWalletId(data.user.wallet_id);
		return data;
	} catch (error) {
		console.error("Error: ", error);
		throw error;
	}
};

const SignUp = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSignUp = async () => {
		setIsLoading(true);
		try {
			await signUpUser(email, password, username);

			// await createUserWithEmailAndPassword(auth, email, password);
			// await addDoc(collection(firestore, "Users"), { email: email });
			Alert.alert("Exito!", "Se creo el usuario correctamente!");
			router.replace("/home");
		} catch (error: any) {
			Alert.alert("Error", error.message);
			console.log(error);
		}
		finally {
			setIsLoading(false);
		}
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
				<Text style={styles.title}>Registrate en</Text>
				<Text style={styles.mutuum}>Mutuum</Text>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View style={{ padding: 20 }}>
					<CustomTextInput
						placeholder="miusuario"
						value={username}
						onChangeText={setUsername}
						title="Nombre de usuario"
					/>
					<View style={{ height: 15 }} />
					<CustomTextInput
						placeholder="miusuario@mail.com"
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
					<CustomButton onPress={handleSignUp} text="Registrarse" disabled={isLoading}/>
					<View style={styles.separator} />
					<Link
						href="/sign-in"
						style={{ textAlign: "center" }}
						replace
					>
						<Text style={{ textAlign: "center", fontSize: 15 }}>
							Ya tenes una cuenta?{" "}
							<Text
								style={{
									color: theme.colors.primary,
									fontWeight: 600,
								}}
							>
								Iniciar sesión
							</Text>
						</Text>
					</Link>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default SignUp;

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,

		backgroundColor: theme.colors.background,
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
		marginBottom: 5,
		color: "black",
		fontSize: 15,
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
	separator: {
		height: 1,
		backgroundColor: theme.colors.borderGray,
		marginVertical: 30,
		width: "80%",
		alignSelf: "center",
	},
});
