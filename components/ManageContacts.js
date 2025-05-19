import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Platform, ActivityIndicator, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseUrl } from "../constant/constant";
import { Ionicons } from '@expo/vector-icons';
import Footer from './Footer';

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

export default function ManageContacts({ navigation }) {
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

    const handleDelete = (contactId) => {
        Alert.alert(
            "Delete Contact",
            "Are you sure you want to delete this contact?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => mutation.mutate(contactId)
                }
            ]
        );
    };

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#BDBDBD" />
            <Text style={styles.emptyTitle}>No Emergency Contacts</Text>
            <Text style={styles.emptyDescription}>
                Add emergency contacts to ensure help is just a tap away
            </Text>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('Contacts')}
            >
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <Text style={styles.addButtonText}>Add Contact</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading contacts...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#FF5252" />
                <Text style={styles.errorTitle}>Error Loading Contacts</Text>
                <Text style={styles.errorDescription}>{error.message}</Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => queryClient.invalidateQueries(["contacts"])}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Emergency Contacts</Text>
                    <Text style={styles.headerSubtitle}>Manage your emergency contacts</Text>
                </View>
            </View>

            <View style={styles.content}>
                {contacts?.length === 0 ? (
                    <EmptyState />
                ) : (
                    <View style={styles.contentContainer}>
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => navigation.navigate('Contacts')}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="white" />
                            <Text style={styles.addButtonText}>Add Contact</Text>
                        </TouchableOpacity>

                        <FlatList
                            data={contacts}
                            keyExtractor={(item) => item._id}
                            contentContainerStyle={styles.listContainer}
                            renderItem={({ item }) => (
                                <View style={styles.contactCard}>
                                    <View style={styles.contactInfo}>
                                        <View style={styles.nameContainer}>
                                            <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
                                            <Text style={styles.contactName}>{item.name}</Text>
                                        </View>
                                        <View style={styles.detailContainer}>
                                            <Ionicons name="call-outline" size={20} color="#666" />
                                            <Text style={styles.contactDetail}>{item.phone}</Text>
                                        </View>
                                        <View style={styles.detailContainer}>
                                            <Ionicons name="mail-outline" size={20} color="#666" />
                                            <Text style={styles.contactDetail}>{item.email}</Text>
                                        </View>
                                        <View style={styles.detailContainer}>
                                            <Ionicons name="people-outline" size={20} color="#666" />
                                            <Text style={styles.relationship}>{item.relationship}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDelete(item._id)}
                                    >
                                        <Ionicons name="trash-outline" size={24} color="#FF5252" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                )}
            </View>
            <Footer />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    header: {
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#7F8C8D',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingTop: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        marginHorizontal: 20,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },
    listContainer: {
        padding: 20,
        paddingTop: 0,
    },
    contactCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    contactInfo: {
        flex: 1,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginLeft: 8,
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    contactDetail: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    relationship: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        fontStyle: 'italic',
    },
    deleteButton: {
        padding: 8,
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2C3E50',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 16,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2C3E50',
        marginTop: 16,
        marginBottom: 8,
    },
    errorDescription: {
        fontSize: 16,
        color: '#7F8C8D',
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});