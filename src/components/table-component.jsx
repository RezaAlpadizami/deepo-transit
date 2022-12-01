import React from 'react';

function MyDocument(props) {
  const { columns, data } = props;

  return (
    <div id="mytable">
      <table>
        <tbody>
          <tr>
            {columns.map((val, i) => {
              return <th key={i}>{val.Header}</th>;
            })}
          </tr>
          {data.map((d, idx) => {
            return (
              <tr key={idx}>
                {columns.map((c, i) => {
                  return <th key={i}>{d[c.id]}</th>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default MyDocument;
