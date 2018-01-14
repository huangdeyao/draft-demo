import React, { Component } from 'react';
import './Draft.css';
import { Collapse } from 'antd';
import PlainTextEditor from '../../components/PlainTextEditor';
import RichEditor from '../../components/RichEditor';
import ColorEditor from '../../components/ColorEditor';
import LinkEditor from '../../components/LinkEditor';
import MediaEditor from '../../components/MediaEditor';
import TweetEditor from '../../components/TweetEditor';
const Panel = Collapse.Panel;

class Main extends Component {
  render() {
    const Panels = [
      {
        component: <PlainTextEditor />,
        label: '纯文本'
      },
      {
        component: <RichEditor />,
        label: '富文本'
      },
      {
        component: <ColorEditor />,
        label: '颜色'
      },
      {
        component: <LinkEditor />,
        label: '链接'
      },
      {
        component: <MediaEditor />,
        label: '多媒体'
      },
      {
        component: <TweetEditor />,
        label: '推特'
      }
    ];
    return (
      <Collapse accordion>
        {Panels.map((item, index) => {
          const { component, label } = item;
          return (
            <Panel header={label} key={index}>
              {component}
            </Panel>
          );
        })}
      </Collapse>
    );
  }
}

export default Main;
