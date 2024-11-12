// screens/BooksListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BooksListScreen({ navigation }) {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'books'));
      setBooks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching books: ", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to add a new book to the state without reloading the app
  const addBookToList = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const handleDeleteBook = async (bookId) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: async () => {
          try {
            await deleteDoc(doc(db, 'books', bookId));
            Alert.alert("Deleted", "Book has been deleted.");
            fetchBooks(); // Refresh the list after deletion
          } catch (error) {
            console.error("Error deleting book: ", error);
            Alert.alert("Error", "Could not delete the book. Please try again.");
          }
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <TouchableOpacity 
              style={styles.bookInfo}
              onPress={() => navigation.navigate('Book Detail', { book: item })}
            >
              <Text style={styles.bookTitle}>{item.name}</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => handleDeleteBook(item.id)}
            >
              <Icon name="trash" size={24} color="#ff3b30" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Add Book', { addBookToList })}
      >
        <Icon name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  deleteButton: {
    padding: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200EE',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
