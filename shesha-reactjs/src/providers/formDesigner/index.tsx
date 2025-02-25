import React, { FC, MutableRefObject, PropsWithChildren, useContext, useEffect } from 'react';
import { useDeepCompareEffect } from 'react-use';
import useThunkReducer from '@/hooks/thunkReducer';
import {
  IAsyncValidationError,
  IFormValidationErrors,
  IToolboxComponent,
  IToolboxComponentGroup,
} from '@/interfaces';
import { useMetadataDispatcher } from '@/providers';
import { UndoableActionCreators } from '@/utils/undoable';
import { useFormDesignerComponentGroups, useFormDesignerComponents } from '../form/hooks';
import { IFlatComponentsStructure, IFormSettings } from '../form/models';
import { IDataSource } from '../formDesigner/models';
import { getFlagSetters } from '../utils/flagsSetters';
import {
  addDataSourceAction,
  componentAddAction,
  componentAddFromTemplateAction,
  componentDeleteAction,
  componentDuplicateAction,
  componentUpdateAction,
  componentUpdateSettingsValidationAction,
  dataPropertyAddAction,
  endDraggingAction,
  endDraggingNewItemAction,
  removeDataSourceAction,
  setActiveDataSourceAction,
  setDebugModeAction,
  setFlatComponentsAction,
  setReadOnlyAction,
  setSelectedComponentAction,
  setValidationErrorsAction,
  startDraggingAction,
  startDraggingNewItemAction,
  updateChildComponentsAction,
  updateFormSettingsAction,
  updateToolboxComponentGroupsAction,
} from './actions';
import {
  FORM_DESIGNER_CONTEXT_INITIAL_STATE,
  FormDesignerActionsContext,
  FormDesignerStateContext,
  IAddDataPropertyPayload,
  IComponentAddFromTemplatePayload,
  IComponentAddPayload,
  IComponentDeletePayload,
  IComponentDuplicatePayload,
  IComponentUpdatePayload,
  IFormDesignerActionsContext,
  IFormDesignerStateContext,
  IUpdateChildComponentsPayload,
  UndoableFormDesignerStateContext,
} from './contexts';
import formReducer from './reducer';
import { useDataContextManager } from '@/providers/dataContextManager';
import { IDataContextFullInstance } from '@/providers/dataContextProvider';
import { useCallback } from 'react';

export interface IFormDesignerProviderProps {
  flatComponents: IFlatComponentsStructure;
  formSettings: IFormSettings;
  readOnly: boolean;
}

const FormDesignerProvider: FC<PropsWithChildren<IFormDesignerProviderProps>> = ({
  children,
  flatComponents,
  formSettings,
  readOnly,
}) => {
  const toolboxComponentGroups = useFormDesignerComponentGroups();
  const toolboxComponents = useFormDesignerComponents();

  const getToolboxComponent = (type: string) => toolboxComponents[type];

  const initial: IFormDesignerStateContext = {
    ...FORM_DESIGNER_CONTEXT_INITIAL_STATE,
    readOnly: readOnly,
    toolboxComponentGroups,
    ...flatComponents,
    formSettings: formSettings,
  };

  const { activateProvider } = useMetadataDispatcher(false) ?? {};
  const { setActiveContext } = useDataContextManager(false) ?? {};

  const [state, dispatch] = useThunkReducer(formReducer, {
    past: [],
    present: initial,
    future: [],
  });

  const statePresent = state.present;

  const setFlatComponents = (flatComponents: IFlatComponentsStructure) => {
    dispatch((dispatchThunk, _getState) => {
      dispatchThunk(setFlatComponentsAction(flatComponents));
      dispatchThunk(UndoableActionCreators.clearHistory());
    });
  };

  useEffect(() => {
    if (
      flatComponents &&
      (flatComponents.allComponents !== statePresent.allComponents ||
        flatComponents.componentRelations !== statePresent.componentRelations)
    ) {
      setFlatComponents(flatComponents);
    }
  }, [flatComponents]);

  const setReadOnly = (value: boolean) => {
    dispatch(setReadOnlyAction(value));
  };

  useEffect(() => {
    setReadOnly(readOnly);
  }, [readOnly]);

  const updateToolboxComponentGroups = (payload: IToolboxComponentGroup[]) => {
    dispatch(updateToolboxComponentGroupsAction(payload));
  };

  useDeepCompareEffect(() => {
    if (toolboxComponentGroups?.length !== 0) {
      updateToolboxComponentGroups(toolboxComponentGroups);
    }
  }, [toolboxComponentGroups]);

  const addDataProperty = useCallback((payload: IAddDataPropertyPayload) => {
    dispatch(dataPropertyAddAction(payload));
  }, [dispatch]);

  const addComponent = useCallback((payload: IComponentAddPayload) => {
    dispatch(componentAddAction(payload));
  }, [dispatch]);

  const addComponentsFromTemplate = (payload: IComponentAddFromTemplatePayload) => {
    dispatch(componentAddFromTemplateAction(payload));
  };

  const deleteComponent = (payload: IComponentDeletePayload) => {
    dispatch(componentDeleteAction(payload));
  };

  const duplicateComponent = (payload: IComponentDuplicatePayload) => {
    dispatch(componentDuplicateAction(payload));
  };

  const getComponentModel = useCallback((componentId) => {
    return statePresent.allComponents[componentId];
  }, [statePresent?.allComponents]);

  const updateComponent = (payload: IComponentUpdatePayload) => {
    dispatch(componentUpdateAction(payload));

    const component = getComponentModel(payload.componentId);
    const toolboxComponent = getToolboxComponent(component.type) as IToolboxComponent;
    if (toolboxComponent.validateSettings) {
      toolboxComponent
        .validateSettings(payload.settings)
        .then(() => {
          dispatch(componentUpdateSettingsValidationAction({ componentId: payload.componentId, validationErrors: [] }));
        })
        .catch(({ errors }) => {
          const validationErrors = errors as IAsyncValidationError[];
          dispatch(
            componentUpdateSettingsValidationAction({
              componentId: payload.componentId,
              validationErrors,
            })
          );
        });
    }
  };

  const getChildComponents = (componentId: string) => {
    const childIds = statePresent.componentRelations[componentId];
    if (!childIds) return [];
    const components = childIds.map((childId) => {
      return statePresent.allComponents[childId];
    });
    return components;
  };

  const getParentComponent = (componentId: string, type: string) => {
    let component = statePresent.allComponents[componentId];

    while (!!component) {
      component = statePresent.allComponents[component.parentId];
      if (component?.type === type)
        return component;
    }

    return null;
  };

  const setDebugMode = (isDebug: boolean) => {
    dispatch(setDebugModeAction(isDebug));
  };

  const startDraggingNewItem = useCallback(() => {
    dispatch(startDraggingNewItemAction());
  }, [dispatch]);

  const endDraggingNewItem = useCallback(() => {
    dispatch(endDraggingNewItemAction());
  }, [dispatch]);

  const startDragging = useCallback(() => {
    dispatch(startDraggingAction());
  }, [dispatch]);

  const endDragging = useCallback(() => {
    dispatch(endDraggingAction());
  }, [dispatch]);

  const setValidationErrors = useCallback((payload: IFormValidationErrors) => {
    dispatch(setValidationErrorsAction(payload));
  }, [dispatch]);

  const updateChildComponents = useCallback((payload: IUpdateChildComponentsPayload) => {
    dispatch(updateChildComponentsAction(payload));
  }, [dispatch]);

  const undo = () => {
    dispatch(UndoableActionCreators.undo());
  };

  const redo = () => {
    dispatch(UndoableActionCreators.redo());
  };

  const setSelectedComponent = (componentId: string, dataSourceId: string, dataContext: IDataContextFullInstance, componentRef?: MutableRefObject<any>) => {
    if (activateProvider) activateProvider(dataSourceId);
    if (setActiveContext) setActiveContext(dataContext.id);

    if (componentId !== state.present.selectedComponentId ||
      dataSourceId !== state.present.activeDataSourceId ||
      componentRef !== state.present.selectedComponentRef)
      dispatch(setSelectedComponentAction({ id: componentId, dataSourceId, componentRef }));
  };

  const updateFormSettings = (settings: IFormSettings) => {
    dispatch(updateFormSettingsAction(settings));
  };

  //#region move to designer
  const addDataSource = (dataSource: IDataSource) => {
    dispatch(addDataSourceAction(dataSource));
  };
  const removeDataSource = (datasourceId: string) => {
    dispatch(removeDataSourceAction(datasourceId));
  };

  const setActiveDataSource = (datasourceId: string) => {
    if (activateProvider) activateProvider(datasourceId);
    dispatch(setActiveDataSourceAction(datasourceId));
  };

  const getActiveDataSource = () => {
    return statePresent.activeDataSourceId
      ? statePresent.dataSources.find((ds) => ds.id === statePresent.activeDataSourceId)
      : null;
  };
  //#endregion

  const configurableFormActions: IFormDesignerActionsContext = {
    ...getFlagSetters(dispatch),
    addDataProperty,
    addComponent,
    addComponentsFromTemplate,
    deleteComponent,
    duplicateComponent,
    getComponentModel,
    updateComponent,
    getChildComponents,
    setDebugMode,
    startDraggingNewItem,
    endDraggingNewItem,
    startDragging,
    endDragging,
    setValidationErrors,
    updateChildComponents,
    undo,
    redo,
    setSelectedComponent,
    updateFormSettings,
    getToolboxComponent,
    addDataSource,
    removeDataSource,
    setActiveDataSource,
    getActiveDataSource,
    setReadOnly,
    getParentComponent
    /* NEW_ACTION_GOES_HERE */
  };

  return (
    <UndoableFormDesignerStateContext.Provider value={state}>
      <FormDesignerStateContext.Provider value={statePresent}>
        <FormDesignerActionsContext.Provider value={configurableFormActions}>
          {children}
        </FormDesignerActionsContext.Provider>
      </FormDesignerStateContext.Provider>
    </UndoableFormDesignerStateContext.Provider>
  );
};

function useFormDesignerState(require: boolean = true) {
  const context = useContext(FormDesignerStateContext);

  if (require && context === undefined) {
    throw new Error('useFormDesignerState must be used within a FormDesignerProvider');
  }

  return context;
}

function useFormDesignerActions(require: boolean = true) {
  const context = useContext(FormDesignerActionsContext);

  if (require && context === undefined) {
    throw new Error('useFormDesignerActions must be used within a FormDesignerProvider');
  }

  return context;
}

function useUndoableState(require: boolean = true) {
  const context = useContext(UndoableFormDesignerStateContext);

  if (require && context === undefined) {
    throw new Error('useUndoableState must be used within a FormDesignerProvider');
  }

  return {
    canUndo: context.past.length > 0,
    canRedo: context.future.length > 0,
  };
}

function useFormDesigner(require: boolean = true) {
  const actionsContext = useFormDesignerActions(require);
  const stateContext = useFormDesignerState(require);
  const undoableContext = useUndoableState(require);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when require == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext, ...undoableContext }
    : undefined;
}

export { FormDesignerProvider, useFormDesigner, useFormDesignerActions, useFormDesignerState };
