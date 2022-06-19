import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Div,
    FormItem,
    FormLayout,
    Group,
    Header,
    Input,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Cell, List
} from '@vkontakte/vkui';

import './Game.css';
import locations from "./Locations";

const Game = props => {
    const [disabled, setDisabled] = useState(false);
    const [cardShown, setCardShown] = useState(false);
    const [playersListShown, setPlayersListShown] = useState(false);
    const {
        players,
        setPlayers,
        gameStage,
        setGameStage,
        count,
        setCount,
        locationId,
        setLocationId,
        currentPlayer,
        setCurrentPlayer,
        startTimer,
        locations,
        startNewGame,
        timeLeft
    } = props;

    const inputHandler = (value) => {
        setCount(!!value ? +value : value);
        if (value && value > 2 && value <= 12) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }

    const nameInputHandler = (value, index) => {
        setPlayers(prevState => {
            const newState = [...prevState];
            newState[index]['name'] = value;
            return newState;
        })
    }

    const handleSubmit = () => {
        setGameStage(1);
        const playersArr = Array.apply(null, Array(count)).map(function () {
        }).map((item, i) => ({key: i + 1, name: `Игрок ${i + 1}`, isSpy: false}));
        const spies = generateSpies();
        spies.forEach(i => playersArr[i]['isSpy'] = true);
        setPlayers(playersArr);
        setLocationId(Math.floor(Math.random() * locations.length));
    }

    const handleNextPlayer = () => {
        setCardShown(false);
        if (currentPlayer <= count) {
            setCurrentPlayer(prevState => prevState + 1);
        }
    }

    const onGameStart = () => {
        setGameStage(2);
        startTimer();
    }

    const generateSpies = () => {
        const spies = [];
        if (count > 8) {
            while (spies.length < 2) {
                const spyId = Math.floor(Math.random() * count);
                if (!spies.includes(spyId)) {
                    spies.push(spyId);
                }
            }
        } else {
            spies.push(Math.floor(Math.random() * count));
        }
        return spies;
    }

    const generateTimeString = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    return (
        <Panel id={props.id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={props.go} data-to="home"/>}
            >
                Игра
            </PanelHeader>
            <Group hidden={gameStage !== 0}>
                <FormLayout onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                    <FormItem top="Кол-во игроков">
                        <Input type="number" min={0} step={1} max={12} value={count.toString()} onChange={e => inputHandler(e.target.value)}/>
                    </FormItem>
                    <FormItem>
                        <Input type="submit" value="Играть!" disabled={disabled}/>
                    </FormItem>
                </FormLayout>
            </Group>
            <Div hidden={gameStage !== 1}>
                {players.map((player, index) => (
                    <Group header={<Header mode="secondary">Раздача карт</Header>}
                           hidden={currentPlayer !== player['key']} key={player['key']}>
                        <Div hidden={cardShown}>
                            <FormItem top="Как вас зовут?">
                                <Input type="text" defaultValue={player['name']}
                                       onChange={e => nameInputHandler(e.target.value, index)}/>
                            </FormItem>
                            <FormItem>
                                <Button className="button" stretched size="l" mode="secondary"
                                        onClick={() => setCardShown(true)}>
                                    Показать карточку
                                </Button>
                            </FormItem>
                        </Div>
                        <Div hidden={!cardShown}>
                            <Cell>{player['isSpy'] ? 'Вы шпион!' : `Локация: ${locations[locationId]}`}</Cell>
                            <FormItem>
                                <Button className="button" stretched size="l" mode="secondary"
                                        onClick={player['key'] === count ? onGameStart : handleNextPlayer}>
                                    {player['key'] === count ? 'Начать игру' : 'Следующий игрок'}
                                </Button>
                            </FormItem>
                        </Div>
                    </Group>
                ))}
            </Div>
            <Div hidden={gameStage !== 2}>
                <Div>Таймер: {timeLeft < 1 ? 'Время вышло!' : generateTimeString(timeLeft)}</Div>
                <List hidden={!playersListShown}>
                    {players.map((player) => (
                        <Cell key={player.key + 1000}>
                            {player.name} {player.isSpy ? '– Шпион' : ''}
                        </Cell>
                    ))}
                </List>
                <FormItem>
                    <Button hidden={playersListShown} className="button" stretched size="l" mode="secondary" onClick={() => setPlayersListShown(true)}>
                        Список игроков
                    </Button>
                </FormItem>
                <FormItem>
                    <Button size='l' stretched mode="secondary" onClick={() => {
                        setPlayersListShown(false);
                        startNewGame();
                    }}>
                        Новая игра
                    </Button>
                </FormItem>
            </Div>
        </Panel>
    )
};

Game.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
};

export default Game;
