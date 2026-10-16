import React from 'react';
import { ToolPageLayout } from '../components/ToolPageLayout';
import { Slice3DShowcase } from '../components/tools/Slice3DShowcase';

export const Slice3DPage: React.FC = () => {
    return (
        <ToolPageLayout productId="slice-3d">
            <Slice3DShowcase />
        </ToolPageLayout>
    );
};
