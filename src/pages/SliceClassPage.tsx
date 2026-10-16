import React from 'react';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { SliceClassShowcase } from '../components/tools/SliceClassShowcase';

export const SliceClassPage: React.FC = () => {
    return (
        <ToolPageLayout productId="slice-class">
            <SliceClassShowcase />
        </ToolPageLayout>
    );
};
