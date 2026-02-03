import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { exportAttendanceCSV } from '../database/exportRepo';
import { getEmployeeCount } from '../database/employeeRepo';
import Share from 'react-native-share';

const HomeScreen = ({ navigation }: any) => {
    const [registeredCount, setRegisteredCount] = useState(0);

    useFocusEffect(
        useCallback(() => {
            getEmployeeCount().then(setRegisteredCount).catch(() => setRegisteredCount(0));
        }, [])
    );

    const handleExport = async () => {
        try {
            const path = await exportAttendanceCSV();

            // ✅ SAFETY CHECK (prevents crash)
            if (!path) {
                Alert.alert('Error', 'File path not generated');
                return;
            }

            await Share.open({
                title: 'Export Attendance',
                url: `file://${path}`,
                type: 'text/csv',
            });
        } catch (error) {
            console.error('Export failed:', error);
            Alert.alert('Error', 'Failed to export attendance data');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Face Attendance System</Text>
            <Text style={styles.count}>
                {registeredCount} {registeredCount === 1 ? 'user' : 'users'} registered
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ManageEmployees')}
            >
                <Text style={styles.buttonText}>Manage Employees</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Camera', { mode: 'register' })}
            >
                <Text style={styles.buttonText}>Register Employee</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Camera', { mode: 'attendance' })}
            >
                <Text style={styles.buttonText}>Mark Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.exportButton]}
                onPress={handleExport}
            >
                <Text style={styles.buttonText}>Export Attendance (Excel)</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    title: {
        color: '#fff',
        fontSize: 22,
        marginBottom: 8,
    },
    count: {
        color: '#94a3b8',
        fontSize: 16,
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 8,
        width: '70%',
        marginBottom: 20,
        alignItems: 'center',
    },
    exportButton: {
        backgroundColor: '#16a34a',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default HomeScreen;
