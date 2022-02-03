import { FC, useMemo } from "react";
import { Block, Elem } from "../../utils/bem";

import "./PanelBase.styl";
import { PanelType } from "./SidePanels";

export type PanelBaseExclusiveProps = "name" | "title"

type ResizeHandler = (name: PanelType, size: number) => void;

interface PanelBaseProps {
  name: PanelType;
  title: string;
  width?: number;
  visible?: boolean;
  collapsable?: boolean;
  position?: "left" | "right";
  currentEntity?: any;
  onResize?: ResizeHandler;
  onVisibilityChange?: (name: PanelType, visible: boolean) => void;
}

export type PanelProps = Omit<PanelBaseProps, PanelBaseExclusiveProps>

export const PanelBase: FC<PanelBaseProps> = ({ name, title, width, onResize, children, ...props }) => {
  const resizeHandler = useMemo(() => {
    return (size: number) => onResize?.(name, size);
  }, [name, onResize]);

  return (
    <Block
      name="panel"
      mix={name}
      mod={{ position: props.position ?? 'left' }}
      style={{ width: width ?? 320 }}
    >
      <Elem name="header">
        {title}
      </Elem>
      <Elem name="content">
        <Block name={name}>
          {children}
        </Block>
      </Elem>
    </Block>
  );
};
