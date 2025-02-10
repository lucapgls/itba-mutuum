import React, { useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { AirbnbRating } from "react-native-ratings";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomButton from "./CustomButton";
import theme from "@theme/theme";

interface RatingBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    userId: string;
    onSubmitRating: (userId: string, rating: number) => Promise<void>;
}

const RatingBottomSheet: React.FC<RatingBottomSheetProps> = ({
    isVisible,
    onClose,
    userId,
    onSubmitRating,
}) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [rating, setRating] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Calculate snap points
    const snapPoints = useMemo(() => ["35%"], []);

    const handleRating = (value: number) => {
        setRating(value);
    };

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await onSubmitRating(userId, rating);
            onClose();
        } catch (error) {
            console.error("Error submitting rating:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <GestureHandlerRootView style={styles.sheetContainer}>
                            <BottomSheet
                                ref={bottomSheetRef}
                                index={0}
                                snapPoints={snapPoints}
                                enablePanDownToClose={true}
                                onClose={onClose}
                                handleComponent={() => (
                                    <View style={styles.handleContainer}>
                                        <View style={styles.handle} />
                                    </View>
                                )}
                            >
                                <View style={styles.contentContainer}>
                                    <Text style={styles.title}>Calificar al prestatario</Text>
                                    <View style={styles.ratingContainer}>
                                        <AirbnbRating
                                            count={5}
                                            defaultRating={0}
                                            size={20}
                                            showRating={false}
                                            onFinishRating={handleRating}
                                        />
                                    </View>
                                    <CustomButton
                                        text="Enviar calificación"
                                        onPress={handleSubmit}
                                        disabled={rating === 0 || isSubmitting}
                                    />
                                </View>
                            </BottomSheet>
                        </GestureHandlerRootView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    sheetContainer: {
        flex: 1,
    },
    handleContainer: {
        alignItems: "center",
        paddingVertical: 10,
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#ccc",
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    ratingContainer: {
        marginBottom: 20,
    },
});

export default RatingBottomSheet;