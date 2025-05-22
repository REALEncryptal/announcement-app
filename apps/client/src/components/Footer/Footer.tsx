import { Anchor, Container, Group } from '@mantine/core';
import classes from './Footer.module.css';
import { Logo } from '@/components/Logo/Logo';

const links = [
    { link: 'https://github.com/REALEncryptal', label: 'Encryptal' },
    { link: 'https://github.com/REALEncryptal/mused', label: 'Github Source' },
];

export function Footer() {
    const items = links.map((link) => (
        <Anchor<'a'>
            c="dimmed"
            key={link.label}
            href={link.link}
            onClick={(event) => event.preventDefault()}
            size="sm"
            underline="never"
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div className={classes.footer}>
            <Container size="lg" className={classes.inner}>
                <Logo size={28} image />
                <Group className={classes.links}>{items}</Group>
            </Container>
        </div>
    );
}