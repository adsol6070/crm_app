import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { theme } from '../constants/theme'; // Ensure this path is correct

interface TextEditorProps {
  title?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  toolbarStyle?: ViewStyle;
  editorStyle?: ViewStyle;
}

const TextEditor: React.FC<TextEditorProps> = ({
  title,
  placeholder = "Start typing here...",
  containerStyle,
  toolbarStyle,
  editorStyle,
}) => {
  const richText = useRef(null);

  return (
    <View style={[styles.container, containerStyle]}>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollView}>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.heading1,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink
          ]}
          style={[styles.toolbar, toolbarStyle]}
        />
        <RichEditor
          ref={richText}
          style={[styles.editor, editorStyle]}
          placeholder={placeholder}
          onChange={(text) => console.log("Content was updated:", text)}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    marginTop: 10,
    marginBottom: 10
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.gray1,
  },
  scrollView: {
    flexGrow: 1,
  },
  editor: {
    borderColor: theme.COLORS.lightBlue1,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 200, 
    backgroundColor: theme.COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    ...theme.FONTS.Mulish_400Regular,
    fontSize: 16,
  },
  toolbar: {
    borderBottomColor: theme.COLORS.lightBlue1,
    borderBottomWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

export default TextEditor;
