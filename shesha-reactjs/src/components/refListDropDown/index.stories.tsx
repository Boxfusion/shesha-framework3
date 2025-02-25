import React, { FC, useState } from 'react';
import { Button, Form } from 'antd';
import { Story } from '@storybook/react';
import RefListDropDown, { IRefListDropDownProps } from './';
import { addStory } from '@/stories/utils';
import StoryApp from '@/components/storyBookApp';

export default {
  title: 'Components/RefListDropDown',
  component: RefListDropDown,
  argTypes: {
    // backgroundColor: { control: 'color' },
    label: {
      description: 'Overwritten description',
      table: {
        type: {
          summary: 'Something short',
          detail: 'Something really really long',
        },
      },
      control: {
        type: null,
      },
    },
  }
};

interface IStoryArgs extends IRefListDropDownProps {
  /**
   * Test Value, is used only by this story for the `Set Test Value Button`
   */
  testValue?: any;
  /**
   * Initial Value, is used only by this story
   */
  initialValue?: any;
}

interface ITemplateProps extends IStoryArgs {
  children: React.ReactNode;
}

const BaseTemplate: FC<ITemplateProps> = props => {
  const { testValue, children } = props;
  const label = 'Dropdown';
  const name = 'dropdown';
  const [state, setState] = useState(null);

  const [form] = Form.useForm();

  const onFinish = (data: any) => {
    console.log('onFinish data ', data);
    setState(data);
  };

  return (
    <StoryApp>
      <div style={{ width: 500 }}>
        <Form
          {...{
            labelCol: {
              xs: { span: 24 },
              md: { span: 8 },
              sm: { span: 8 },
            },
            wrapperCol: {
              xs: { span: 24 },
              md: { span: 16 },
              sm: { span: 16 },
            },
          }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item label={label} name={name} initialValue={props.initialValue}>
            {children}
          </Form.Item>

          {Boolean(testValue) && (
            <Button
              onClick={() =>
                form?.setFieldsValue({
                  [name]: testValue,
                })
              }
            >
              Set Test Value
            </Button>
          )}

          <Button onClick={() => form?.resetFields()} style={{ margin: '0 12px' }}>
            Reset
          </Button>

          <Button onClick={() => form?.submit()} type="primary">
            Submit
          </Button>
        </Form>
      </div>

      {Boolean(state) && (
        <div>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      )}
    </StoryApp>
  );
};

//#region DTO

const DtoTemplate: Story<IStoryArgs> = args => {
  const { testValue, initialValue, ...refListProps } = args;
  return (
    <BaseTemplate {...args}>
      <RefListDropDown.Dto {...refListProps} />
    </BaseTemplate>
  );
};

// Reuse that template for creating different stories
export const SingleDto = addStory(DtoTemplate, {
  referenceListId: { module: 'shesha', name: 'PersonTitles' },
});

export const SingleDtoWithInitialValue = addStory(DtoTemplate, {
  referenceListId: { module: 'shesha', name: 'PersonTitles' },
  initialValue: {
    itemValue: 2,
    item: 'Mrs',
  },
});

export const MultipleDto = addStory(DtoTemplate, {
  referenceListId: { module: 'shesha', name: 'PersonTitles' },
  mode: 'multiple',
  testValue: [
    {
      itemValue: 2,
      item: 'Mrs',
    },
    {
      itemValue: 5,
      item: 'Prof',
    },
  ],
});
export const MultipleDtoWithInitialValue = addStory(DtoTemplate, {
  referenceListId: { module: 'shesha', name: 'PersonTitles' },
  mode: 'multiple',
  initialValue: [
    {
      itemValue: 2,
      item: 'Mrs',
    },
    {
      itemValue: 5,
      item: 'Prof',
    },
  ],
});

//#endregion

//#region Raw

const RawTemplate: Story<IStoryArgs> = args => {
  const { testValue, initialValue, ...refListProps } = args;
  return (
    <BaseTemplate {...args}>
      <RefListDropDown.Raw {...refListProps} />
    </BaseTemplate>
  );
};

export const SingleRaw = addStory(RawTemplate, {
  referenceListId: { module: 'shesha', name: 'TypeOfAccount' },
});

export const SingleRawWithInitialValue = addStory(RawTemplate, {
  referenceListId: { module: 'shesha', name: 'TypeOfAccount' },
  initialValue: 1,
});

export const MultipleRaw = addStory(RawTemplate, {
  referenceListId: { module: 'shesha', name: 'TypeOfAccount' },
  mode: 'multiple',
  testValue: [0, 1],
});
export const MultipleRawWithInitialValue = addStory(RawTemplate, {
  referenceListId: { module: 'shesha', name: 'TypeOfAccount' },
  mode: 'multiple',
  initialValue: [0, 1],
});

//#endregion
