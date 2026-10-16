import React from 'react';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { SlicePPTShowcase } from '../components/tools/SlicePPTShowcase';

export const SlicePPTPage: React.FC = () => {
    return (
        <ToolPageLayout productId="slice-ppt">
            <SlicePPTShowcase />
        </ToolPageLayout>
    );
};
