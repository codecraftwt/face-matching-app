import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    FlatList,
    RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEmployees, deleteEmployee, Employee } from '../database/employeeRepo';

const ManageEmployeesScreen = ({ navigation }: any) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadEmployees = useCallback(async () => {
        try {
            const list = await getAllEmployees();
            setEmployees(list);
        } catch {
            setEmployees([]);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadEmployees();
        }, [loadEmployees])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadEmployees();
        setRefreshing(false);
    };

    const handleDelete = (emp: Employee) => {
        Alert.alert(
            'Delete Employee',
            `Remove "${emp.name}" (ID: ${emp.emp_id})? This cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteEmployee(emp.emp_id);
                            await loadEmployees();
                        } catch {
                            Alert.alert('Error', 'Failed to delete employee');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: Employee }) => (
        <View style={styles.row}>
            <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowId}>ID: {item.emp_id}</Text>
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registered Employees</Text>
            <Text style={styles.count}>
                {employees.length} {employees.length === 1 ? 'user' : 'users'} registered
            </Text>

            <FlatList
                data={employees}
                keyExtractor={(item) => item.emp_id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.empty}>No employees registered yet.</Text>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#fff"
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        marginBottom: 8,
        textAlign: 'center',
    },
    count: {
        color: '#94a3b8',
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 24,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    rowInfo: {
        flex: 1,
    },
    rowName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    rowId: {
        color: '#94a3b8',
        fontSize: 14,
        marginTop: 4,
    },
    deleteButton: {
        backgroundColor: '#dc2626',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    empty: {
        color: '#64748b',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 32,
    },
});

export default ManageEmployeesScreen;
