import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Panel, PanelHeader, PanelHeaderBack, List, Cell, Group, FormItem, Input, Button} from '@vkontakte/vkui';

import './Locations.css';

const Locations = props => {
    const [value, setValue] = useState('');
    const {onLocationCreated, locations} = props;

    const create = () => {
        onLocationCreated(value);
        setValue('');
    }

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={props.go} data-to="home"/>}
            >
                Список локаций
            </PanelHeader>
            <FormItem top='Создать локацию'>
                <Input type="text" onChange={e => setValue(e.target.value)} value={value} />
            </FormItem>
            <FormItem>
                <Button onClick={create}>
                    Создать
                </Button>
            </FormItem>
            <Group description={`${locations.length} locations`}>
                <List>
                    {locations.map((location, index) => (
                        <Cell key={index + 1e6}>{location}</Cell>
                    ))}
                </List>
            </Group>
        </Panel>
    );
};

Locations.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};

export default Locations;
