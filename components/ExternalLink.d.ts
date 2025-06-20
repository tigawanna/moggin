import { Href, Link } from 'expo-router';
import { type ComponentProps } from 'react';
type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
    href: Href & string;
};
export declare function ExternalLink({ href, ...rest }: Props): import("react").JSX.Element;
export {};
