import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  onPress?: () => void;
  onClick?: () => void;
}

export const BotonAtrasCirculo: React.FC<Props> = ({ size = 36, onPress, onClick }) => {
  const handlePress = onPress || onClick;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        estilos.boton,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="#121e36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M15 18l-6-6 6-6" />
      </Svg>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  boton: {
    borderWidth: 2,
    borderColor: '#121e36',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
