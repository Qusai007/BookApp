// screens/AddBookScreen.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function AddBookScreen({ navigation, route }) {
  const { addBookToList } = route.params;
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [coverPage, setCoverPage] = useState('');
  const [rating, setRating] = useState('');
  const [summary, setSummary] = useState('');

  const handleAddBook = async () => {
    if (name && author && coverPage && rating && summary) {
      try {
        const docRef = await addDoc(collection(db, 'books'), {
          name,
          author,
          coverPage,
          rating,
          summary,
        });
        
        const newBook = { id: docRef.id, name, author, coverPage, rating, summary };
        addBookToList(newBook); // Add the new book to the list
        Alert.alert('Success', 'Book added successfully');
        navigation.goBack();
      } catch (error) {
        Alert.alert('Error', 'Could not add the book. Please try again.');
        console.error('Error adding book:', error);
      }
    } else {
      Alert.alert('Validation', 'Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Book</Text>
      <TextInput
        style={styles.input}
        placeholder="Book Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Cover URL"
        value={coverPage}
        onChangeText={setCoverPage}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Rating"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Summary"
        value={summary}
        onChangeText={setSummary}
        multiline={true}
        numberOfLines={4}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
        <Text style={styles.addButtonText}>Add Book</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
