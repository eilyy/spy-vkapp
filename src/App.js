import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Locations from './panels/Locations';
import Game from "./panels/Game";

const App = () => {
    const [scheme, setScheme] = useState('bright_light')
    const [activePanel, setActivePanel] = useState('home');
    const [fetchedUser, setUser] = useState(null);
    const [popout, setPopout] = useState(<ScreenSpinner size='large'/>);

    const [players, setPlayers] = useState([]);
    const [gameStage, setGameStage] = useState(0);
    const [count, setCount] = useState(8);
    const [locationId, setLocationId] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [flashAvailable, setFlashAvailable] = useState(false);
    const [locations, setLocations] = useState(['Стройплощадка', 'Стадион', 'Экскурсионный автобус',
        'Свадьба', 'Метро', 'Музей', 'Рок-концерт', 'Заправочная станция', 'Парламент', 'Дом престарелых',
        'Шахта', 'Библиотека', 'Шоколадная фабрика', 'Джаз-бэнд', 'Порт', 'Тюрьма', 'Кладбище', 'Виноградник',
        'Автогонки', 'Выставка кошек']);

    useEffect(() => {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                setScheme(data.scheme)
            }
        });

        async function fetchData() {
            const user = await bridge.send('VKWebAppGetUserInfo');
            const flashInfo = await bridge.send("VKWebAppFlashGetInfo");
            setFlashAvailable(flashInfo.is_available);
            setUser(user);
            setPopout(null);
        }

        fetchData();
    }, []);

    const go = e => {
        setActivePanel(e.currentTarget.dataset.to);
    };

    const startNewGame = () => {
        setCurrentPlayer(1);
        setPlayers([]);
        setGameStage(0);
        setTimeLeft(0);
    }

    const startTimer = () => {
        setTimeLeft(count * 60);
        let flashIsOn = false;
        let flashTimer;
        const timerId = setInterval(() => {
            setTimeLeft(prevState => {
                if (prevState === 5) {
                    console.log(2);
                    flashTimer = setInterval(() => {
                        bridge.send("VKWebAppFlashSetLevel", {"level": +flashIsOn});
                        flashIsOn = !flashIsOn;
                    }, 100);
                }
                if (prevState <= 1) {
                    clearInterval(timerId);
                    clearInterval(flashTimer);
                    flashIsOn = false;
                    bridge.send("VKWebAppFlashSetLevel", {"level": 0});
                    return 0;
                }
                return prevState - 1;
            });
        }, 1000);
    }

    return (<ConfigProvider scheme={scheme}>
        <AdaptivityProvider>
            <AppRoot>
                <SplitLayout popout={popout}>
                    <SplitCol>
                        <View activePanel={activePanel}>
                            <Home id='home' fetchedUser={fetchedUser} go={go}/>
                            <Locations
                                onLocationCreated={(location) => {
                                    setLocations(prevState => {
                                        return [location, ...prevState];
                                    });
                                }}
                                locations={locations}
                                id='locations'
                                go={go}
                            />
                            <Game
                                id='game'
                                gameStage={gameStage}
                                setGameStage={setGameStage}
                                players={players}
                                setPlayers={setPlayers}
                                count={count}
                                setCount={setCount}
                                locationId={locationId}
                                setLocationId={setLocationId}
                                currentPlayer={currentPlayer}
                                setCurrentPlayer={setCurrentPlayer}
                                startTimer={startTimer}
                                timeLeft={timeLeft}
                                locations={locations}
                                startNewGame={startNewGame}
                                go={go}
                            />
                        </View>
                    </SplitCol>
                </SplitLayout>
            </AppRoot>
        </AdaptivityProvider>
    </ConfigProvider>);
}

export default App;
