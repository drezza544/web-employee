// import './BasicButton.scss';
// import React from 'react';
// import { Link } from 'react-router-dom';

// type Props = {
//   id?: string;
//   display?: React.CSSProperties['display'];
//   justifyContent?: React.CSSProperties['justifyContent'];
//   alignItems?: React.CSSProperties['alignItems'];
//   onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
//   to?: string; // Opsional, hanya dipakai kalau navigation
//   isNavigation?: boolean; // ✅ flag baru
//   colorTitle?: React.CSSProperties['color'];
//   fontSizeTitle?: React.CSSProperties['fontSize'];
//   fontFamilyTitle?: React.CSSProperties['fontFamily'];
//   fontWeightTitle?: React.CSSProperties['fontWeight'];
//   letterSpacingTitle?: React.CSSProperties['letterSpacing'];
//   title?: string | React.ReactNode;
//   backgroundColor?: string;
//   padding?: string;
//   enableGradient?: boolean;
//   classNameTitle?: string;
//   className?: string;
//   type?: 'button' | 'submit' | 'reset';
//   [key: string]: any;
// };

// const BasicButton: React.FC<Props> = ({
//   id,
//   display,
//   justifyContent,
//   alignItems,
//   onClick,
//   to = '#',
//   isNavigation = false, // ✅ default false
//   colorTitle,
//   fontSizeTitle,
//   fontFamilyTitle,
//   fontWeightTitle,
//   letterSpacingTitle,
//   title,
//   enableGradient,
//   classNameTitle,
//   className,
//   backgroundColor,
//   padding,
//   type = 'button',
//   ...props
// }) => {
//   const commonStyle: React.CSSProperties = {
//     ...props.style,
//     backgroundColor,
//     padding,
//     display: display || 'flex',
//     justifyContent: justifyContent || 'center',
//     alignItems: alignItems || 'center',
//     outline: 'none', // saya disabled outline karena mengganggu.
//   };

//   const classes = `${className ?? ''} btn btn-basicbutton ${enableGradient ? 'gradient-button' : ''} btn-no-border`;

//   const titleStyle: React.CSSProperties = {
//     color: colorTitle,
//     fontSize: fontSizeTitle,
//     fontFamily: fontFamilyTitle,
//     fontWeight: fontWeightTitle,
//     letterSpacing: letterSpacingTitle,
//   };

//   return isNavigation ? (
//     <Link
//       id={id}
//       to={to}
//       onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
//       className={classes}
//       style={commonStyle}
//     >
//       <p className={`${classNameTitle ?? ''} title`} style={titleStyle}>
//         {title}
//       </p>
//     </Link>
//   ) : (
//     <button
//       id={id}
//       type={type}
//       onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
//       className={classes}
//       style={commonStyle}
//     >
//       <p className={`${classNameTitle ?? ''} title`} style={titleStyle}>
//         {title}
//       </p>
//     </button>
//   );
// };

// export default BasicButton;


import './BasicButton.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

type Props = {
  id?: string;
  display?: React.CSSProperties['display'];
  justifyContent?: React.CSSProperties['justifyContent'];
  alignItems?: React.CSSProperties['alignItems'];
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  to?: string;
  isNavigation?: boolean;
  isLoading?: boolean; // ✅ tambahkan loading
  colorTitle?: React.CSSProperties['color'];
  fontSizeTitle?: React.CSSProperties['fontSize'];
  fontFamilyTitle?: React.CSSProperties['fontFamily'];
  fontWeightTitle?: React.CSSProperties['fontWeight'];
  letterSpacingTitle?: React.CSSProperties['letterSpacing'];
  title?: string | React.ReactNode;
  backgroundColor?: string;
  padding?: string;
  enableGradient?: boolean;
  classNameTitle?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any;
};

const BasicButton: React.FC<Props> = ({
  id,
  display,
  justifyContent,
  alignItems,
  onClick,
  to = '#',
  isNavigation = false,
  isLoading = false, // ✅ default false
  colorTitle,
  fontSizeTitle,
  fontFamilyTitle,
  fontWeightTitle,
  letterSpacingTitle,
  title,
  enableGradient,
  classNameTitle,
  className,
  backgroundColor,
  padding,
  type = 'button',
  ...props
}) => {
  const commonStyle: React.CSSProperties = {
    ...props.style,
    backgroundColor,
    padding,
    display: display || 'flex',
    justifyContent: justifyContent || 'center',
    alignItems: alignItems || 'center',
    outline: 'none',
    gap: '8px',
  };

  const classes = `${className ?? ''} btn btn-basicbutton ${enableGradient ? 'gradient-button' : ''} btn-no-border`;

  const titleStyle: React.CSSProperties = {
    color: colorTitle,
    fontSize: fontSizeTitle,
    fontFamily: fontFamilyTitle,
    fontWeight: fontWeightTitle,
    letterSpacing: letterSpacingTitle,
  };

  const content = isLoading ? (
    <CircularProgress size={18} color="inherit" />
  ) : (
    <p className={`${classNameTitle ?? ''} title`} style={titleStyle}>
      {title}
    </p>
  );

  return isNavigation ? (
    <Link
      id={id}
      to={to}
      onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
      className={classes}
      style={commonStyle}
    >
      {content}
    </Link>
  ) : (
    <button
      id={id}
      type={type}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      className={classes}
      style={commonStyle}
      disabled={isLoading}
    >
      {content}
    </button>
  );
};

export default BasicButton;
