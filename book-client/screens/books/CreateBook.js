import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { createBook } from '../../services/bookService';
import { Ionicons } from '@expo/vector-icons';

export default function CreateBook({ navigation }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError('Vui lòng nhập tên sách');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const bookData = {
                title: title.trim(),
                author: author.trim() || undefined,
                year: year ? parseInt(year) : undefined
            };

            await createBook(bookData);
            Alert.alert(
                "Thành công",
                "Đã thêm sách mới thành công",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Ionicons name="add-circle" size={80} color="#007AFF" />
                            <Text style={styles.title}>Thêm Sách Mới</Text>
                            <Text style={styles.subtitle}>Điền thông tin sách cần thêm</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tên sách *</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="book-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={title}
                                        onChangeText={setTitle}
                                        placeholder="Nhập tên sách"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tác giả</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={author}
                                        onChangeText={setAuthor}
                                        placeholder="Nhập tên tác giả"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Năm xuất bản</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={year}
                                        onChangeText={setYear}
                                        placeholder="Nhập năm xuất bản"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            {error ? (
                                <View style={styles.errorContainer}>
                                    <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            <TouchableOpacity
                                style={[styles.submitButton, loading && styles.disabledButton]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="add-circle-outline" size={20} color="#fff" />
                                        <Text style={styles.submitButtonText}>Thêm sách</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name="arrow-back-outline" size={20} color="#007AFF" />
                                <Text style={styles.cancelButtonText}>Quay lại</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: 20,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#1a1a1a',
        marginBottom: 8,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#1a1a1a',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFE5E5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        gap: 8,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 14,
        flex: 1,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 8,
    },
    cancelButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 