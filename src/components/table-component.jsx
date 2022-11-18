/* eslint-disable no-plusplus */
import React from 'react';
import Moment from 'moment';

const styles = {
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Roboto',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 3,
    fontFamily: 'Roboto',
    fontWeight: 700,
    paddingTop: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: '4px',
  },
  footer: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 30,
    right: 30,
    paddingTop: 15,
    borderTop: 1,
  },
  divTableRow: {
    flexDirection: 'row',
    border: '1px solid #000',
    marginBottom: '-1px',
  },
  divTableCol: {
    borderRight: '1px solid #000',
    padding: '3px 4px',
    height: '100%',
    overflowWrap: 'break-word',
    textAlign: 'center',
  },
  divTable: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 400,
  },
  labelText: {
    fontFamily: 'Roboto',
    color: '#000',
    fontWeight: 500,
  },
  subHeader: {
    fontSize: '11px',
  },
  text: {
    fontSize: 10,
    paddingBottom: 5,
  },
};

function MyDocument(props) {
  const { data, header } = props;
  return (
    <div id="mytable">
      <table>
        <tbody style={styles.divTable}>
          <tr style={{ ...styles.divTableRow, backgroundColor: '#CCCCFF' }}>
            {header.map(val => {
              return <th style={{ ...styles.divTableCol, ...styles.labelText }}>{val.header}</th>;
            })}
          </tr>
          {data?.forEach((d, i) => {
            return (
              <tr style={styles.divTableRow}>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{i + 1}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>asd</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.name}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.location}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.address}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.capacity}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>
                  {Moment(d.last_stock_opname).format('DD MM YYYY')}
                </th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.phone}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default MyDocument;
