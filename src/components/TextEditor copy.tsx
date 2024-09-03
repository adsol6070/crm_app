import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const TextEditor = () => {
  const richText = useRef(null);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Text Editor</Text>
      
      <ScrollView>
      <RichToolbar
        editor={richText}
        actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1, actions.insertBulletsList, actions.insertOrderedList, actions.insertLink]}
        style={styles.toolbar}
      />
      
        <RichEditor
          ref={richText}
          style={styles.editor}
          placeholder="Start typing here..."
          onChange={(text) => console.log("Content was updated:", text)}
        />
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editor: {
    borderColor: '#ccc',
    borderWidth: 1,
    minHeight: 200,
    marginBottom: 10,
  },
  toolbar: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
});

export default TextEditor;
