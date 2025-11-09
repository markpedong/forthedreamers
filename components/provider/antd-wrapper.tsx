import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';
import { ConfigProvider, theme } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsClient } from '@uidotdev/usehooks';
import { useTheme } from 'next-themes';
import enUS from 'antd/locale/en_US';
import dayjs from 'dayjs';
import { getCssVarHex } from '@/utils/helper';
import '@ant-design/v5-patch-for-react-19';
import { unstableSetRender } from 'antd';
import { createRoot } from 'react-dom/client';

unstableSetRender((node, container) => {
  //@ts-ignore
  container._reactRoot ||= createRoot(container);
  //@ts-ignore
  const root = container._reactRoot;
  root.render(node);
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});

dayjs.locale('en');

const AntdWrapper: FC<PropsWithChildren> = ({ children }) => {
  const isMobile = useIsMobile();
  const isCLient = useIsClient();
  const isDark = useTheme().resolvedTheme === 'dark';

  if (!isCLient) return null;

  const primaryHex = getCssVarHex('--primary');
  const primaryForeground = getCssVarHex('--primary-foreground');

  return (
    <div className={classNames({ 'pb-20': isMobile })}>
      <AntdRegistry>
        <ConfigProvider
          locale={enUS}
          theme={{
            token: {
              fontFamily: 'Outfit',
              colorTextLightSolid: primaryForeground,
              colorPrimaryTextHover: primaryForeground,
              colorPrimaryHover: primaryHex,
              colorPrimary: primaryHex,
            },
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
        >
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </div>
  );
};

export default AntdWrapper;
