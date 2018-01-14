import React, { Component } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import BlockStyleControls from './BlockStyleControls';
import InlineStyleControls from './InlineStyleControls';
import style from './style';
import './index.css';

class RichEditor extends Component {
  constructor(props) {
    super(props);
    // 默认给一个empty的editorstate
    this.state = {
      editorState: EditorState.createEmpty()
    };
    // 获取焦点的方法
    this.focus = () => this.refs.editor.focus();
    // 绑定editorstate更新方法
    this.onChange = editorState => this.setState({ editorState });
    // 键盘操作
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    // tab键
    this.onTab = this._onTab.bind(this);
    // block和inline样式按钮的toggle（是否激活）
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }
  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }
  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }
  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }
  getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote':
        return 'RichEditor-blockquote';
      default:
        return null;
    }
  }
  render() {
    const { editorState } = this.state;
    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    // 如果用户在输入任何字符之前，改变了block类型，我们可以使用改变placeholder的样式，
    // 或者隐藏它。我们现在隐藏它。
    let className = 'RichEditor-editor';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== 'unstyled'
      ) {
        className += ' RichEditor-hidePlaceholder';
      }
    }
    return (
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={this.getBlockStyle}
            customStyleMap={style}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            placeholder="请输入"
            ref="editor"
            spellCheck={true}
          />
        </div>
      </div>
    );
  }
}

export default RichEditor;
