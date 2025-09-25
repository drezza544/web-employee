import './TextInputDefault.scss';

import React from 'react';
import { TextBox } from 'devextreme-react/text-box';
import type { Properties as TextBoxProps } from 'devextreme/ui/text_box';

type Props = {
  visible?: boolean;
  Vertical?: boolean;
  display?: string;
  alignItems?: string;
  justifyContent?: string;
  marginTop?: number | string;
  widthTitle?: number | string;
  textAlign?: React.CSSProperties['textAlign'];
  DisabledShowTitle?: boolean;
  EnableStyleTextInput?: boolean;
  StyleTextInputCustom?: string;
  title?: string;
  width?: number | string;
  height?: number | string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  onValueChanged?: TextBoxProps['onValueChanged'];
  disabled?: boolean;
  showClearButton?: boolean;
  mode?: TextBoxProps['mode'];
  mask?: string;
  maskRules?: Record<string, RegExp>;
  maskInvalidMessage?: string;
  useMaskedValue?: boolean;
  maxLength?: number;
  showMaskMode?: TextBoxProps['showMaskMode'];
  stylingMode?: TextBoxProps['stylingMode'];
  Validator?: React.ReactNode;
  onEnterKey?: () => void;
  [key: string]: any; // kalau ada property baru aja, bisa ditambahin disini.....
};

const TextInputDefault: React.FC<Props> = ({
  visible = true,
  Vertical,
  display,
  alignItems,
  justifyContent,
  marginTop,
  widthTitle,
  textAlign,
  DisabledShowTitle,
  EnableStyleTextInput,
  StyleTextInputCustom,
  title,
  width,
  height,
  defaultValue,
  value,
  placeholder,
  onValueChanged,
  disabled,
  showClearButton,
  mode,
  mask,
  maskRules,
  maskInvalidMessage,
  useMaskedValue,
  maxLength,
  showMaskMode,
  stylingMode,
  Validator,
  onEnterKey,
  ...props
}) => {
  if (!visible) return null;

  return (
    <div
      id={Vertical ? 'textinpudefault-notHorizontal' : 'textinpudefault'}
      className="c-textinputdefault"
      style={{
        ...props,
        display,
        alignItems,
        justifyContent,
        marginTop,
      }}
    >
      {!DisabledShowTitle && (
        <p
          style={{
            width: widthTitle,
            textAlign: textAlign,
          }}
          className={EnableStyleTextInput ? StyleTextInputCustom : 'title TextRobotoRegular'}
        >
          {title}
        </p>
      )}

      <TextBox
        style={{
          marginTop: Vertical ? 10 : 0,
        }}
        className="input-textbox"
        width={width}
        height={height}
        defaultValue={defaultValue}
        value={value}
        placeholder={placeholder}
        onValueChanged={onValueChanged}
        disabled={disabled}
        showClearButton={showClearButton}
        mode={mode}
        mask={mask}
        maskRules={maskRules}
        maskInvalidMessage={maskInvalidMessage}
        useMaskedValue={useMaskedValue}
        maxLength={maxLength}
        showMaskMode={showMaskMode || 'onFocus'}
        stylingMode={stylingMode || 'filled'}
        onEnterKey={onEnterKey}
      >
        {Validator}
      </TextBox>
    </div>
  );
};

export default TextInputDefault;
