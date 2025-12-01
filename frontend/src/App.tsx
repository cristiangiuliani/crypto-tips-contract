import ConnectButton from './ConnectButton';
import SendTipForm from './SendTipForm';
import TipsCounter from './TipsCounter';
import TipsList from './TipsList';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header>
        <h1>💎 TipJar</h1>
        <ConnectButton />
      </header>

      <main>
        <section className="dashboard">
          <TipsCounter />
        </section>

        <section className="send-tip-section">
          <SendTipForm />
        </section>

        <section className="tips-history">
          <TipsList />
        </section>
      </main>
    </div>
  );
};

export default App;
