import React, { FC, PropsWithChildren } from 'react';
import { ReferenceListItemDto } from '@/apis/referenceList';
import { Tooltip } from 'antd';

interface IToolTipProps {
  currentStatus: ReferenceListItemDto;
  showReflistName: boolean;
}

export const DescriptionTooltip: FC<PropsWithChildren<IToolTipProps>> = ({
  currentStatus,
  showReflistName,
  children,
}) => {
  const popReflistName = !!(!showReflistName && currentStatus?.item);

  const showToolTip = !!currentStatus?.description || popReflistName;

  return showToolTip ? (
    <Tooltip
      placement="rightTop"
      title={
        <>
          {popReflistName && (
            <>
              <span>{currentStatus?.item}</span>
              <br />
            </>
          )}
          <span>{currentStatus.description}</span>
        </>
      }
    >
      {children}
    </Tooltip>
  ) : (
    <>{children}</>
  );
};
