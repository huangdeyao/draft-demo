import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';

class PlainTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      logState: undefined
    };
    this.onChange = editorState => this.setState({ editorState });
    this.logState = () => {
      console.log(this.state.editorState.toJS());
      this.setState({
        logState: JSON.stringify(this.state.editorState.toJS())
      });
    };
    this.setDomEditorRef = ref => (this.domEditor = ref);
  }

  componentDidMount() {
    this.domEditor.focus();
  }

  render() {
    return (
      <div style={styles.root}>
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="请输入"
            ref={this.setDomEditorRef}
          />
        </div>
        <input
          onClick={this.logState}
          style={styles.button}
          type="button"
          value="打印State"
        />
        <p>{this.state.logState}</p>
      </div>
    );
  }
}
const styles = {
  root: {
    fontFamily: "'Helvetica', sans-serif",
    padding: 20,
    width: 600
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10
  },
  button: {
    marginTop: 10,
    textAlign: 'center'
  }
};

export default PlainTextEditor;
