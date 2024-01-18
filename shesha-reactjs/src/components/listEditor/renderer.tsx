import { DeleteFilled, MenuOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import React, { FC, PropsWithChildren, useMemo, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { ListEditorChildrenFn } from '.';
import { IListEditorContext } from './contexts';
import { ListItem, SortableItem } from './models';
import classNames from 'classnames';
import { useStyles } from './styles/styles';

export interface IListEditorRendererProps<TItem = any> {
    contextAccessor: () => IListEditorContext<TItem>;
    children: ListEditorChildrenFn<TItem>;
}

export const ListEditorRenderer = <TItem extends ListItem,>(props: IListEditorRendererProps<TItem>) => {
    const { styles } = useStyles();
    const { contextAccessor, children } = props;
    const { value, deleteItem, addItem, insertItem, updateItem, updateList, readOnly } = contextAccessor();

    const onAddClick = () => {
        addItem();
    };

    const itemOnChange = (index: number, newValue: TItem) => {
        updateItem(index, newValue);
    };

    const sortableItems = useMemo(() => {
        return Boolean(value) && Array.isArray(value)
            ? value.map<SortableItem<TItem>>((item, index) => ({ data: item, id: index }))
            : undefined;
    }, [value]);

    const onSetList = (newState: SortableItem<TItem>[], _sortable, _store) => {
        const chosen = newState.some(item => item.chosen === true);
        if (chosen)
            return;

        if (value.length === newState.length) {
            const changedIndex = newState.find((item, index) => {
                //return item.id !== value[index].id;
                return item.data !== value[index];
            });
            if (changedIndex) {
                const rawItems = newState.map<TItem>(m => m.data);
                updateList(rawItems);
            };
        };
    };

    return (
        <div className={styles.list}>
            <div className={styles.listHeader}>
                <Button icon={<PlusCircleOutlined />} shape="round" onClick={onAddClick} size="small" disabled={readOnly}>Add</Button>
            </div>
            <div className={styles.listContainer}>
                {sortableItems && (
                    <ReactSortable<SortableItem<TItem>>
                        list={sortableItems}
                        setList={onSetList}
                        fallbackOnBody={true}
                        swapThreshold={0.5}
                        group={{
                            name: 'rows',
                        }}
                        sort={true}
                        draggable={`.${styles.listItem}`}
                        animation={75}
                        ghostClass={styles.listItemGhost}
                        emptyInsertThreshold={20}
                        handle={`.${styles.dragHandle}`}
                        scroll={true}
                        bubbleScroll={true}
                        disabled={readOnly}
                    >
                        {value.map((item, index) => {
                            const localItemChange = (newValue: TItem) => {
                                itemOnChange(index, newValue);
                            };
                            return (
                                <ListItemWrapper
                                    key={index}
                                    onDelete={() => {
                                        deleteItem(index);
                                    }}
                                    onInsert={(insertPosition) => {
                                        const newIndex = index + (insertPosition === 'before' ? 0 : 1);
                                        insertItem(newIndex);
                                    }}
                                    readOnly={readOnly}
                                    isLast={index === value.length - 1}
                                >
                                    {children({
                                        item,
                                        itemOnChange: localItemChange,
                                        index,
                                        readOnly: readOnly === true
                                    })}
                                </ListItemWrapper>);
                        })}
                    </ReactSortable>
                )}
            </div>
        </div>
    );
};

export type ItemInsertPosition = 'before' | 'after';

export interface IListItemWrapperProps extends PropsWithChildren {
    onDelete: () => void;
    onInsert: (insertPosition: ItemInsertPosition) => void;
    readOnly?: boolean;
    isLast: boolean;
}
export const ListItemWrapper: FC<IListItemWrapperProps> = ({ children, onDelete, onInsert, readOnly, isLast }) => {
    const [placeholderPosition, setPlaceholderPosition] = useState<ItemInsertPosition>(null);
    const { styles } = useStyles();

    const onDeleteClick = () => {
        onDelete();
    };

    return (
        <div className={styles.listItem}>
            {!readOnly && (
                <>
                    <InsertItemMarker
                        onClick={() => onInsert('before')}
                        onOpenChange={(visible) => (setPlaceholderPosition(visible ? 'before' : null))}
                    />
                    {placeholderPosition === 'before' && <NewItemPlaceHolder className={placeholderPosition}/>}
                    <span className={styles.dragHandle}>
                        <MenuOutlined />
                    </span>
                </>
            )}
            <div className={styles.listItemContent}>
                {children}
            </div>
            {!readOnly && (
                <>
                    <div className={styles.listItemControls}>
                        <Button
                            icon={<DeleteFilled color="red" />}
                            onClick={onDeleteClick}
                            size="small"
                            shape="circle"
                            danger
                            type="link"
                        />
                    </div>
                    {isLast && (
                        <>
                            {placeholderPosition === 'after' && <NewItemPlaceHolder className={placeholderPosition}/>}
                            <InsertItemMarker
                                onClick={() => onInsert('after')}
                                onOpenChange={(visible) => (setPlaceholderPosition(visible ? 'after' : null))}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
};


interface NewItemPlaceHolderProps {
    className?: string;
}
const NewItemPlaceHolder: FC<NewItemPlaceHolderProps> = ({ className }) => {
    const { styles } = useStyles();
    return (<div className={classNames(styles.listInsertPlaceholder, className)}></div>);
};

interface InsertItemMarkerProps {
    onClick: () => void;
    onOpenChange?: (open: boolean) => void;
}
const InsertItemMarker: FC<InsertItemMarkerProps> = ({ onClick, onOpenChange }) => {
    const { styles } = useStyles();
    return (
        <Tooltip
            placement="left"
            color="#fff"
            arrow={{ pointAtCenter: true }}
            align={{ offset: [10, 0] }}
            overlayInnerStyle={{ borderRadius: '5px', padding: 0, minHeight: '5px' }}
            onOpenChange={onOpenChange}
            mouseEnterDelay={0}
            mouseLeaveDelay={0}
            title={(<Button
                onClick={onClick}
                icon={<PlusOutlined />}
                size="small"
                type="link"
            >
                Add
            </Button>)}
        >
            <div className={styles.listInsertArea}></div>
        </Tooltip>
    );
};