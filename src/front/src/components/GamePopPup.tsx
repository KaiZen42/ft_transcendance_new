import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserWL } from '../models/Game.interfaces';
import '../styles/GamePopUp.css';

interface User {
  username: string;
  points: number;
  avatar: string;
  score: number;
}

interface Props {
  winner: number | undefined;
  users: [UserWL?, User?];
  playAgain: () => void;
  updatePoints: (points: number, wins: number, losses: number) => void;
  watch: boolean;
  friendly: boolean;
}

export default function GamePopUp({
  winner,
  users,
  playAgain,
  updatePoints,
  watch,
  friendly,
}: Props) {
  const [win, setWin] = useState<boolean>();
  const [updatedPoints, SetUpdatedPoints] = useState<number>(0);
  const [diffPoints, SetDiffPoints] = useState<number>(0);
  const [wl, setWL] = useState<[number, number]>([0, 0]);

  let navigate = useNavigate();

  useEffect(() => {
    if (watch) return;
    if (typeof winner === 'undefined') return;
    if (!users[0] || !users[1]) return;
    if (users[0].score > users[1].score) {
      setWin(true);
      if (!friendly) calcPoints(true);
    } else {
      setWin(false);
      if (!friendly) calcPoints(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const calcPoints = (iWin: boolean) => {
    let points: number, diff, winl: [number, number];
    if (iWin) {
      diff = users[1]!.points < users[0]!.points ? 15 : 30;
      points = users[0]!.points + diff;
      winl = [users[0]!.wins + 1, users[0]!.losses];
    } else {
      diff = users[1]!.points < users[0]!.points ? 30 : 15;
      points = users[0]!.points - diff < 0 ? 0 : users[0]!.points - diff;
      diff = -(users[0]!.points - diff < 0 ? users[0]!.points : diff);
      winl = [users[0]!.wins, users[0]!.losses + 1];
    }
    SetUpdatedPoints(points);
    SetDiffPoints(diff);
    setWL(winl);
    updatePoints(points, winl[0], winl[1]);
  };

  return (
    <div
      style={{
        visibility: typeof winner !== 'undefined' ? 'visible' : 'hidden',
        opacity: typeof winner !== 'undefined' ? '1' : '0',
      }}
      className="overlay"
    >
      {typeof winner !== 'undefined' && (
        <>
          {watch ? (
            <div className="game-popup">
              <div className="flex-col sp-even" style={{ height: '100%' }}>
                <div className="flex-col">
                  <p className="game-popup-text fnt-30 nice-shadow">
                    Final Result
                  </p>
                </div>
                <div className="flex-row flex-center" style={{ width: '100%' }}>
                  <div className="flex-col flex-center">
                    <img
                      alt="profile"
                      src={users[0]?.avatar}
                      className="game-popup-image no-hover"
                    />
                    <p className="game-popup-text nice-shadow">
                      {users[0]?.username}
                    </p>
                  </div>
                  <div className="flex-row sp-even" style={{ width: '100px' }}>
                    <p className="game-popup-text fnt-30 nice-shadow">
                      {users[0]?.score}
                    </p>
                    <p className="game-popup-text fnt-30 nice-shadow">-</p>
                    <p className="game-popup-text fnt-30 nice-shadow">
                      {users[1]?.score}
                    </p>
                  </div>
                  <div className="flex-col flex-center">
                    <img
                      alt="profile"
                      src={users[1]?.avatar}
                      className="game-popup-image"
                      onClick={() => navigate('/users/' + users[1]?.username)}
                    />
                    <p className="game-popup-text nice-shadow">
                      {users[1]?.username}
                    </p>
                  </div>
                </div>
                <div className="flex-col sp-even" style={{ height: '100px' }}>
                  <button
                    className="game-popup-btn btn-home"
                    onClick={() => navigate('/')}
                  >
                    BACK TO HOME
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`game-popup ${win ? 'popup-win' : 'popup-lost'}`}>
              <div className="flex-col sp-even" style={{ height: '100%' }}>
                <div className="flex-col">
                  <h2
                    className={`game-popup-title ${
                      win ? 'title-win' : 'title-lost'
                    }`}
                  >
                    {win ? (
                      <>
                        YOU WON!
                        <audio autoPlay>
                          <source src="../you_win.mp3" type="audio/mp3" />
                        </audio>
                      </>
                    ) : (
                      <>
                        YOU LOSE!
                        <audio autoPlay>
                          <source src="../game_over.mp3" type="audio/mp3" />
                        </audio>
                      </>
                    )}
                  </h2>
                  <p className="game-popup-text fnt-30 nice-shadow">
                    Final Result
                  </p>
                </div>
                <div className="flex-row flex-center" style={{ width: '100%' }}>
                  <div className="flex-col flex-center">
                    <img
                      alt="profile"
                      src={users[0]?.avatar}
                      className="game-popup-image no-hover"
                    />
                    <p className="game-popup-text nice-shadow">
                      {users[0]?.username}
                    </p>
                  </div>
                  <div className="flex-row sp-even" style={{ width: '100px' }}>
                    <p className="game-popup-text fnt-30 nice-shadow">
                      {users[0]?.score}
                    </p>
                    <p className="game-popup-text fnt-30 nice-shadow">-</p>
                    <p className="game-popup-text fnt-30 nice-shadow">
                      {users[1]?.score}
                    </p>
                  </div>
                  <div className="flex-col flex-center">
                    <img
                      alt="profile"
                      src={users[1]?.avatar}
                      className="game-popup-image"
                      onClick={() => navigate('/users/' + users[1]?.username)}
                    />
                    <p className="game-popup-text nice-shadow">
                      {users[1]?.username}
                    </p>
                  </div>
                </div>
                {!friendly && (
                  <div
                    className="flex-col sp-around"
                    style={{ height: '100px', width: '100%' }}
                  >
                    <p
                      className="game-popup-text fnt-30 nice-shadow"
                      style={{ marginBottom: '0px' }}
                    >
                      Your Stats
                    </p>
                    <div className="flex-row sp-even" style={{ width: '100%' }}>
                      <div className="game-popup-text nice-shadow">points</div>
                      <div
                        className="flex-row sp-around"
                        style={{ width: '20%', maxWidth: '60px' }}
                      >
                        <div className="game-popup-text nice-border">
                          {updatedPoints}{' '}
                        </div>
                        {diffPoints > 0 ? (
                          <div className="game-popup-text border-pos">
                            <small>(+{diffPoints})</small>
                          </div>
                        ) : (
                          <div className="game-popup-text border-neg">
                            <small>{`${
                              diffPoints ? '(' + diffPoints + ')' : ''
                            }`}</small>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-row sp-even" style={{ width: '100%' }}>
                      <div className="game-popup-text nice-shadow">
                        wins-losses
                      </div>
                      <div
                        className={`game-popup-text ${
                          wl[0] > wl[1]
                            ? 'border-pos'
                            : wl[1] > wl[0]
                            ? 'border-neg'
                            : 'nice-border'
                        }`}
                        style={{ width: '20%', maxWidth: '60px' }}
                      >
                        {wl![0]} - {wl![1]}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex-col sp-even" style={{ height: '100px' }}>
                  {!friendly && (
                    <button
                      className="game-popup-btn btn-play"
                      onClick={playAgain}
                    >
                      PLAY AGAIN
                    </button>
                  )}
                  <button
                    className="game-popup-btn btn-home"
                    onClick={() => navigate('/')}
                  >
                    BACK TO HOME
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
