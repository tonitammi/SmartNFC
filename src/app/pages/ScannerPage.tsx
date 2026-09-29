import Button from '@mui/material/Button';
import { useNFC } from '../../features/nfc/hooks/useNFC';
import Typography from '@mui/material/Typography';
import { useOrganizationContext } from '@/src/features/organization/context/useOrganizationContext';

export const ScannerPage = () => {
  const { currentOrganization } = useOrganizationContext('true');
  const { 
    result, 
    isScanning, 
    isSupported, 
    write,
    startScanning,
    stopScanning,
    isWriting, 
    tagInfo,
  } = useNFC(currentOrganization.id);

  const handleClick = () => {
    return isScanning ? stopScanning() : startScanning();
  };

  const writeData = async () => {
    if (isWriting) return;
    
    await write('https://google.com');
    return alert('Write ready');
  };

  return (
    <div style={{ paddingTop: '5rem' }}>
      <Typography variant="h3" style={{ marginBottom: '2rem' }}>
        NFC-Skanneri
      </Typography>

      <Typography style={{ marginBottom: '1rem' }} variant="body1">
        {isSupported ? 'Tuettu' : 'Ei tueta tässä laitteessa'}  
      </Typography>

      { isScanning && (
        <div style={{ marginBottom: '1rem' }} >
          <Typography variant="body1">Skannataan NFC-tageja</Typography>
        </div>
      ) }

      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <Typography variant="body1">Tulos: {result}</Typography>
      </div>

      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <Typography variant="body1">Tag info:</Typography>
        <div>
          {tagInfo && (
            <ul>
              <li>Result: {result}</li>
              <li>ID: {tagInfo.id}</li>
              <li>Record count: {tagInfo.recordCount}</li>
              {tagInfo.records.map((record, i) => (
                <ul>
                  <li>Record {i + 1}</li>
                  <ul>
                    {/* <li>Data {record.data}</li> */}
                    <li>Encoding: {record.encoding}</li>
                    <li>Lang: {record.lang}</li>
                    <li>Media type: {record.mediaType}</li>
                    <li>Type: {record.type}</li>
                  </ul>
                </ul>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Button onClick={handleClick} variant="contained">
        { isScanning ? 'Lopeta skannaus' : 'Aloita skannaus' }
      </Button>

      <div style={{ marginTop: '2rem' }}>
        <Button variant="contained" onClick={writeData} disabled={isWriting}>
          { isWriting ? 'Kirjoitetaan' : 'Kirjoita NFC-tagiin' }
        </Button>
      </div>
    </div>
  );
};