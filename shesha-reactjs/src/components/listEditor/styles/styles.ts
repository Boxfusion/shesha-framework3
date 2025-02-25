import { createStyles } from "antd-style";

export const useStyles = createStyles(({ css, cx, token }) => {
    const dragHandle = "sha-drag-handle";
    const listContainer = "sha-list-container";
    const listHeader = "sha-list-header";
    const listInsertArea = "sha-list-insert-area";
    const listInsertPlaceholder = "sha-list-insert-placeholder";
    const listInsertRow = "sha-list-insert-row";
    const listItem = "sha-list-item";
    const listItemContent = "sha-list-item-content";
    const listItemControls = "sha-list-item-controls";
    const listItemGhost = "sha-list-item-ghost";
    
    const list = cx("sha-list", css`
        padding-left: 4px;
        
        .${listHeader} {
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            margin: 5px 0;
        }

        .${listContainer} {
            .${listItem} {
                position: relative;
                padding: 5px;
                display: flex;

                border: 1px solid #ddd;
                border-radius: 4px;
                margin-bottom: 4px;

                .${listInsertPlaceholder} {
                    width: 100%;
                    height: 1px;
                    border: 2px solid ${token.colorPrimary};
                    position: absolute;
                    left: 0px;
                    z-index: 10;

                    &.before{
                        top: -5px;
                    }
                    &.after{
                        bottom: -5px;
                    }
                }

                .${listInsertArea} {
                    position: absolute;
                    height: 18px;
                    width: 30px;            
                    left: -5px;
                    z-index: 20;

                    &:first-child {
                        top: -12px;
                    }
                    &:last-child {
                        bottom: -12px;
                    }
                }
                &:not(:last-child) {
                    .${listInsertRow}:last-child {
                        display: none;
                    }
                }

                .${dragHandle} {
                    transition: opacity 0.2s;
                    cursor: grab;

                    margin-right: 8px;
                    display: flex;
                    align-items: center;
                }

                .${listItemContent} {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .${listItemControls} {
                    transition: opacity 0.2s;
                    display: flex;
                    align-items: center;
                }

                &:not(:hover) {
                    .${listItemControls} {
                        opacity: 0;
                    }

                    .${dragHandle} {
                        opacity: 0;
                    }
                }
            }
        }
    `);

    return {
        list,
        dragHandle,
        listContainer,
        listHeader,
        listInsertArea,
        listInsertPlaceholder,
        listInsertRow,
        listItem,
        listItemContent,
        listItemControls,
        listItemGhost,
    };
});