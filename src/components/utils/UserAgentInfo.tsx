import { UAParser } from 'ua-parser-js';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'react-i18next';

export const UserAgentInfo = () => {
  const { t } = useTranslation('common');
  const userAgent = UAParser(window.navigator.userAgent);

  console.log(userAgent);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t('system.system_info')}</TableCell>
            <TableCell align="right">{t('name')}</TableCell>
            <TableCell align="right">{t('version')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
              {t('system.os')}
            </TableCell>
            <TableCell align="right">{userAgent.os.name}</TableCell>
            <TableCell align="right">{userAgent.os.version}</TableCell>
          </TableRow>
          <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
              {t('system.browser')}
            </TableCell>
            <TableCell align="right">{userAgent.browser.name}</TableCell>
            <TableCell align="right">
              {userAgent.browser.major || userAgent.browser.version}
            </TableCell>
          </TableRow>
          <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
              {t('system.engine')}
            </TableCell>
            <TableCell align="right">{userAgent.engine.name}</TableCell>
            <TableCell align="right">{userAgent.engine.version}</TableCell>
          </TableRow>
          <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
              {t('system.device')}
            </TableCell>
            <TableCell align="right">
              {userAgent.device.vendor} {userAgent.device.model} (arc: {userAgent.cpu.architecture})
            </TableCell>
            <TableCell align="right">-</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};