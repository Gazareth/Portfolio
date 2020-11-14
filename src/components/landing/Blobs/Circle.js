import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

const TYPE = 'Circle';

export default CustomPIXIComponent(
  {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps(instance, oldProps, newProps) {
      const { fill, x, y, radius } = newProps;
      instance.clear();
      instance.beginFill(fill);
      instance.drawCircle(x, y, radius);
      instance.endFill();
      instance.filters = [new PIXI.filters.BlurFilter(0.15, 1, 4, 15)];
    },
  },
  TYPE
);
