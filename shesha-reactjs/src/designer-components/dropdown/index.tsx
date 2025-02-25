import ConfigurableFormItem from '@/components/formDesigner/components/formItem';
import moment from 'moment';
import React from 'react';
import settingsFormJson from './settingsForm.json';
import { axiosHttp } from '@/utils/fetchers';
import { customDropDownEventHandler } from '@/components/formDesigner/components/utils';
import { DataTypes } from '@/interfaces/dataTypes';
import { DownSquareOutlined } from '@ant-design/icons';
import { FormMarkup } from '@/providers/form/models';
import { getLegacyReferenceListIdentifier } from '@/utils/referenceList';
import { validateConfigurableComponentSettings } from '@/providers/form/utils';
import { IDropdownComponentProps } from './interfaces';
import { IToolboxComponent } from '@/interfaces';
import { message } from 'antd';
import { migrateCustomFunctions, migratePropertyName, migrateReadOnly } from '@/designer-components/_common-migrations/migrateSettings';
import { migrateVisibility } from '@/designer-components/_common-migrations/migrateVisibility';
import {
  useForm,
  useFormData,
  useGlobalState,
  useSheshaApplication
} from '@/providers';
import { Dropdown } from './dropdown';

const settingsForm = settingsFormJson as FormMarkup;

const DropdownComponent: IToolboxComponent<IDropdownComponentProps> = {
  type: 'dropdown',
  isInput: true,
  isOutput: true,
  canBeJsSetting: true,
  name: 'Dropdown',
  icon: <DownSquareOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.referenceListItem,
  Factory: ({ model, form }) => {
    const { formMode, setFormData } = useForm();
    const { globalState, setState: setGlobalState } = useGlobalState();
    const { backendUrl } = useSheshaApplication();
    const { data: formData } = useFormData();
    const eventProps = {
      model,
      form,
      formData,
      formMode,
      globalState,
      http: axiosHttp(backendUrl),
      message,
      moment,
      setFormData,
      setGlobalState,
    };

    const initialValue = model?.defaultValue ? { initialValue: model.defaultValue } : {};

    return (
      <ConfigurableFormItem model={model} {...initialValue}>
        {(value, onChange) => {
          const customEvent = customDropDownEventHandler(eventProps);
          const onChangeInternal = (...args: any[]) => {
            customEvent.onChange(args[0], args[1]);
            if (typeof onChange === 'function')
              onChange(...args);
          };

          return <Dropdown {...model} {...customEvent} value={value} onChange={onChangeInternal} />;
        }}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: (model) => validateConfigurableComponentSettings(settingsForm, model),
  migrator: (m) => m
    .add<IDropdownComponentProps>(0, (prev) => ({
      ...prev,
      dataSourceType: prev['dataSourceType'] ?? 'values',
      useRawValues: prev['useRawValues'] ?? false,
    }))
    .add<IDropdownComponentProps>(1, (prev) => {
      return {
        ...prev,
        referenceListId: getLegacyReferenceListIdentifier(prev.referenceListNamespace, prev.referenceListName),
      };
    })
    .add<IDropdownComponentProps>(2, (prev) => migratePropertyName(migrateCustomFunctions(prev)))
    .add<IDropdownComponentProps>(3, (prev) => migrateVisibility(prev))
    .add<IDropdownComponentProps>(4, (prev) => migrateReadOnly(prev))
  ,
  linkToModelMetadata: (model, metadata): IDropdownComponentProps => {
    const isSingleRefList = metadata.dataType === DataTypes.referenceListItem;
    const isMultipleRefList = metadata.dataType === 'array' && metadata.dataFormat === 'reference-list-item';

    return {
      ...model,
      dataSourceType: isSingleRefList || isMultipleRefList ? 'referenceList' : 'values',
      referenceListId: {
        module: metadata.referenceListModule,
        name: metadata.referenceListName,
      },
      mode: isMultipleRefList ? 'multiple' : 'single',
      useRawValues: true,
    };
  },
};

export default DropdownComponent;
