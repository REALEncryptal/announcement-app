import { Title, Image, Box } from '@mantine/core';

import logo from '@/assets/MusedIcon.png';

interface LogoProps {
    size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    image?: boolean;
    alt?: string;
}

export function Logo({ size = 24, image = false, alt = 'Mused Logo' }: LogoProps) {
    if (image) {
        return (
            <Box maw={typeof size === 'string' ? 120 : size}>
                <Image src={logo} alt={alt} />
            </Box>
        );
    }
    
    return (
        <Title order={2} fw={800} size={size} component="span">MUSED</Title>
    );
}