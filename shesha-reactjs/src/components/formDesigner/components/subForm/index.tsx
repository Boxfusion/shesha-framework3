import ConfigurableFormItem from '../formItem';
import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { getStyle } from '@/providers/form/utils';
import { IConfigurableFormComponent } from '@/providers/form/models';
import { ISubFormProviderProps } from '@/providers/subForm/interfaces';
import { IToolboxComponent } from '@/interfaces';
import { migrateCustomFunctions, migratePropertyName, migrateReadOnly } from '@/designer-components/_common-migrations/migrateSettings';
import { SubFormSettingsForm } from './settings';
import {
  useForm,
  useFormItem,
  useFormData,
} from '@/providers';
import { SubFormWrapper } from './subFormWrapper';

export interface ISubFormComponentProps
  extends Omit<ISubFormProviderProps, 'labelCol' | 'wrapperCol'>,
  IConfigurableFormComponent {
  labelCol?: number;
  wrapperCol?: number;
}

const SubFormComponent: IToolboxComponent<ISubFormComponentProps> = {
  type: 'subForm',
  name: 'Sub Form',
  icon: <FormOutlined />,
  Factory: ({ model }) => {
    const { formMode } = useForm();
    const { data: formData } = useFormData();

    const { namePrefix } = useFormItem();

    if (model.hidden && formMode !== 'designer') return null;

    const name = namePrefix ? [namePrefix, model?.propertyName]?.join('.') : model?.propertyName;

    return (
      <ConfigurableFormItem
        model={model}
        labelCol={{ span: model?.hideLabel ? 0 : model?.labelCol }}
        wrapperCol={{ span: model?.hideLabel ? 24 : model?.wrapperCol }}
      >
        {(value, onChange) => {
          return <SubFormWrapper {...model} value={value} propertyName={name} style={getStyle(model?.style, formData)} onChange={onChange} />;
        }}
      </ConfigurableFormItem>
    );
  },
  // settingsFormMarkup: alertSettingsForm,
  migrator: m => m
    .add<ISubFormComponentProps>(0, prev => ({ ...prev, apiMode: prev['apiMode'] ?? 'entityName' }))
    .add<ISubFormComponentProps>(1, (prev) => migratePropertyName(migrateCustomFunctions(prev)))
    .add<ISubFormComponentProps>(2, (prev) => migrateReadOnly(prev))
  ,
  settingsFormFactory: (props) => <SubFormSettingsForm {...props} />,
  initModel: model => {
    const customProps: ISubFormComponentProps = {
      ...model,
      dataSource: 'form',
      apiMode: 'entityName',
      labelCol: 8,
      wrapperCol: 16,
    };
    return customProps;
  },
};

export default SubFormComponent;
