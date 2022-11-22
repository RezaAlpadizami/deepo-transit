/* eslint-disable no-plusplus */
import React from 'react';

function MyDocument(props) {
  const { data, header } = props;

  return (
    <div id="mytable">
      <table>
        <tbody>
          <tr>
            {header.map(val => {
              return <th>{val.header}</th>;
            })}
          </tr>
          {data.map(d => {
            return (
              <tr>
                {header.map(i => {
                  return <th>{d[i.value]}</th>;
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
