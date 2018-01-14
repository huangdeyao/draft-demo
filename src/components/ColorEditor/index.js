import React, { Component } from 'react';
import { Editor, EditorState, Modifier, RichUtils } from 'draft-js';

class ColorEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.focus = () => this.editor.focus();
    this.onChange = editorState => this.setState({ editorState });
    this.toggleColor = toggledColor => this._toggleColor(toggledColor);
  }
  _toggleColor(toggledColor) {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap).reduce(
      (contentState, color) => {
        return Modifier.removeInlineStyle(contentState, selection, color);
      },
      editorState.getCurrentContent()
    );
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );
    const currentStyle = editorState.getCurrentInlineStyle();
    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }
    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }
    this.onChange(nextEditorState);
  }
  render() {
    const { editorState } = this.state;
    return (
      <div style={styles.root}>
        <ColorControls editorState={editorState} onToggle={this.toggleColor} />
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            customStyleMap={colorStyleMap}
            editorState={editorState}
            onChange={this.onChange}
            placeholder="请输入"
            ref={ref => (this.editor = ref)}
          />
        </div>
      </div>
    );
  }
}
class StyleButton extends Component {
  constructor(props) {
    super(props);
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }
  render() {
    let style;
    if (this.props.active) {
      style = { ...styles.styleButton, ...colorStyleMap[this.props.style] };
    } else {
      style = styles.styleButton;
    }
    return (
      <span style={style} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}
var COLORS = [
  { label: '红', style: 'red' },
  { label: '橙', style: 'orange' },
  { label: '黄', style: 'yellow' },
  { label: '绿', style: 'green' },
  { label: '蓝', style: 'blue' },
  { label: '靛', style: 'indigo' },
  { label: '紫', style: 'violet' }
];
const ColorControls = props => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div style={styles.controls}>
      {COLORS.map(type => (
        <StyleButton
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};
// This object provides the styling information for our custom color
// styles.
const colorStyleMap = {
  red: {
    color: 'rgba(255, 0, 0, 1.0)'
  },
  orange: {
    color: 'rgba(255, 127, 0, 1.0)'
  },
  yellow: {
    color: 'rgba(180, 180, 0, 1.0)'
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)'
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)'
  },
  indigo: {
    color: 'rgba(75, 0, 130, 1.0)'
  },
  violet: {
    color: 'rgba(127, 0, 255, 1.0)'
  }
};
const styles = {
  root: {
    fontFamily: "'Georgia', serif",
    fontSize: 14,
    padding: 20,
    width: '100%'
  },
  editor: {
    borderTop: '1px solid #ddd',
    cursor: 'text',
    fontSize: 16,
    marginTop: 20,
    minHeight: 400,
    paddingTop: 20
  },
  controls: {
    fontFamily: "'Helvetica', sans-serif",
    fontSize: 14,
    marginBottom: 10,
    userSelect: 'none'
  },
  styleButton: {
    color: '#999',
    cursor: 'pointer',
    marginRight: 16,
    padding: '2px 0'
  }
};

export default ColorEditor;
