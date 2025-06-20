import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';
export declare function IconSymbol({ name, size, color, style, weight, }: {
    name: SymbolViewProps['name'];
    size?: number;
    color: string;
    style?: StyleProp<ViewStyle>;
    weight?: SymbolWeight;
}): import("react").JSX.Element;
