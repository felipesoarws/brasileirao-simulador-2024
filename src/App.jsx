import { useState, useEffect } from "react";
import "./App.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";

import initialTeams from "./data/initialTeams.json";
import initialRounds from "./data/initialRounds.json";

const initialTeamStats = initialTeams.reduce((acc, team) => {
  acc[team] = {
    pontos: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    golsPro: 0,
    golsContra: 0,
    saldoGols: 0,
  };
  return acc;
}, {});

function App() {
  const [teams, setTeams] = useState(initialTeamStats);
  const [rounds, setRounds] = useState(initialRounds);

  useEffect(() => {
    atualizarClassificacao(initialRounds);
  }, []);

  const handleInputChange = (roundId, gameIndex, team, gols) => {
    const newRounds = rounds.map((round) => {
      if (round.id === roundId) {
        const newGames = round.games.map((game, index) => {
          if (index === gameIndex) {
            return { ...game, [team]: gols };
          }
          return game;
        });
        return { ...round, games: newGames };
      }
      return round;
    });

    setRounds(newRounds);
    atualizarClassificacao(newRounds);
  };

  const atualizarClassificacao = (rounds) => {
    const newTeamStats = initialTeams.reduce((acc, team) => {
      acc[team] = {
        pontos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        golsPro: 0,
        golsContra: 0,
        saldoGols: 0,
      };
      return acc;
    }, {});

    rounds.forEach((round) => {
      round.games.forEach(({ time1, gols1, time2, gols2 }) => {
        if (newTeamStats[time1] && newTeamStats[time2]) {
          newTeamStats[time1].golsPro += parseInt(gols1);
          newTeamStats[time1].golsContra += parseInt(gols2);
          newTeamStats[time2].golsPro += parseInt(gols2);
          newTeamStats[time2].golsContra += parseInt(gols1);

          if (gols1 > gols2) {
            newTeamStats[time1].vitorias++;
            newTeamStats[time1].pontos += 3;
            newTeamStats[time2].derrotas++;
          } else if (gols1 < gols2) {
            newTeamStats[time2].vitorias++;
            newTeamStats[time2].pontos += 3;
            newTeamStats[time1].derrotas++;
          } else {
            newTeamStats[time1].empates++;
            newTeamStats[time2].empates++;
            newTeamStats[time1].pontos++;
            newTeamStats[time2].pontos++;
          }

          newTeamStats[time1].saldoGols =
            newTeamStats[time1].golsPro - newTeamStats[time1].golsContra;
          newTeamStats[time2].saldoGols =
            newTeamStats[time2].golsPro - newTeamStats[time2].golsContra;
        }
      });
    });

    setTeams(newTeamStats);
  };

  const sortedTeams = Object.entries(teams).sort(([, a], [, b]) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
    return b.saldoGols - a.saldoGols;
  });

  const checkColor = (value) => {
    if (value == 1 || value == 2 || value == 3 || value == 4) {
      return "#0000ff";
    }
    if (value == 5 || value == 6) {
      return "#00ffff";
    }
    if (
      value == 7 ||
      value == 8 ||
      value == 9 ||
      value == 10 ||
      value == 11 ||
      value == 12
    ) {
      return "#008000";
    }
    if (value == 13 || value == 14 || value == 15 || value == 16) {
      return "#999999";
    }
    if (value == 17 || value == 18 || value == 19 || value == 20) {
      return "#ff0000";
    }
  };

  const checkMatchStatus = (status) => {
    switch (status) {
      case "finalizada":
        return true;
      case "aberta":
        return false;
    }
  };

  // carousel
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "rgba(0,0,0,0.5)",
          borderRadius: ".7rem",
          position: "absolute",
          top: "1rem",
          right: "1rem",
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "rgba(0,0,0,0.5)",
          borderRadius: ".7rem",
          position: "absolute",
          top: "1rem",
          left: "1rem",
        }}
        onClick={onClick}
      />
    );
  }
  const settings = {
    className: "variable-width",
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    variableWidth: true,
  };

  return (
    <div className="container">
      <header>
        <h2>Brasileirão Série A</h2>
        <p>
          Feito por{" "}
          <a href="#" target="_blank">
            felipesoarws :)
          </a>
        </p>
      </header>
      <main>
        <div className="main-content">
          <h1>Simulador do Brasileirão 2024</h1>
          <p>
            Simule os resultados dos jogos do Brasileirão 2024, e tente
            adivinhar o campeão, quais times vão à Libertadores e à Copa
            Sul-Americana e quem será rebaixado para a Série B
          </p>
        </div>
        <div className="main-games">
          <div className="main-table">
            <table>
              <thead>
                <tr>
                  <th colSpan={2} className="border-right">
                    Classificação
                  </th>
                  <th>P</th>
                  <th>V</th>
                  <th>E</th>
                  <th>D</th>
                  <th>SG</th>
                  <th>GP</th>
                  <th>GC</th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map(([team, stats], index) => (
                  <tr key={team}>
                    <td style={{ color: `${checkColor(index + 1)}` }}>
                      {index + 1}
                    </td>
                    <td className="center-left">{team}</td>
                    <td className="bold">{stats.pontos}</td>
                    <td className="gray-background">{stats.vitorias}</td>
                    <td>{stats.empates}</td>
                    <td className="gray-background">{stats.derrotas}</td>
                    <td>{stats.saldoGols}</td>
                    <td className="gray-background">{stats.golsPro}</td>
                    <td>{stats.golsContra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="main-rounds">
            <Slider {...settings}>
              {rounds.map((round) => (
                <div key={round.id}>
                  <div className="main-rounds-title">
                    <h2>{round.id}ª Rodada</h2>
                  </div>
                  {round.games.map((game, index) => (
                    <div key={index} className="round">
                      <input
                        type="text"
                        value={game.time1}
                        readOnly
                        className="team-left"
                      />
                      <img src={game.logoTime1} alt="time" />
                      <input
                        type="number"
                        value={game.gols1}
                        onChange={(e) =>
                          handleInputChange(
                            round.id,
                            index,
                            "gols1",
                            e.target.value
                          )
                        }
                        disabled={checkMatchStatus(game.status)}
                        className="score"
                        placeholder="Gols Time 1"
                      />
                      x
                      <input
                        type="number"
                        value={game.gols2}
                        onChange={(e) =>
                          handleInputChange(
                            round.id,
                            index,
                            "gols2",
                            e.target.value
                          )
                        }
                        disabled={checkMatchStatus(game.status)}
                        className="score"
                        placeholder="Gols Time 2"
                      />
                      <img src={game.logoTime2} alt="time" />
                      <input
                        type="text"
                        value={game.time2}
                        readOnly
                        className="team-right"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
