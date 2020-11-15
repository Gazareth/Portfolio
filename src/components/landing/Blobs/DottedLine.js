import { CustomPIXIComponent } from 'react-pixi-fiber';
import * as PIXI from 'pixi.js';

const TYPE = 'DashedLine';

// Dotted line courtesy of https://github.com/pixijs/pixi.js/issues/1333
export default CustomPIXIComponent(
  {
    customDisplayObject: () => new PIXI.Graphics(),
    customApplyProps(instance, oldProps, newProps) {
      const { startPoint, endPoint, dash = 16, gap = 8, thickness = 2, color = 0xffffff } = newProps;
      instance.clear();
      instance.lineStyle(thickness, color);

      const currentPosition = startPoint;
      instance.moveTo(currentPosition.x, currentPosition.y);

      const absValues = {
        toX: Math.abs(endPoint.x),
        toY: Math.abs(endPoint.y),
      };

      for (; Math.abs(currentPosition.x) < absValues.toX || Math.abs(currentPosition.y) < absValues.toY; ) {
        currentPosition.x = Math.abs(currentPosition.x + dash) < absValues.toX ? currentPosition.x + dash : endPoint.x;
        currentPosition.y = Math.abs(currentPosition.y + dash) < absValues.toY ? currentPosition.y + dash : endPoint.y;

        instance.lineTo(currentPosition.x, currentPosition.y);

        currentPosition.x = Math.abs(currentPosition.x + gap) < absValues.toX ? currentPosition.x + gap : endPoint.x;
        currentPosition.y = Math.abs(currentPosition.y + gap) < absValues.toY ? currentPosition.y + gap : endPoint.y;

        instance.moveTo(currentPosition.x, currentPosition.y);
      }
    },
  },
  TYPE
);
