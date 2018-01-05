import * as React from 'react';
import * as Enzyme from 'enzyme';

let wrapper: Enzyme.ReactWrapper<any, any> | undefined = undefined;

export const enzymeWrapperFactory = {
    mount<P>(node: React.ReactElement<P>, options?: Enzyme.MountRendererProps): Enzyme.ReactWrapper<P, any> {
        wrapper = Enzyme.mount(node, options);
        return wrapper;
    },

    unmount() {
        if (wrapper) {
            wrapper.unmount();
            wrapper = undefined;
        }
    }
};