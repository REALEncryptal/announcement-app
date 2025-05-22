import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

export function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel?: () => void }) {
    const openModal = () => modals.openConfirmModal({
        title,
        children: <Text>{message}</Text>,
        labels: { confirm: 'Yes', cancel: 'No' },
        onCancel,
        onConfirm,
    });

    return openModal;
}
    