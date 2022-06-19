import React from 'react';
import PropTypes from 'prop-types';

import {Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar} from '@vkontakte/vkui';

import './Home.css';

const Home = ({id, go, fetchedUser}) => (
    <Panel id={id}>
        <PanelHeader>Шпион</PanelHeader>
        {fetchedUser &&
            <Group header={<Header mode="secondary">Хеллоу ворлд!</Header>}>
                <Cell
                    before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
                    description={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
                >
                    {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
                </Cell>
            </Group>}

        <Group header={<Header mode="secondary">Меню</Header>}>
            <Div>
                <Button className="button" stretched size="l" mode="primary" onClick={go} data-to="game">
                    Играть!
                </Button>
                <Button className="button" stretched size="l" mode="secondary" onClick={go} data-to="locations">
                    Список локаций
                </Button>
            </Div>
        </Group>
    </Panel>
);

Home.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};

export default Home;
