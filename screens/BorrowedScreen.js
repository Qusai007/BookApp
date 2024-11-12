// screens/BorrowedScreen.js
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

export default function BorrowedScreen({ navigation }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  const fetchBorrowedBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'borrowedBooks'));
      setBorrowedBooks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching borrowed books: ", error);
    }
  };

  // Refresh borrowed books every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchBorrowedBooks();
    }, [])
  );

  const handleReturnBook = async (bookId) => {
    Alert.alert(
      "Return Book",
      "Are you sure you want to return this book?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: async () => {
          try {
            await deleteDoc(doc(db, 'borrowedBooks', bookId));
            Alert.alert("Returned", "Book has been returned successfully.");
            fetchBorrowedBooks(); // Refresh the list after returning
          } catch (error) {
            console.error("Error returning book: ", error);
            Alert.alert("Error", "Could not return the book. Please try again.");
          }
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={borrowedBooks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{item.name}</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
            </View>
            <TouchableOpacity 
              style={styles.returnButton} 
              onPress={() => handleReturnBook(item.id)}
            >
              <Icon name="return-down-back" size={24} color="#6200EE" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No borrowed books to display</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
  returnButton: {
    padding: 5,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
