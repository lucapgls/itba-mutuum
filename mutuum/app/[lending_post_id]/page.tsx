import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	Pressable,
	TouchableOpacity,
	Alert,
} from "react-native";
import { getLendingPostByLendingPostId } from "store/LendingPostStore"; // Assuming you have an API function to fetch loan details
import theme from "@theme/theme";
import {
	useRouter,
	useLocalSearchParams,
	useGlobalSearchParams,
	router,
	Stack,
} from "expo-router";
import { askForLoan, getAsking } from "api/lendingPost";
import UserStore from "store/UserStore";
import CustomButton from "@components/CustomButton";
import { fetchUser } from "api/user";
import NotificationDialog from "@components/NotificationDialog";
import { getWalletID, postWalletTransaction } from "api/wallet";
import { runOnJS } from "react-native-reanimated";
import { createLoan } from "api/loan";
import { checkActiveLoanStatus } from "api/loan";

interface Requirement {
	params: {
		lending_post_id: string;
	};
}

const LoanDetailsScreen = ({ params }: Requirement) => {
	const { lending_post_id } = useLocalSearchParams();
	const [loanDetails, setLoanDetails] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [askingIds, setAskingIds] = useState<string[]>([]);
	const [userNames, setUserNames] = useState<{ id: string; name: string }[]>(
		[]
	);
	const currentUser = UserStore.getUserInfo();
	const [user, setUser] = useState<any>(null);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [dialogVisible2, setDialogVisible2] = useState(false);
	const [isLoanAccepted, setIsLoanAccepted] = useState(false);
	const [acceptedUser, setAcceptedUser] = useState<{ id: string; name: string } | null>(null);

	const closeDialog = () => {
		setDialogVisible(false);
		router.push("/home");
	};

	const closeDialog2 = () => {
		setDialogVisible2(false);
	};

	const handleAskForLoan = async () => {
		try {
			askForLoan(currentUser.userId, String(lending_post_id));
		} catch (error) {
			console.error("Error al solicitar préstamo:", error);
		} finally {
			setDialogVisible(true);
		}
	};

	const fetchUserNames = async () => {
		try {
			const names = await Promise.all(
				askingIds.map(async (id) => {
					const user = await fetchUser(id);
					return { id, name: user[0].display_name };
				})
			);
			setUserNames(names);
		} catch (error) {
			console.error("Error al obtener nombres de usuario:", error);
		}
	};

	useEffect(() => {
		const getLoanDetails = async () => {
			try {
				if (lending_post_id) {
					const details = await getLendingPostByLendingPostId(
						String(lending_post_id)
					);
					setLoanDetails(details);
					const user = await fetchUser(details.lender_id);
					setUser(user[0].display_name);
				}
			} catch (error) {
				console.error("Failed to fetch loan details:", error);
			} finally {
				setIsLoading(false);
			}
		};

		const fetchAskingIds = async () => {
			try {
				if (lending_post_id) {
					const data = await getAsking(String(lending_post_id));
					setAskingIds(data);
				}
			} catch (error) {
				console.error(
					"Error al obtener solicitudes de préstamo:",
					error
				);
			}
		};

		getLoanDetails();
		fetchAskingIds();
	}, [lending_post_id]);

	useEffect(() => {
		if (askingIds != null) {
			fetchUserNames();
		}
	}, [askingIds]);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	if (!loanDetails) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>
					Failed to load loan details.
				</Text>
			</View>
		);
	}

	const onAccept = async (toUserId: string) => {
		try {
			if (isLoanAccepted) {
				return;
			}

			const toWalletId = await getWalletID(toUserId);
			const lenderWalletId = currentUser.walletId;
			const amount = Number(loanDetails.initial_amount);

			if (!toWalletId || !lenderWalletId) {
				throw new Error('Invalid wallet IDs');
			}

			// First create the loan record
			const loanResponse = await createLoan(
				lending_post_id as string,
				toUserId,
				amount
			);

			if (!loanResponse) {
				throw new Error('Failed to create loan record');
			}

			// Then process the wallet transaction - lender sends money to borrower
			const transactionResponse = await postWalletTransaction(
				lenderWalletId,  // fromWalletId (lender sends)
				toWalletId,      // toWalletId (borrower receives)
				amount
			);
			
			if (!transactionResponse) {
				throw new Error('Transaction failed');
			}

			const acceptedUserInfo = userNames.find(user => user.id === toUserId);
			if (acceptedUserInfo) {
				setAcceptedUser(acceptedUserInfo);
			}

			setIsLoanAccepted(true);
			setDialogVisible2(true);
			
			setTimeout(() => {
				router.push("/home");
			}, 1000);

		} catch (error) {
			console.error("Error accepting loan request:", error);
			Alert.alert("Error", "No se pudo procesar el préstamo");
			setDialogVisible2(false);
		}
	};

	const handleRequestLoan = async () => {
		setIsLoading(true);
		try {
			if (!currentUser.userId || !loanDetails) {
				Alert.alert("Error", "Debe iniciar sesión para solicitar un préstamo");
				return;
			}

			// Check if user is the owner
			if (currentUser.userId === loanDetails.lender_id) {
				Alert.alert("Error", "No puedes solicitar tu propio préstamo");
				return;
			}

			// Check active loans status
			const loanStatus = await checkActiveLoanStatus(currentUser.userId);
			
			if (loanStatus.hasActiveLoans) {
				if (loanStatus.hasOverduePayments) {
					Alert.alert(
						"Error", 
						"Tienes cuotas pendientes de pago. Por favor, regulariza tu situación para solicitar nuevos préstamos."
					);
				} else {
					Alert.alert(
						"Error", 
						"Ya tienes un préstamo activo. Debes completar los pagos antes de solicitar uno nuevo."
					);
				}
				return;
			}

			const response = await askForLoan(currentUser.userId, lending_post_id as string);
			console.log(response);

			Alert.alert(
				"Éxito",
				"Solicitud enviada correctamente",
				[
					{
						text: "OK",
						onPress: () => router.back(),
					},
				]
			);
		} catch (error) {
			console.error("Error requesting loan:", error);
			Alert.alert("Error", "No se pudo procesar la solicitud");
		} finally {
			setIsLoading(false);
		}
	};

	const showRequestButton = currentUser.userId && currentUser.userId !== loanDetails.lender_id;

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View
				style={[
					styles.detailsContainer,
					theme.shadowAndroid,
					theme.shadowIOS,
				]}
			>
				<View style={styles.infoRow}>
					<Text style={styles.label}>Prestamista</Text>
					<Text style={styles.value}>{user ? user : "Nombre"}</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.label}>Monto</Text>
					<Text style={styles.value}>
						{loanDetails.initial_amount}
					</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.label}>Interes</Text>
					<Text style={styles.value}>{loanDetails.interest}%</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.label}>Plazo</Text>
					<Text style={styles.value}>{loanDetails.quotas} meses</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.label}>Moneda</Text>
					<Text style={styles.value}>
						{loanDetails.currency ?? "USD"}
					</Text>
				</View>
				<Text style={styles.label}>Requerimientos</Text>
				<View style={{ height: 8 }} />
				{loanDetails.requirements.map((req: any, index: number) => (
					<Text key={index} style={styles.requirement}>
						{req.name}{" "}
					</Text>
				))}
			</View>
			<View style={{ height: 25 }} />
			{loanDetails.lender_id === currentUser.userId && (
				<>
					<View style={{ height: 20 }} />
					{isLoanAccepted && acceptedUser ? (
						<View
							style={[
								styles.detailsContainer,
								theme.shadowAndroid,
								theme.shadowIOS,
							]}
						>
							<Text style={styles.title}>Deudor</Text>
							<View style={{ height: 12 }} />
							<View style={styles.infoRow}>
								<Text style={styles.label}>Nombre</Text>
								<Text style={styles.value}>{acceptedUser.name}</Text>
							</View>
							{/* You can add more borrower details here if needed */}
						</View>
					) : (
						<>
							<Text style={styles.title}>Solicitudes</Text>
							{userNames.map(({ id, name }, index) => (
								<View key={index} style={styles.askingRow}>
									<Text style={styles.askingId}>{name}</Text>
									<Pressable
										onPress={() => onAccept(id)}
										style={({ pressed }) => [
											styles.acceptButton,
											pressed && styles.buttonPressed
										]}
									>
										<Text style={{ color: theme.colors.primary }}>
											Aceptar
										</Text>
									</Pressable>
								</View>
							))}
						</>
					)}
					<NotificationDialog
						visible={dialogVisible2}
						onClose={closeDialog2}
						title="Pr��stamo enviado"
						text={"Su prestamo se envió al cliente con exito."}
					/>
				</>
			)}
			{showRequestButton && (
				<TouchableOpacity
					style={[styles.requestButton, isLoading && styles.disabledButton]}
					onPress={handleRequestLoan}
					disabled={isLoading}
				>
					<Text style={styles.requestButtonText}>
						{isLoading ? "Procesando..." : "Solicitar préstamo"}
					</Text>
				</TouchableOpacity>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		padding: 20,
		backgroundColor: theme.colors.background,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: theme.colors.background,
	},
	title: {
		fontSize: 18,
		fontWeight: "500",
		marginBottom: 8,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 18,
	},
	askingRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	label: {
		color: theme.colors.textBlack,
		fontWeight: "500",
		fontSize: 15,
	},
	value: {
		fontSize: 15,
		color: theme.colors.textBlack,
	},
	requirement: {
		fontSize: 15,
		marginLeft: 18,
	},
	errorText: {
		fontSize: 18,
		color: "red",
	},
	detailsContainer: {
		width: "100%",
		padding: 18,
		backgroundColor: "white",
		borderRadius: 20,
	},
	askingId: {
		fontSize: 15,
		color: theme.colors.textBlack,
		marginTop: 0,
	},
	button: {
		
		alignItems: "center",
		justifyContent: "center",
	},
	acceptButton: {
		padding: 8,
		borderRadius: 4,
	},
	buttonPressed: {
		opacity: 0.7,
	},
	requestButton: {
		backgroundColor: theme.colors.primary,
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 30,
	},
	requestButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	disabledButton: {
		opacity: 0.7,
	},
});

export default LoanDetailsScreen;
