import Table, { type TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export type JSONTableProps = {
  data: string | object | Record<string, unknown>;
  tableProps?: TableProps;
};

export const JSONTable = ({ 
  data, 
  tableProps = {},
} : JSONTableProps) => {
  const { t } = useTranslation('components');
  const rows = useMemo(() => {
    const obj = typeof data === 'string' ? JSON.parse(data) : data;
    const keys = Object.keys(obj);

    return keys.map((key, i) => ({
      key,
      id: `${key}-${i}`,
      value: obj[key],
    }));
  }, [data]);

  return (
    <TableContainer component={Paper}>
      <Table {...tableProps}>
        <TableHead>
          <TableRow>
            <TableCell>{t('json_table.key')}</TableCell>
            <TableCell align="right">{t('json_table.value')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.key}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};