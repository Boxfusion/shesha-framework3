import React, { FC, useState } from 'react';
import { Button, Select, Input, InputNumber } from 'antd';
import { ITableComponentProps, RowDroppedMode } from './models';
import { ColumnsEditorModal } from './columnsEditor/columnsEditorModal';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import CodeEditor from '@/components/formDesigner/components/codeEditor/codeEditor';
import { ConfigurableActionConfigurator } from '../../configurableActionsConfigurator/configurator';
import { YesNoInheritJs } from '@/components/dataTable/interfaces';
import { InlineEditMode, InlineSaveMode, NewRowCapturePosition } from '@/components/reactTable/interfaces';
import { nanoid } from '@/utils/uuid';
import { ISettingsFormFactoryArgs } from '@/interfaces';
import SettingsForm, { useSettingsForm } from '@/designer-components/_settings/settingsForm';
import SettingsFormItem from '@/designer-components/_settings/settingsFormItem';
import SettingsCollapsiblePanel from '@/designer-components/_settings/settingsCollapsiblePanel';

interface ITypedOption<T = string> {
  label: React.ReactNode;
  value: T;
}
const yesNoInheritOptions: ITypedOption<YesNoInheritJs>[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Inherit', value: 'inherit' },
  { label: 'Expression', value: 'js' },
];
const inlineEditModes: ITypedOption<InlineEditMode>[] = [
  { label: 'One by one', value: 'one-by-one' },
  { label: 'All at once', value: 'all-at-once' }
];
const inlineSaveModes: ITypedOption<InlineSaveMode>[] = [
  { label: 'Auto', value: 'auto' },
  { label: 'Manual', value: 'manual' }
];
const rowCapturePositions: ITypedOption<NewRowCapturePosition>[] = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' }
];

const NEW_ROW_EXPOSED_VARIABLES = [
  {
    id: nanoid(),
    name: 'formData',
    description: 'Form values',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'globalState',
    description: 'The global state of the application',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'http',
    description: 'axios instance used to make http requests',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'moment',
    description: 'The moment.js object',
    type: 'object',
  }
];

const ROW_SAVE_EXPOSED_VARIABLES = [
  {
    id: nanoid(),
    name: 'data',
    description: 'Current row data',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'formData',
    description: 'Form values',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'globalState',
    description: 'The global state of the application',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'http',
    description: 'axios instance used to make http requests',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'moment',
    description: 'The moment.js object',
    type: 'object',
  }
];

const ROW_SAVED_SUCCESS_EXPOSED_VARIABLES = [
  {
    id: nanoid(),
    name: 'data',
    description: 'Current row data',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'formData',
    description: 'Form values',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'globalState',
    description: 'The global state of the application',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'http',
    description: 'axios instance used to make http requests',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'moment',
    description: 'The moment.js object',
    type: 'object',
  }
];

const ENABLE_CRUD_EXPOSED_VARIABLES = [
  {
    id: nanoid(),
    name: 'formData',
    description: 'Form values',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'globalState',
    description: 'The global state of the application',
    type: 'object',
  },
  {
    id: nanoid(),
    name: 'moment',
    description: 'The moment.js object',
    type: 'object',
  }
];

export interface IProps {
  readOnly: boolean;
  model: ITableComponentProps;
  onSave: (model: ITableComponentProps) => void;
  onCancel: () => void;
  onValuesChange?: (changedValues: any, values: ITableComponentProps) => void;
}

interface IColumnsSettingsState {
  showColumnsModal?: boolean;
  allowRowDragAndDrop?: boolean;
  rowDroppedMode?: RowDroppedMode;
}

const TableSettings: FC<ISettingsFormFactoryArgs<ITableComponentProps>> = ({readOnly}) => {
  const { model } = useSettingsForm<ITableComponentProps>();
  
  const [state, setState] = useState<IColumnsSettingsState>({
    showColumnsModal: false,
  });

  const toggleColumnsModal = () => setState(prev => ({ ...prev, showColumnsModal: !prev?.showColumnsModal }));

  return (
    <>
      <SettingsFormItem name="componentName" label="Component name">
        <Input readOnly={readOnly} />
      </SettingsFormItem>

      <Button onClick={toggleColumnsModal}>{readOnly ? 'View Columns' : 'Customize Columns'}</Button>

      <SettingsFormItem name="items">
        <ColumnsEditorModal
          visible={state?.showColumnsModal}
          hideModal={toggleColumnsModal}
          readOnly={readOnly}
        />
      </SettingsFormItem>

      <SettingsFormItem name="useMultiselect" label="Use Multi-select" valuePropName="checked" jsSetting>
        <Checkbox disabled={readOnly} />
      </SettingsFormItem>

     
 <SettingsCollapsiblePanel header='CRUD'>
      <SettingsFormItem 
        name="canEditInline"
        label="Can edit inline"
      // label={<>Can edit inline <Switch size="small" defaultChecked unCheckedChildren="static" checkedChildren="JS" style={{ marginLeft: '8px' }}/></>}
      >
        <Select disabled={readOnly} options={yesNoInheritOptions} />
      </SettingsFormItem>
      <SettingsFormItem name="canEditInlineExpression" label="Can edit inline expression" hidden={model.canEditInline !== 'js'}>
        <CodeEditor
          propertyName="canEditInlineExpression"
          readOnly={readOnly}
          mode="dialog"
          label="Can edit inline expression"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          description="Return true to enable inline editing and false to disable."
          exposedVariables={ENABLE_CRUD_EXPOSED_VARIABLES}
        />
      </SettingsFormItem>
      <SettingsFormItem name="inlineEditMode" label="Row edit mode" hidden={model.canEditInline === 'no'}>
        <Select disabled={readOnly} options={inlineEditModes} />
      </SettingsFormItem>
      <SettingsFormItem name="inlineSaveMode" label="Save mode" hidden={model.canEditInline === 'no'}>
        <Select disabled={readOnly} options={inlineSaveModes} />
      </SettingsFormItem>
      <SettingsFormItem name="customUpdateUrl" label="Custom update url" hidden={model.canEditInline === 'no'}>
        <Input readOnly={readOnly} />
      </SettingsFormItem>

      <SettingsFormItem name="canAddInline" label="Can add inline">
        <Select disabled={readOnly} options={yesNoInheritOptions} />
      </SettingsFormItem>
      <SettingsFormItem name="canAddInlineExpression" label="Can add inline expression" hidden={model.canAddInline !== 'js'}>
        <CodeEditor
          propertyName="canAddInlineExpression"
          readOnly={readOnly}
          mode="dialog"
          label="Can add inline expression"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          description="Return true to enable inline creation of new rows and false to disable."
          exposedVariables={ENABLE_CRUD_EXPOSED_VARIABLES}
        />
      </SettingsFormItem>
      <SettingsFormItem name="newRowCapturePosition" label="New row capture position" hidden={model.canAddInline === 'no'}>
        <Select disabled={readOnly} options={rowCapturePositions} />
      </SettingsFormItem>
      <SettingsFormItem name="newRowInsertPosition" label="New row insert position" /*hidden={canAddInline === 'no'}*/ hidden={true} /* note: hidden until review of rows drag&drop */>
        <Select disabled={readOnly} options={rowCapturePositions} />
      </SettingsFormItem>
      <SettingsFormItem name="customCreateUrl" label="Custom create url" hidden={model.canEditInline === 'no'}>
        <Input readOnly={readOnly} />
      </SettingsFormItem>
      <SettingsFormItem
        label="New row init"
        name="onNewRowInitialize"
        tooltip="Allows configurators to specify logic to initialise the object bound to a new row."
        hidden={model.canAddInline === 'no'}
      >
        <CodeEditor
          propertyName="onNewRowInitialize"
          readOnly={readOnly}
          mode="dialog"
          label="New row init"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          description="Specify logic to initialise the object bound to a new row. This handler should return an object or a Promise<object>."
          exposedVariables={NEW_ROW_EXPOSED_VARIABLES}
        />
      </SettingsFormItem>
      <SettingsFormItem
        label="On row save"
        name="onRowSave"
        tooltip="Custom business logic to be executed on saving of new/updated row (e.g. custom validation / calculations). This handler should return an object or a Promise<object>."
        hidden={model.canAddInline === 'no' && model.canEditInline === 'no'}
      >
        <CodeEditor
          propertyName="onRowSave"
          readOnly={readOnly}
          mode="dialog"
          label="On row save"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          description="Allows custom business logic to be executed on saving of new/updated row (e.g. custom validation / calculations)."
          exposedVariables={ROW_SAVE_EXPOSED_VARIABLES}
        />
      </SettingsFormItem>
      <SettingsFormItem name="onRowSaveSuccessAction" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
        <ConfigurableActionConfigurator
          editorConfig={null}
          level={1}
          label="On row save success"
          description="Custom business logic to be executed after successfull saving of new/updated row."
          exposedVariables={ROW_SAVED_SUCCESS_EXPOSED_VARIABLES}
        />
      </SettingsFormItem>
      <SettingsFormItem name="canDeleteInline" label="Can delete inline">
        <Select disabled={readOnly} options={yesNoInheritOptions} />
      </SettingsFormItem>
      <SettingsFormItem name="canDeleteInlineExpression" label="Can delete inline expression" hidden={model.canDeleteInline !== 'js'}>
        <CodeEditor
          propertyName="canDeleteInlineExpression"
          readOnly={readOnly}
          mode="dialog"
          label="Can delete inline expression"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          description="Return true to enable inline deletion and false to disable."
          exposedVariables={ENABLE_CRUD_EXPOSED_VARIABLES}
        />
      </SettingsFormItem>      
      <SettingsFormItem name="customDeleteUrl" label="Custom delete url" hidden={model.canDeleteInline === 'no'}>
        <Input readOnly={readOnly} />
      </SettingsFormItem>

      {/* <SectionSeparator title="Row drag and drop" />

      <SettingsFormItem  jsSetting
        name="allowRowDragAndDrop"
        label="Allow row drag-and-drop"
        valuePropName="checked"
        tooltip="Whether rows should be dragged and dropped to rearrange them"
      >
        <Checkbox disabled={readOnly} />
      </SettingsFormItem>

      <SettingsFormItem name="rowDroppedActionConfiguration" hidden={model.allowReordering === 'no'}>
        <ConfigurableActionConfigurator editorConfig={null} level={1} label="On Row Dropped Action" />
      </SettingsFormItem> */}
 </SettingsCollapsiblePanel>
     <SettingsCollapsiblePanel header="Layout">
      <SettingsFormItem  jsSetting
        name="minHeight" label="Min Height" tooltip="The minimum height of the table (e.g. even when 0 rows). If blank then minimum height is 0.">
        <InputNumber />
      </SettingsFormItem>

      <SettingsFormItem  jsSetting
        name="maxHeight" label="Max Height" tooltip="The maximum height of the table. If left blank should grow to display all rows, otherwise should allow for vertical scrolling.">
        <InputNumber />
      </SettingsFormItem>

      <SettingsFormItem name="containerStyle" label="Table container style">
        <CodeEditor
          readOnly={readOnly}
          mode="dialog"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          propertyName="containerStyle"
          label="Table container style"
          description="The style that will be applied to the table container/wrapper"
          exposedVariables={[]}
        />
      </SettingsFormItem>

      <SettingsFormItem name="tableStyle" label="Table style">
        <CodeEditor
          readOnly={readOnly}
          mode="dialog"
          setOptions={{ minLines: 20, maxLines: 500, fixedWidthGutter: true }}
          propertyName="tableStyle"
          label="Table style"
          description="The style that will be applied to the table"
          exposedVariables={[]}
        />
      </SettingsFormItem>
      </SettingsCollapsiblePanel>
    </>
  );
};

const TableSettingsForm: FC<ISettingsFormFactoryArgs<ITableComponentProps>> = (props) => {
  return (
    SettingsForm<ITableComponentProps>({...props, children: <TableSettings {...props}/>})
  );
};

export default TableSettingsForm;
