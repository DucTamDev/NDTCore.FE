import { genColors }     from './gen-colors';
import { genSpacing }    from './gen-spacing';
import { genTypography } from './gen-typography';
import { genRadius }     from './gen-radius';
import { genShadow }     from './gen-shadow';
import { genZIndex }     from './gen-z-index';
import { genBreakpoint } from './gen-breakpoint';
import { genTransition } from './gen-transition';

console.log('\n🔧  Generating design system tokens...\n');

genColors();
genSpacing();
genTypography();
genRadius();
genShadow();
genZIndex();
genBreakpoint();
genTransition();

console.log('\n✅  Done.\n');