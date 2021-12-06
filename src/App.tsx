import { useState } from 'react';
import './App.css';

function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [resultA, setResultA] = useState({});
  const [resultB, setResultB] = useState({});
  const resultAExist: boolean = Object.keys(resultA).length !== 0;
  const resultBExist: boolean = Object.keys(resultB).length !== 0;

  const showFile = async (e: any) => {
    const file = e.target.files[0];

    if (file) {
      const data: any = await new Response(file).text();
      setLogs(data.split('\n'));
    }
  };

  const handleScores = (param: string) => {
    const elem =
      param === 'unique' ? logs : logs.map((row: string) => row.split(' ')[0]);

    const result = elem.reduce(
      (acc: { [key: string]: number }, val: string) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      },
      {}
    );

    const response = Object.fromEntries(
      Object.entries(result).sort(([, a]: any, [, b]: any) => b - a)
    );

    param === 'unique' ? setResultB(response) : setResultA(response);
  };

  const renderSummary = (objParam: { [key: string]: number }) => {
    return Object.entries(objParam).map((obj: (string | number)[]) => {
      return (
        <tr key={obj[0]}>
          <td className="siteAddress">{obj[0]}</td>
          <td>{obj[1]}</td>
        </tr>
      );
    });
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Smart Logs Analyzer</h1>
      </div>

      <input type="file" accept=".log" onChange={showFile} />

      <div className="content">
        <div>
          <h1>Logs</h1>
          {logs.length ? (
            <ul className="logContainer">
              {logs.map((log: string, index: number) => (
                <li className="logContainer__element" key={`${log}-${index}`}>
                  {log}
                </li>
              ))}
            </ul>
          ) : (
            <div className="emptyLog__message">
              <ul className="instructions">
                <li>
                  Upload your logs file to check the result by press button
                  above.
                </li>
                <li>
                  Then with the buttons on the right you can check what you
                  need.
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="summary">
          <h1>Summary</h1>

          <table className="tableSummaryData">
            <tbody>
              <tr>
                <td>
                  <button
                    className="btn"
                    onClick={() => handleScores('total')}
                    disabled={resultAExist}
                  >
                    See total page views
                  </button>
                </td>
                <td>
                  <button
                    className="btn"
                    onClick={() => handleScores('unique')}
                    disabled={resultBExist}
                  >
                    See total unique page views
                  </button>
                </td>
              </tr>
              <tr>
                <td className="dataInTable">
                  {resultAExist && (
                    <table className="tableSummary">
                      <thead>
                        <tr>
                          <th>Site</th>
                          <th>Entries</th>
                        </tr>
                      </thead>
                      <tbody>{renderSummary(resultA)}</tbody>
                    </table>
                  )}
                </td>
                <td className="dataInTable">
                  {resultBExist && (
                    <table className="tableSummary">
                      <thead>
                        <tr>
                          <th>Site | IP Address</th>
                          <th>Entries</th>
                        </tr>
                      </thead>
                      <tbody>{renderSummary(resultB)}</tbody>
                    </table>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
