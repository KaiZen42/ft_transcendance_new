import Canvas from "../components/Game";
import "../styles/PongGame.css"

export default function PongTest() {
	return (
		<div >
			<div className="d-flex flex-column align-items-center justify-content-center">
				<Canvas/>
			</div>
		</div>
	)
}