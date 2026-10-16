import React from 'react';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { SliceDAMShowcase } from '../components/tools/SliceDAMShowcase';

export const SliceDAMPage: React.FC = () => {
    return (
        <ToolPageLayout productId="slice-dam">
            <SliceDAMShowcase />
        </ToolPageLayout>
    );
};
