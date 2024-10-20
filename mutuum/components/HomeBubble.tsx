import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import UserLoanSmallCard from "./UserLoanSmallCard";
import { Loan } from "../models/Loan";
import { router } from "expo-router";
import theme from '@theme/theme';

const HomeBubble = ({ loans }: { loans: Loan[] }) => {
    return (
        <View style={styles.container}>
            <View style={styles.rectangle}>
                <View style={styles.header}>
                    <Text style={styles.title}>Préstamos recientes</Text>
                    <TouchableOpacity onPress={() => router.push("/myloans")} >
                        <Text style={styles.buttonText}>Ver más</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 6 }} />
                {loans.map((loan) => (
                    <UserLoanSmallCard
                        key={loan.userId}
                        profilePicture="https://media.istockphoto.com/id/1364917563/es/foto/hombre-de-negocios-sonriendo-con-los-brazos-cruzados-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=NqMHLF8T4RzPaBE_WMnflSGB_1-kZZTQgAkekUxumZg=" // todo
                        name={"Nombre"} // todo
                        role={loan.role}
                        amount={loan.amount}
                        coinType={loan.coinType}
                        interests={loan.interests}
                    />
                ))}
            </View>
        </View>
    );
};

export default HomeBubble;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        fontSize: 20,
    },
    rectangle: {
        padding: 20,
        width: "100%",
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: 20,
         // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 4,
        
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    title: {
        fontSize: 18,
        fontWeight: "500",
    },
  
    buttonText: {
        color: theme.colors.primary,
        fontSize: 14,
    },
});