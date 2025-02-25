import { IToolboxComponent } from '@/interfaces';
import { FormMarkup, IConfigurableFormComponent } from '@/providers/form/models';
import { BarChartOutlined } from '@ant-design/icons';
import settingsFormJson from './settingsForm.json';
import React from 'react';
import { getStyle, validateConfigurableComponentSettings } from '@/providers/form/utils';
import ShaStatistic, { IShaStatisticProps } from '@/components/statistic';
import ShaIcon from '@/components/shaIcon';
import { useFormData } from '@/providers';
import _ from 'lodash';
import ConfigurableFormItem from '../formItem';
import { migrateCustomFunctions, migratePropertyName } from '@/designer-components/_common-migrations/migrateSettings';

const settingsForm = settingsFormJson as FormMarkup;

interface IStatisticComponentProps
  extends Omit<IShaStatisticProps, 'style' | 'valueStyle'>,
    IConfigurableFormComponent {
  valueStyle?: string;
}

const StatisticComponent: IToolboxComponent<IStatisticComponentProps> = {
  type: 'statistic',
  name: 'Statistic',
  icon: <BarChartOutlined />,
  Factory: ({ model: passedModel }) => {
    const { style, valueStyle, prefix, suffix, ...model } = passedModel;
    const { data: formData } = useFormData();

    return (
      <ConfigurableFormItem model={{...model, hideLabel: true}} valuePropName="checked" initialValue={model?.defaultValue}>
      {(value) => 
        <ShaStatistic
          {...model}
          value={value}
          prefix={prefix ? <ShaIcon iconName={prefix as any} /> : null}
          suffix={suffix ? <ShaIcon iconName={suffix as any} /> : null}
          style={getStyle(style, formData)}
          valueStyle={getStyle(valueStyle, formData)}
        />
        }
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
  migrator: (m) => m
    .add<IStatisticComponentProps>(0, (prev) => migratePropertyName(migrateCustomFunctions(prev)) as IStatisticComponentProps)
  ,
};

export default StatisticComponent;
