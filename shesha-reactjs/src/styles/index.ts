import { FullToken } from "antd-style";

export const sheshaStyles = {
    paddingSM: 4,
    paddingMD: 8,
    paddingLG: 12,
    
    pageHeadingHeight: "45px", // @sha-page-heading-height
    pageToolbarHeight: "33px", // @sha-page-toolbar-height
    border: "1px solid #d3d3d3", // @sha-border

    columnFilterHeight: "150px",

    transition: "all 0.3s ease-out;",

    mediaPhoneLg: "only screen and (max-width: 500px)",

    flexCenterAlignedSpaceBetween: `
    display: flex;
    justify-content: space-between;
    align-items: center;
`,
};

export const getTextHoverEffects = (token: FullToken) => {
    return `
        transition: ${sheshaStyles.transition};
        &:hover {
            color: ${token.colorPrimary} !important;
        }
        
        cursor: pointer;
    `;
};

export const getWarningHoverEffects = (token: FullToken) => {
    return `
        transition: ${sheshaStyles.transition};
        &:hover {
            color: ${token.colorWarning} !important;
        }
        
        cursor: pointer;
    `;
};