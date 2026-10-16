import React from 'react';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { SliceInboxShowcase } from '../components/tools/SliceInboxShowcase';

export const SliceInboxPage: React.FC = () => {
    return (
        <ToolPageLayout productId="slice-inbox">
            <SliceInboxShowcase />
        </ToolPageLayout>
    );
};
