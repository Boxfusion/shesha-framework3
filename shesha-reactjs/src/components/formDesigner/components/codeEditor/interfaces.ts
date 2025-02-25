import { IAceOptions } from 'react-ace';
import { IConfigurableFormComponent } from '@/interfaces';
import { ICodeExposedVariable } from '@/components/codeVariablesTable';
import { EditorModes } from './types';

export interface ICodeEditorProps extends Omit<IConfigurableFormComponent, 'type' | 'id'> {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  mode?: 'inline' | 'dialog';
  setOptions?: IAceOptions;
  language?: EditorModes;
  exposedVariables?: ICodeExposedVariable[];
}

export interface ICodeEditorComponentProps extends IConfigurableFormComponent {
  mode?: 'dialog' | 'inline';
  exposedVariables?: ICodeExposedVariable[];
  language?: EditorModes;
}
