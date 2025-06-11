import React from "react";
import { Text } from "react-native";
import { typography } from "../../styles/typography";
import { fonts } from "../../styles/fonts";

const Typography = ({ style, variant, children, ...props }) => {
  const getTypographyStyle = () => {
    if (variant && typography[variant]) {
      return typography[variant];
    }
    return { fontFamily: fonts.regular };
  };

  const combinedStyle = [getTypographyStyle(), style];

  return (
    <Text style={combinedStyle} {...props}>
      {children}
    </Text>
  );
};

export default Typography;
