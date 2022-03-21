import Wrapper from '../components/Wrapper';
import '../styles/neon_button.css';
import { NavLink } from 'react-router-dom';

export default function Dashboard() {
  return (
    <Wrapper>
      <section className="container vh-100">
        <div className="center">
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <h1 className="white-text">Multiplayer Pong</h1>
            <NavLink to={'/game'}>
              <div className="neon-button">classic</div>
            </NavLink>
            <NavLink to={'/game/inverted'}>
              <div className="neon-button" style={{ marginTop: '1rem' }}>
                inverted
              </div>
            </NavLink>
          </div>
        </div>
      </section>
    </Wrapper>
  );
}
