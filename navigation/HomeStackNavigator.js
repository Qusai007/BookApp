// navigation/HomeStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BooksListScreen from '../screens/BooksListScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import AddBookScreen from '../screens/AddBookScreen';

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Books List" component={BooksListScreen} />
      <Stack.Screen name="Book Detail" component={BookDetailScreen} />
      <Stack.Screen name="Add Book" component={AddBookScreen} />
    </Stack.Navigator>
  );
}
