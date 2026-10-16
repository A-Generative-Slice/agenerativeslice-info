import React from 'react';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { SliceMailShowcase } from '../components/tools/SliceMailShowcase';

export const SliceMailPage: React.FC = () => {
    return (
        <ToolPageLayout productId="slice-mail">
            <SliceMailShowcase />
        </ToolPageLayout>
    );
};
