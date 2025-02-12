import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../constant/constant";

// Fetch contacts function
const fetchContacts = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("User token not found.");

    const response = await fetch(`${baseUrl}/api/contacts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error("Failed to fetch contacts");

    const data = await response.json();
    return data?.contacts || [];
};

// Delete contact function
const deleteContact = async (contactId) => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("User token not found.");

    const response = await fetch(`${baseUrl}/api/contacts?id=${contactId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error("Failed to delete contact");

    return response.json(); 
};

export default function ManageContacts() {
    const queryClient = useQueryClient();

    // Fetch contacts with React Query
    const { data: contacts, isLoading, error } = useQuery({
        queryKey: ["contacts"],
        queryFn: fetchContacts,
    });

    // Mutation for deleting a contact
    const mutation = useMutation({
        mutationFn: deleteContact,
        onSuccess: () => {
            queryClient.invalidateQueries(["contacts"]); // Refetch contacts after deletion
        },
        onError: (error) => {
            Alert.alert("Error", error.message);
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Manage Contacts</Text>

            {isLoading && <Text>Loading contacts...</Text>}
            {error && <Text>Error: {error.message}</Text>}

            <FlatList
                data={contacts || []}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.contactCard}>
                        <Text style={styles.contactName}>{item.name}</Text>
                        <Text style={styles.contactDetail}>📞 {item.phone}</Text>
                        <Text style={styles.contactDetail}>📧 {item.email}</Text>
                        <Text style={styles.relationship}>Relationship: {item.relationship}</Text>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => mutation.mutate(item._id)}
                        >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F9F9F9",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "green",
        marginBottom: 20,
    },
    contactCard: {
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    contactName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    contactDetail: {
        fontSize: 14,
        color: "#555",
        marginBottom: 3,
    },
    relationship: {
        fontSize: 14,
        color: "#777",
        fontStyle: "italic",
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: "red",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    deleteButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "600",
    },
});
