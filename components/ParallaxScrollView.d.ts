import type { PropsWithChildren, ReactElement } from 'react';
type Props = PropsWithChildren<{
    headerImage: ReactElement;
    headerBackgroundColor: {
        dark: string;
        light: string;
    };
}>;
export default function ParallaxScrollView({ children, headerImage, headerBackgroundColor, }: Props): import("react").JSX.Element;
export {};
