// screens/BookDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export default function BookDetailScreen({ route }) {
  const { book } = route.params;
  const addBorrowedBookToList = route.params?.addBorrowedBookToList; // Get function to add to borrowed list
  const [borrowCount, setBorrowCount] = useState(0);

  useEffect(() => {
    const fetchBorrowCount = async () => {
      try {
        const borrowedRef = collection(db, 'borrowedBooks');
        const borrowedQuery = query(borrowedRef, where('bookId', '==', book.id));
        const borrowedSnapshot = await getDocs(borrowedQuery);
        setBorrowCount(borrowedSnapshot.size);
      } catch (error) {
        console.error('Error fetching borrow count: ', error);
      }
    };

    fetchBorrowCount();
  }, [book.id]);

  const handleBorrowBook = async () => {
    if (borrowCount >= 3) {
      Alert.alert(
        'Limit Reached',
        'You cannot borrow the same book more than thrice.'
      );
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'borrowedBooks'), {
        bookId: book.id,
        name: book.name,
        author: book.author,
        borrowedAt: new Date(),
      });
      
      const newBorrowedBook = { id: docRef.id, name: book.name, author: book.author };
      if (addBorrowedBookToList) {
        addBorrowedBookToList(newBorrowedBook); // Add to the borrowed list immediately
      }

      Alert.alert('Success', 'Book borrowed successfully.');
      setBorrowCount(borrowCount + 1);
    } catch (error) {
      console.error('Error borrowing book: ', error);
      Alert.alert('Error', 'Could not borrow the book. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: book.coverPage }}
        style={styles.coverImage}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{book.name}</Text>
        <Text style={styles.author}>by {book.author}</Text>
        <Text style={styles.summary}>{book.summary}</Text>
        <Text style={styles.rating}>Rating: {book.rating}</Text>
        <TouchableOpacity style={styles.borrowButton} onPress={handleBorrowBook}>
          <Text style={styles.borrowButtonText}>Borrow Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  coverImage: {
    width: '100%',
    height: 250,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
    marginBottom: 20,
  },
  borrowButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  borrowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
