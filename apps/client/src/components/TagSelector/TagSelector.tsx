import { useState } from 'react';
import { PillsInput, Pill, Combobox, CheckIcon, Group, useCombobox, ScrollArea } from '@mantine/core';

const tagOptions = [
    'dev',
    'tech',
    'finance',
    'health',
    'gaming',
    'crypto',
    'music',
    'travel',
    'food',
    'fitness',
    'sports',
    'entertainment',
    'beauty',
    'lifestyle',
    'education',
    'business',
    'politics',
    'science',
    'technology',
    'environment'
]

export function TagSelector({ value, setValue }: { value: string[], setValue: (tags: string[]) => void }) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [search, setSearch] = useState('');

    const handleValueSelect = (val: string) => {
        const newValue = value.includes(val)
            ? value.filter((v) => v !== val)
            : [...value, val];
        setValue(newValue);
    };

    const handleValueRemove = (val: string) => {
        const newValue = value.filter((v) => v !== val);
        setValue(newValue);
    };

    const values = value.map((item: string) => (
        <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item}
        </Pill>
    ));

    const options = tagOptions
        .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
        .map((item) => (
            <Combobox.Option value={item} key={item} active={value.includes(item)}>
                <Group gap="sm">
                    {value.includes(item) ? <CheckIcon size={12} /> : null}
                    <span>{item}</span>
                </Group>
            </Combobox.Option>
        ));

    return (
        <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
            <Combobox.DropdownTarget>
                <PillsInput onClick={() => combobox.openDropdown()} w="100%">
                    <Pill.Group>
                        {values}

                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                onFocus={() => combobox.openDropdown()}
                                onBlur={() => combobox.closeDropdown()}
                                value={search}
                                placeholder="Search tags"
                                onChange={(event) => {
                                    combobox.updateSelectedOptionIndex();
                                    setSearch(event.currentTarget.value);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && search.length === 0 && value.length > 0) {
                                        event.preventDefault();
                                        handleValueRemove(value[value.length - 1]);
                                    }
                                }}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>

            <Combobox.Dropdown>
                <Combobox.Options>
                    <ScrollArea.Autosize type="scroll" mah={200}>
                        {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
                    </ScrollArea.Autosize>

                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )

}