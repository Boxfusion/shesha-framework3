import ChildEntitiesTagGroupModal from './modal';
import React, {
  FC,
  useEffect,
  useMemo,
  useState
} from 'react';
import { addChildEntitiesTagGroupOption } from './utils';
import {
  Button,
  Input,
  message,
  Modal,
  Select,
  Tag
} from 'antd';
import { DataContextProvider } from '@/providers/dataContextProvider/index';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { executeScriptSync, useApplicationContext } from '@/providers/form/utils';
import { IChildEntitiesTagGroupProps, IChildEntitiesTagGroupSelectOptions } from './models';
import { nanoid } from '@/utils/uuid';
import { SubFormProvider } from '@/providers';
import { useDeepCompareEffect } from '@/hooks/useDeepCompareEffect';
import { useFormConfiguration } from '@/providers/form/api';
import { useStyles } from './styles/styles';

const { confirm } = Modal;

interface IProps {
  model: IChildEntitiesTagGroupProps;
  onChange?: Function;
  value?: any;
}

interface IState {
  activeValue?: IChildEntitiesTagGroupSelectOptions;
  open: boolean;
  options: IChildEntitiesTagGroupSelectOptions[];
  origin: object[] | object | null;
}

const INIT_STATE: IState = { open: false, options: [], origin: null };
const CONFIRM_DELETE_TITLE = 'Are you sure you want to delete this item?';
const WARNING_BIND_FORM = 'Please bind an appropriate form to this component.';

const ChildEntitiesTagGroupControl: FC<IProps> = ({ onChange, value, model }) => {
  const { styles } = useStyles();
  const [state, setState] = useState<IState>(INIT_STATE);
  const { activeValue, open, options } = state;
  const { deleteConfirmationBody, deleteConfirmationTitle, formId, labelFormat, propertyName } = model;

  const allData = useApplicationContext();

  const {
    formConfiguration,
    loading: isFetchingFormConfiguration,
    refetch: refetchFormConfig,
    error: formConfigurationError,
  } = useFormConfiguration({
    formId,
    lazy: true,
  });

  const calculateLabel = (value: any, func: string) => {
    return executeScriptSync(func, { ...allData, item: value });
  };

  useEffect(() => {
    if (Array.isArray(value)) {
      const opts: IChildEntitiesTagGroupSelectOptions[] = [];
      value.forEach(item => {
        opts.push({
          label: calculateLabel(item, labelFormat),
          value: nanoid(),
          data: item
        });
      });
      setState((s) => ({ ...s, options: opts }));
    }
  }, [value]);

  useDeepCompareEffect(() => {
    if (formId) {
      refetchFormConfig();
    }
  }, [formId]);

  const setOpen = (open: boolean) => setState((s) => ({ ...s, open, activeValue: null }));

  const setOption = (option: IChildEntitiesTagGroupSelectOptions) => {
    const opts = addChildEntitiesTagGroupOption(state.options, option);
    setState((s) => ({ ...s, options: opts }));

    onChange(opts.map(item => item.data));
  };

  const onModalChange = (value: any) => {
    setOption(
      {
        label: calculateLabel(value[propertyName], labelFormat),
        value: activeValue?.value ?? nanoid(),
        data: value[propertyName]
      }
    );
    setState((s) => ({ ...s, activeValue: null }));
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
      setOpen(true);
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

  return (
    <div className={styles.childEntityTagContainer}>
      {open && (
        <DataContextProvider
          id={propertyName}
          name={propertyName}
          description={propertyName}
          type={'childEntitiesTagGroup'}
          initialData={new Promise<any>(resolve => resolve({ [propertyName]: activeValue?.data }))}
        >
          <SubFormProvider id={model.id} context={propertyName} propertyName={propertyName} markup={markup} readOnly={model.readOnly}>
            <ChildEntitiesTagGroupModal
              {...model}
              formInfo={formConfiguration}
              error={error}
              open={open}
              onToggle={setOpen}
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
