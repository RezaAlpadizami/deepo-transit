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
  //   console.log('MAAAAOP', Object.keys(data.map(i => i)));
  //   let key = '';
  //   header.forEach(i => {
  //     key = i.value;
  //   });
  //   console.log('KEEEEEYS', key);
  //   const counter = 0;
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
            // console.log('dddddd', d);
            // // console.log('[]', d[i]);
            // // console.log('findindex', d.indexOf);
            // const key = Object.keys(d);

            // key.forEach(i => {
            //   console.log('ii', i);
            //   ++counter;
            //   if(counter === header.length)
            //   console.log('counter', counter);
            // });
            return (
              <tr style={styles.divTableRow}>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{i + 1}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.warehouse_code}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.warehouse_name}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.warehouse_location}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.warehouse_address}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.avg_destination_price}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.warehouse_capacity}</th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>
                  {Moment(d.last_stock_date).format('DD MM YYYY')}
                </th>
                <th style={{ ...styles.divTableCol, ...styles.labelText }}>{d.warehouse_phone}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default MyDocument;
