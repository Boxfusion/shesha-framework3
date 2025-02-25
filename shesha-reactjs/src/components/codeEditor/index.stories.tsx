import React from 'react';
import { Story } from '@storybook/react';
import { CodeEditor, ICodeEditorProps } from './';

export default {
  title: 'Components/Temp/CodeEditor',
  component: CodeEditor
};

// Create a master template for mapping args to render the Button component
const Template: Story<ICodeEditorProps> = props => (
  <CodeEditor {...props}/>
);

const basicProps: ICodeEditorProps = {

};
export const Basic = Template.bind({});
Basic.args = { ...basicProps };
