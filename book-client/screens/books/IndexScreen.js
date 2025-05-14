import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    SafeAreaView,
    Alert,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
    Platform
} from 'react-native';
import { getAllBooks, deleteBook } from '../../services/bookService';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function IndexScreen({ navigation, route }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const { logout } = useAuth();

    const loadBooks = async () => {
        try {
            setLoading(true);
            const data = await getAllBooks();

            setBooks(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Add focus listener to reload books when screen comes into focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadBooks();
        });

        return unsubscribe;
    }, [navigation]);

    // Initial load
    useEffect(() => {
        loadBooks();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadBooks();
        setRefreshing(false);
    }, []);

    const handleDelete = async (id) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa sách này?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteBook(id);
                            // Remove the deleted book from the local state
                            setBooks(currentBooks => 
                                currentBooks.filter(book => book._id !== id)
                            );
                            Alert.alert("Thành công", "Đã xóa sách thành công");
                        } catch (err) {
                            Alert.alert("Lỗi", err.message);
                        }
                    }
                }
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            "Xác nhận đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Đăng xuất",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout();
                            // Navigation will be handled automatically by AppNavigator
                        } catch (err) {
                            Alert.alert("Lỗi", "Đăng xuất thất bại. Vui lòng thử lại.");
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.bookItem}>
            <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <View style={styles.bookMeta}>
                    <View style={styles.metaItem}>
                        <Ionicons name="person-outline" size={16} color="#666" />
                        <Text style={styles.bookAuthor}>
                            {item.author || 'Chưa có tác giả'}
                        </Text>
                    </View>
                    {item.year && (
                        <View style={styles.metaItem}>
                            <Ionicons name="calendar-outline" size={16} color="#666" />
                            <Text style={styles.bookYear}>{item.year}</Text>
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.bookActions}>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('EditBook', { book: item })}
                >
                    <Ionicons name="pencil" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item._id)}
                >
                    <Ionicons name="trash" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Xóa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => navigation.navigate('CreateBook')}
                        >
                            <Ionicons name="add" size={24} color="#fff" />
                            <Text style={styles.addButtonText}>Thêm sách</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={24} color="#FF3B30" />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={books}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#007AFF']}
                            tintColor="#007AFF"
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="library-outline" size={64} color="#ccc" />
                            <Text style={styles.emptyText}>Chưa có sách nào</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    headerContent: {
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        padding: 8,
        borderRadius: 8,
    },
    list: {
        padding: 16,
    },
    bookItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    bookInfo: {
        marginBottom: 12,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    bookMeta: {
        gap: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bookAuthor: {
        fontSize: 14,
        color: '#666',
    },
    bookYear: {
        fontSize: 14,
        color: '#666',
    },
    bookActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        gap: 6,
    },
    editButton: {
        backgroundColor: '#34C759',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 8,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
        marginTop: 8,
    },
});
