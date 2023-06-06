import { ReactNode, createContext, useContext, useState } from 'react';

export type DocsTheme = 'dark' | 'light';

export type DocsThemeState = {
    theme: DocsTheme;
    setTheme: (theme: DocsTheme) => void;
};

const DocsThemeContext = createContext<DocsThemeState | undefined>(undefined);

export type DocsThemeContextProviderProps = {
    children: ReactNode;
};

export const DocsThemeContextProvider = ({ children }: DocsThemeContextProviderProps) => {
    const [theme, setThemeState] = useState<'dark' | 'light'>('light');

    const setTheme = (theme: DocsTheme) => {
        if (theme === 'dark') {
            document.body.setAttribute('data-darkmode', 'true');
        } else {
            document.body.removeAttribute('data-darkmode');
        }
        setThemeState(theme);
    };

    return <DocsThemeContext.Provider value={{ theme, setTheme }}>{children}</DocsThemeContext.Provider>;
};

export const useDocsTheme = () => {
    const themeState = useContext(DocsThemeContext);
    if (themeState === undefined) {
        throw new Error('useDocsTheme must be used inside of a DocsThemeContext');
    }
    return themeState;
};
