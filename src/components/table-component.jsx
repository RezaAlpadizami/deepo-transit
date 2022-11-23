/* eslint-disable no-plusplus */
import React from 'react';

function MyDocument(props) {
  const { columns, data } = props;

  return (
    <div id="mytable">
      <table>
        <tbody>
          <tr>
            {columns.map(val => {
              return <th>{val.Header}</th>;
            })}
          </tr>
          {data.map(d => {
            return (
              <tr>
                {columns.map(i => {
                  return <th>{d[i.id]}</th>;
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
