import { ComponentsContainer } from "components";
import { FormRawMarkup, IFormSettings } from "providers";
import { CrudProvider } from "providers/crudContext/index";
import { CrudMode } from "providers/crudContext/models";
import { ComponentsContainerProvider } from "providers/form/nesting/containerContext";
import { FormMarkupConverter } from "providers/formMarkupConverter/index";
import React, { FC } from "react";
import CrudActionButtons from "./crudActionButtons";
import { ItemContainerForm } from "./itemContainerForm";

export interface IDataListItemProps {
  listId: string;
  listName?: string;
  itemIndex: number;
  itemId?: any;

  allowEdit: boolean;
  updater?: (data: any) => Promise<any>;
  allowDelete: boolean;
  deleter?: () => Promise<any>;
  editMode: CrudMode;
  data?: any;
  markup: FormRawMarkup;
  formSettings: IFormSettings;

  allowChangeEditMode: boolean;
  autoSave?: boolean;

  isNewObject: boolean;
}

export const DataListItemRenderer: FC<IDataListItemProps> = (props) => {

  const {
    listId,
    itemIndex,
    itemId,
    data,
    allowEdit,
    updater,
    allowDelete,
    deleter,
    editMode,
    markup,
    formSettings,
    allowChangeEditMode,
    autoSave,
    isNewObject
  } = props;

  const itemListId = `${listId}_${!!itemId ? itemId.toString() : itemIndex}`;

  return (
    <FormMarkupConverter markup={markup} formSettings={formSettings}>
      {(flatComponents) => (
        <CrudProvider
          isNewObject={isNewObject}
          data={data}
          allowEdit={allowEdit}
          updater={updater}
          allowDelete={allowDelete}
          deleter={deleter}
          mode={editMode}
          allowChangeMode={allowChangeEditMode}
          autoSave={autoSave}
          editorComponents={flatComponents}
          displayComponents={flatComponents}
          formSettings={formSettings}
        >
          <div className="sha-datalist-actions">
            <CrudActionButtons />
          </div>
          <div key={itemListId} className="sha-datalist-cell">
            <ComponentsContainerProvider ContainerComponent={ItemContainerForm}>
              <ComponentsContainer containerId={'root'}/>
            </ComponentsContainerProvider>
          </div>
        </CrudProvider>
      )}
    </FormMarkupConverter>
  );
};