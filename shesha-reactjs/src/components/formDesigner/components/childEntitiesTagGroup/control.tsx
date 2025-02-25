import ChildEntitiesTagGroupModal from './modal';
import React, { FC, useMemo, useState } from 'react';
import { Button, Input, message, Modal, Select, Tag } from 'antd';
import { DataContextProvider } from '@/providers/dataContextProvider/index';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { executeScriptSync, useApplicationContext } from '@/providers/form/utils';
import { IChildEntitiesTagGroupProps, IChildEntitiesTagGroupSelectOptions } from './models';
import { nanoid } from '@/utils/uuid';
import { SubFormProvider } from '@/providers';
import { useDeepCompareEffect } from '@/hooks/useDeepCompareEffect';
import { useFormConfiguration } from '@/providers/form/api';
import { useStyles } from './styles/styles';
import { useParent } from '@/providers/parentProvider/index';
import { useDeepCompareMemo } from '@/index';

const { confirm } = Modal;

interface IProps {
  model: IChildEntitiesTagGroupProps;
  onChange?: Function;
  value?: any;
}

interface IState {
  activeValue?: IChildEntitiesTagGroupSelectOptions;
  open: boolean;
}

const INIT_STATE: IState = { open: false };
const CONFIRM_DELETE_TITLE = 'Are you sure you want to delete this item?';
const WARNING_BIND_FORM = 'Please bind an appropriate form to this component.';
const ERROR_LABEL = 'Please configure label configuration for this component.';

const ChildEntitiesTagGroupControl: FC<IProps> = ({ onChange, value, model }) => {
  const { styles } = useStyles();
  const [state, setState] = useState<IState>(INIT_STATE);
  const { activeValue, open } = state;
  const { deleteConfirmationBody, deleteConfirmationTitle, formId, labelFormat, propertyName } = model;

  const allData = useApplicationContext();
  const parent = useParent();

  const {
    formConfiguration,
    loading: isFetchingFormConfiguration,
    refetch: refetchFormConfig,
    error: formConfigurationError,
  } = useFormConfiguration({
    formId,
    lazy: true,
  });

  useDeepCompareEffect(() => {
    if (formId) {
      refetchFormConfig();
    }
  }, [formId]);

  const calculateLabel = (value: any, func: string, showError: boolean = false) => {
    try {
      return executeScriptSync(func, { ...allData, item: value });
    } catch {
      if (showError)
        message.error(ERROR_LABEL);
      return 'Not configured';
    }
  };

  const options = useDeepCompareMemo(() => {
    if (Array.isArray(value)) {
      const opts: IChildEntitiesTagGroupSelectOptions[] = [];
      value.forEach(item => {
        opts.push({
          label: calculateLabel(item, labelFormat),
          value: nanoid(),
          data: item
        });
      });
      return opts;
    }
    return [];
  }, [value]);

  const onModalChange = (value: any) => {
    const data = !!value ? value[propertyName] : undefined;
    if (activeValue) {
      onChange(options.map(item => item.value === activeValue.value ? data : item.data));
    } else {
      onChange([...options.map(item => item.data), data]);
    }
  };

  const onClickTag = (val: IChildEntitiesTagGroupSelectOptions) => () => {
    setState((s) => ({ ...s, activeValue: val, open: true }));
  };

  const onCloseTag = (item: string) => (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();

    confirm({
      title: deleteConfirmationTitle || CONFIRM_DELETE_TITLE,
      icon: <ExclamationCircleOutlined />,
      content: deleteConfirmationBody,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        const opts = options.filter(({ value }) => value !== item);
        setState((s) => ({ ...s, options: opts }));
        onChange(opts.map(item => item.data));
      },
    });
  };

  const onOpenModal = () => {
    if (formConfiguration) {
      setState((s) => ({ ...s, open: true, activeValue: null }));
    } else {
      message.warning(WARNING_BIND_FORM);
    }
  };

  const isEditable = !model?.readOnly;

  const tagRender = ({ label, value }) => {
    const val = options.find(x => x.value === value);
    return <Tag closable={isEditable} onClick={onClickTag(val)} onClose={onCloseTag(value)}>
      {label}
    </Tag>;
  };

  const inputGroupProps = isEditable ? {} : { className: styles.childEntityTagFullWidth };

  const error = formConfigurationError;
  const loading = isFetchingFormConfiguration;

  const markup = useMemo(() => {
    return { components: formConfiguration?.markup, formSettings: formConfiguration?.settings };
  }, [formConfiguration]);

  const contextId = [parent?.subFormIdPrefix, propertyName].filter(x => !!x).join('.');

  return (
    <div className={styles.childEntityTagContainer}>
      {open && (
        <DataContextProvider
          id={contextId}
          name={propertyName}
          description={propertyName}
          type={'childEntitiesTagGroup'}
          initialData={new Promise<any>(resolve => resolve({ [propertyName]: activeValue?.data }))}
        >
          <SubFormProvider id={model.id} context={contextId} propertyName={propertyName} markup={markup} readOnly={model.readOnly}>
            <ChildEntitiesTagGroupModal
              {...model}
              formInfo={formConfiguration}
              error={error}
              open={open}
              onToggle={() => setState((s) => ({...s, open: false}))}
              loading={loading}
              onChange={onModalChange}
            />
          </SubFormProvider>
        </DataContextProvider>
      )}

      <Input.Group {...inputGroupProps}>
        <Select mode="tags" value={options} tagRender={tagRender} dropdownStyle={{ display: 'none' }} searchValue='' />
        {isEditable && <Button onClick={onOpenModal} className={styles.childEntityTagAdd} icon={<PlusOutlined />} />}
      </Input.Group>
    </div>
  );
};

export default ChildEntitiesTagGroupControl;
