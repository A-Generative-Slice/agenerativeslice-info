import React from 'react';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { SliceLeadsShowcase } from '../components/tools/SliceLeadsShowcase';

export const SliceLeadsPage: React.FC = () => {
    return (
        <ToolPageLayout productId="slice-leads">
            <SliceLeadsShowcase />
        </ToolPageLayout>
    );
};
