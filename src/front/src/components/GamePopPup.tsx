
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/GamePopUp.css"

interface User {
	username: string,
	points: number,
	avatar: string,
	score: number
}

interface Props {
	winner: number | undefined,
	users: [User?, User?],
	playAgain: () => void
}

export default function GamePopUp({winner, users, playAgain}: Props) {

	const [win, setWin] = useState<boolean>()

	let navigate = useNavigate()

	useEffect(() => {
		if (!users[0] || !users[1])
			return
		if (users[0].score > users[1].score)
			setWin(true)
		else if (users[1].score > users[0].score)
			setWin(false)
	}, [users])

	return (
		<div
		style={{
			visibility: (typeof winner !== "undefined") ? "visible" : "hidden",
			opacity: (typeof winner !== "undefined") ? "1" : "0"
		}}
		className="overlay"
		>
		{
			(typeof winner !== "undefined") &&
			<div className={`game-popup ${win ? "popup-win" : "popup-lost"}`}>
				<div className="flex-col">
					<div className="flex-col">
						<h2 className={`game-popup-title ${win ? "title-win" : "title-lost"}`}>{win ? "YOU WON!" : "YOU LOST"}</h2>
						<p className="game-popup-text fnt-30 nice-shadow">Final Result</p>
					</div>
					<div className="flex-row flex-center" style={{width: "100%"}}>
						<div className="flex-col flex-center">
							<img alt="profile image" src={users[0]?.avatar} className="game-popup-image"/>
							<p className="game-popup-text nice-shadow">{users[0]?.username}</p>
						</div>
						<div className="flex-row sp-even" style={{width: "100px"}}>
							<p className="game-popup-text fnt-30 nice-shadow">{users[0]?.score}</p>
							<p className="game-popup-text fnt-30 nice-shadow">-</p>
							<p className="game-popup-text fnt-30 nice-shadow">{users[1]?.score}</p>
						</div>
						<div className="flex-col flex-center">
							<img alt="profile image" src={users[1]?.avatar} className="game-popup-image"/>
							<p className="game-popup-text nice-shadow">{users[1]?.username}</p>
						</div>
					</div>
					<div className="flex-col sp-around" style={{height: "100px"}}>
						<button className="game-popup-btn btn-play" onClick={() => playAgain()}>PLAY AGAIN</button>
						<button className="game-popup-btn btn-home" onClick={() => navigate("/")}>BACK TO HOME</button>
					</div>
				</div>
			</div>
		}
		</div>
	)
}